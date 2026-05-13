# ADR-0001: Use Modular Monolith

## Status

Accepted

## Context

SkinWise VN is an MVP/final-project-scale product with multiple related domains: auth, skin profile, products, ingredients, routines, routine logs, routine analysis, AI explanation, and skin journal.

The project needs clean boundaries but does not yet need independent deployment, separate teams, or distributed systems complexity.

## Decision

Use a modular monolith.

Modules are separated by folder and responsibility, but deployed as one Next.js application.

## Consequences

Positive:

- simpler local development;
- simpler deployment;
- easier testing;
- easier AI-assisted coding;
- clear module boundaries without microservice overhead.

Trade-offs:

- modules share one deployment lifecycle;
- future extraction requires discipline around boundaries.

## Implementation rules

- follow `docs/10-project-structure.md`;
- keep business logic in use cases/domain services;
- keep route handlers thin;
- avoid cross-module database access unless defined by a use case contract;
- do not introduce microservices in MVP.
