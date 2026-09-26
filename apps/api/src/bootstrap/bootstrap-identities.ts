import { Identity } from '@sport-itsm/shared-domain';

/**
 * The fixed Requester identity delivery slice 1 logs every Incident as
 * (`T-C10-74`), because that slice has no authentication at all — not even a
 * fixed-user sign-in — so nothing resolves a real, per-request `Identity` for
 * `LogIncidentUseCase` to accept.
 *
 * **Ownership is temporary and stated up front (`T-C10-74`'s own `## Context`
 * and AC4).** This ticket declares the constant only because `T-C10-72` (the
 * seed migration that will actually insert the matching `iam.iam_user` row)
 * does not ship in slice 1 — with auth deferred, nothing reads that table yet
 * and `Incident.reporter_user_id` is a soft reference with no foreign key
 * (`DATA-MODEL.md` §20, line 2446), so seeding it now would buy the slice
 * nothing. **When `T-C10-72` is implemented, it becomes the row's actual
 * writer and takes over this constant**: it declares
 * `BOOTSTRAP_REQUESTER_ID` in its own migration file, using it as the seeded
 * Requester's explicit primary key, and this file must be updated in the
 * same change to import it from there instead of declaring it here — one
 * line in each file, so the literal never has two independent owners at
 * once.
 *
 * The literal itself is a valid UUID v7 (`Identity.fromString` enforces the
 * kernel's canonical shape, `ARCHITECTURE.md` §9 / ADR-012) chosen once, here
 * — every consumer imports this constant rather than typing the string
 * again, which is what keeps `T-C10-74`'s AC2 ("the literal UUID value
 * appears in exactly one place") true for as long as this ticket owns it.
 */
export const BOOTSTRAP_REQUESTER_ID: Identity = Identity.fromString(
  '01920000-0000-7000-8000-000000000001',
);
