---
name: isp-port-extension-blast-radius
description: Before making a new narrow port extend an existing wide port, check who already implements the wide one outside your ticket's touchable scope.
metadata:
  type: feedback
---

When segregating an interface (ISP) by pulling one method off an existing port into a new, narrower port (e.g. `IncidentReadRepositoryPort` off `IncidentRepositoryPort`, `T-C1-99`), decide **independent interfaces** over **the wide one extending the narrow one** whenever the wide port already has implementers you are not allowed to touch this ticket (test doubles or adapters in `apps/**`, another context's library, etc.).

**Why:** extension only adds inheritance in one direction, but it still forces *every existing implementer of the wider interface* to add the new method or fail to compile — even implementers that live in files explicitly listed under "Lo que NO debes tocar". Discovered on `T-C1-99`: making `IncidentRepositoryPort extends IncidentReadRepositoryPort` broke two pre-existing `implements IncidentRepositoryPort` test doubles in `apps/api/src/app/incident/*.spec.ts`, which the ticket forbade editing. Keeping the two ports independent (the new port declares its own one-line method signature, duplicated rather than inherited) cost nothing to any existing implementer; only the one adapter that needs to satisfy both (`TypeOrmIncidentRepository`) declares `implements PortA, PortB` explicitly.

**How to apply:** before choosing extension, `grep -rn "implements <WidePortName>"` across the whole repo (not just the libs you're about to touch) and check whether every match is inside your ticket's editable surface. If even one implementer sits outside it, use independent interfaces and accept the small signature duplication — it is far cheaper than a change you have no license to make. If every implementer is yours to touch, extension is fine and avoids the duplication.
