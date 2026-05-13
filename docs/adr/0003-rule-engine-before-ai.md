# ADR-0003: Rule Engine Before AI

## Status

Accepted

## Context

SkinWise VN gives skincare education and routine safety explanations.

The product must avoid medical diagnosis, unsupported treatment promises, and AI-generated safety decisions that are hard to audit.

## Decision

Run deterministic `RoutineSafetyEngine` before any AI explanation.

AI may explain deterministic results in Vietnamese, but AI must not override:

```txt
riskLevel
ruleIds
safety warnings
medical disclaimer boundaries
```

## Consequences

Positive:

- safer behavior;
- easier testing;
- auditable routine analysis;
- AI output is constrained to explanation.

Trade-offs:

- rule coverage must be maintained;
- AI cannot compensate for missing deterministic rules.

## Implementation rules

- rule engine runs before AI;
- AI output must be validated;
- if AI fails, return deterministic fallback explanation;
- do not call AI provider from client code.
