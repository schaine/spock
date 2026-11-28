# Spock keeps only the latest value of each figure; Revisions go in the public Update log

When a Publisher revises a value it published earlier, Spock replaces the old value with the corrected one, so charts always show the Publisher's latest figures. The change is recorded in the Update log, which is public and kept forever, together with new values, missed checks and changes to a Series. We chose this over keeping every past version of every value ("what was known on each date") because that is much heavier to build and to show, and Spock's question is where the economy is going, not what forecasters knew at the time.

Approved by the Owner, `schaine`, on 2026-11-23, during the grill on the daily data collection.

## Considered options

- Keep every past version of every value. Rejected as too heavy for what it adds.

## Consequences

- Hard to undo: the versions Spock did not keep cannot be recovered later. From the day collection starts, though, the Update log keeps each Revision's old and new value.
- A Flag already raised stays in the record with its date and the values it was based on, even if a later Revision would no longer trigger it. It is never quietly deleted.
- A value the Publisher stops giving is kept, not deleted, and the Update log says once that the Publisher no longer gives it. Approved by the Owner on 2026-11-28 (ticket #17).
