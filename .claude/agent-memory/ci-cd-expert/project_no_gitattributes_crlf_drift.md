---
name: project-no-gitattributes-crlf-drift
description: No .gitattributes exists — Windows checkouts silently drift to CRLF for most text files while the git-committed content (and Linux CI) stays LF, producing false-positive local `prettier --check` failures
metadata:
  type: project
---

The repository has no `.gitattributes`. With the local Windows machine's `core.autocrlf=true`,
git checks most text files (`.ts`, `.yml`, `.md`, `.mjs`) out as CRLF even though every file's
git-committed blob is LF (confirmed via `git show HEAD:<path>`, which always returns LF and
always passes `pnpm prettier --check`). `*.json` files are the one visible exception — they
stay LF on disk too, most likely because Nx generators and the `Write`/`Edit` tools create or
rewrite them with plain Node `fs` calls (always LF) rather than by a fresh `git checkout`.

**Why this matters:** on 2026-09-25, editing `apps/api-e2e/project.json`,
`docker/docker-compose.e2e.yml` and `.github/workflows/deploy-stage.yml` (while wiring the
ephemeral acceptance database for `apps/api-e2e`, documented in
`.claude/skills/ci-cd/references/database.md`) preserved each file's pre-edit on-disk line
ending, which for the two non-JSON files was already CRLF from checkout. That made
`pnpm prettier --check` fail locally on files whose actual committed content — and whatever a
Linux GitHub Actions runner will check out — is perfectly fine. Diagnosed by extracting each
file's `HEAD` blob with `git show` and confirming it parses LF and passes prettier cleanly,
then normalizing the three working-tree files back to LF (`content.replace(/\r\n/g, '\n')`) so
the local check result actually matches what CI will see. `git diff` on the normalized files
then warned `LF will be replaced by CRLF the next time Git touches it` — harmless; `autocrlf`
reconverts on the *next* checkout of that file, but the git object it stores on commit is
still LF, which is the only copy that matters.

**How to apply:** when `pnpm prettier --check <files I touched>` fails locally on this machine
for a file I did not intentionally reformat, suspect CRLF-from-checkout before suspecting a
real formatting issue — verify with `git show HEAD:<path> | git hash-object --stdin -w` style
comparison, or simpler, `file <path>` (look for "with CRLF line terminators") plus
`git diff --stat` (a `git diff` full-file rewrite with `warning: ... LF will be replaced by
CRLF` on the next `git add` is the tell). Normalize back to LF before reporting a formatting
check as green, rather than either declaring a false failure or silently trusting a red result.
A `.gitattributes` with `* text=auto eol=lf` (or per-extension) would remove this whole class of
noise, but adding one is an infrastructure decision beyond any single ticket's scope — report it
as a finding, do not add it as a side effect of an unrelated change.
