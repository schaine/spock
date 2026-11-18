# Triage labels

The skills speak of five canonical triage roles. This table maps each role to
what this repo uses. **The right-hand column is the source of truth.**

| Canonical role | Label in this repo | Meaning |
| --- | --- | --- |
| `ready-for-agent` | `ready-for-agent` | Fully specified; the agent can build it alone |
| `needs-triage` | not used | No external issues in a solo repo |
| `needs-info` | not used | The issue is assigned to the owner instead |
| `ready-for-human` | not used | The issue is assigned to the owner instead |
| `wontfix` | not used | Close the issue as "not planned" instead |

When a skill mentions a role, use the label in the right-hand column. If it
says "not used", do what the "Meaning" column says instead.

To ask the owner for something (an answer, a click, an account), follow
`docs/agents/decisions.md`, section 7.
