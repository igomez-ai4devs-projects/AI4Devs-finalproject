---
name: project-no-gitattributes-crlf-drift
description: A root .gitattributes now exists (added 2026-09-25) fixing checkout-time CRLF drift on Windows going forward; it does not retroactively fix files already CRLF on disk from before it existed
metadata:
  type: project
---

**Superseded finding, kept for history:** this memory used to record that the repository had **no**
`.gitattributes`, causing Windows checkouts (`core.autocrlf=true`) to silently drift most text files
to CRLF on disk while every git-committed blob (and Linux GitHub Actions) stayed LF — a recurring
source of false-positive local `pnpm prettier --check` failures and, once, a CRLF shebang that broke
`docker/backend/docker-entrypoint.sh` inside a Linux container (`T-C10-69`).

**That gap is closed.** A root `.gitattributes` was added 2026-09-25 (`* text=auto eol=lf`, plus
explicit `*.sh text eol=lf` and `Dockerfile* text eol=lf`, plus a `binary` block for image/font
extensions). Verified before adding it: `git ls-files --eol` showed **0 files with `i/crlf`** — every
tracked text blob was already LF in the index, only the *working-tree* checkout (`w/crlf` on 409 of
450 tracked files) was wrong — so adding the file did not retroactively mark anything as modified;
`git status --short` right after creating it showed only the new `.gitattributes` itself as
untracked. `git check-attr -a -- docker/backend/docker-entrypoint.sh package.json
apps/api/src/main.ts` confirms attributes resolve (`eol: lf` on all three).

**What it does and does not fix:**
- Fixes: any **future** checkout (fresh clone, `git clone`, a file `git rm`'d and re-checked-out) —
  those will land as LF regardless of `core.autocrlf`.
- Does **not** fix: a file already sitting CRLF on disk in an existing working tree from before
  `.gitattributes` existed. Neither `git checkout HEAD -- <path>` nor `git checkout-index --force --
  <path>` reliably rewrites an unchanged path's line endings on this machine — confirmed empirically,
  both left `apps/api/src/main.ts` CRLF on disk. What works: read the file, `content.replace(/\r\n/g,
  '\n')`, write it back directly. After that, `git status --short` reports the path "modified" — this
  is a harmless stat-dirty artifact, not a real content change: `git diff --raw` on it is empty (same
  blob SHA as `HEAD`), and `pnpm prettier --check` on it goes green.

**How to apply:** [[feedback_cypress_local_verification]]-style — do not assume a green or red
`prettier --check` locally reflects CI; a file reported "modified" by `git status` after a
line-ending-only rewrite is not a real diff (check `git diff --raw`, not `git status`, to tell the
two apart) before reporting a formatting check as green or asking the user to review a spurious
change. Normalizing the **whole** working copy at once (so every one of the 409 CRLF-on-disk files
matches its LF blob) is a decision for the repo owner, not a side effect of an unrelated task — the
non-destructive path is `git add --renormalize .` after committing pending work (stages the
line-ending fix as its own commit, nothing is discarded); `git rm --cached -r . && git reset --hard`
also works but is destructive (discards anything uncommitted) and should only be offered with an
explicit warning.
