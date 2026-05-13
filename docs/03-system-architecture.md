# 03-system-architecture.md

# System Architecture — MVP v1.2.6

## 1. Architecture decision

SkinWise VN uses a modular monolith architecture for MVP.

```txt
Next.js App Router
  ├── UI Layer
  ├── API Layer
  ├── Application / Use Case Layer
  ├── Domain Layer
  └── Infrastructure Layer
```

## 2. Why modular monolith

A modular monolith is recommended because:

- The project is early-stage.
- One developer or a small team can move faster.
- Deployment is simpler.
- Debugging is easier.
- Transactions and ownership checks are easier.
- Modules can later be extracted into services.

Microservices are not recommended for MVP because they add operational complexity: service discovery, distributed tracing, network failures, inter-service auth, data synchronization, and deployment orchestration.

## 3. UI layer

Location:

```txt
src/app/
src/shared/components/
```

Responsibilities:

- Pages.
- Layouts.
- Forms.
- Client-side interactions.
- Loading, error, and empty states.
- Calling server APIs.

Rules:

- No direct database access.
- No direct AI provider access.
- No API keys in client code.
- No business rules inside UI components.

## 4. API layer

Location:

```txt
src/app/api/
```

Responsibilities:

- Receive HTTP requests.
- Authenticate user.
- Validate request body with Zod.
- Call application use cases.
- Return standardized JSON response.

Canonical routine analysis route:

```txt
POST /api/routines/:id/analyze
GET  /api/routines/:id/analyses
```

The route is nested under routines because analysis is a sub-resource of a user-owned routine.

## 5. Application / use case layer

Location:

```txt
src/modules/*/*.use-case.ts
```

Responsibilities:

- Orchestrate business flows.
- Check ownership.
- Call repositories.
- Call domain services.
- Call AI service through abstraction.
- Return DTOs to API layer.

Example:

```txt
AnalyzeRoutineUseCase
  -> Load routine by routineId and userId
  -> Run RoutineSafetyEngine
  -> Call AIAnalysisService
  -> Store RoutineAnalysis
  -> Return result
```

## 6. Domain layer

Location:

```txt
src/domain/
```

Responsibilities:

- Entities.
- Value objects.
- Domain errors.
- Rule engine.
- Safety rules.
- Domain constants.

Rules:

- No framework-specific code.
- No database-specific code.
- No HTTP request/response code.
- Deterministic safety rules must live here.

## 7. Infrastructure layer

Location:

```txt
src/infrastructure/
```

Responsibilities:

- MongoDB connection.
- Repositories.
- AI provider implementation.
- Storage provider implementation.
- Email provider.
- Analytics and logging.

## 8. Module boundaries

Initial modules:

```txt
auth
users
skin-profile
products
ingredients
routines
routine-logs
ai-analysis
journals
notifications // reserved for future; do not implement in MVP Week 1
```

Each module should own:

- validation schema;
- repository interface;
- use cases;
- DTOs;
- tests.

## 9. AI architecture

```txt
UI
  -> API Route
    -> Use Case
      -> RoutineSafetyEngine
        -> AIAnalysisService
          -> AIProvider
```

AI must not be called from the browser.

## 10. Project folder structure

Detailed folder conventions are specified in:

```txt
docs/10-project-structure.md
```

AI coding assistants must follow that file before creating implementation files.

## 11. Scalability path

### MVP

```txt
Single Next.js app
MongoDB Atlas
Single AI provider
Cloudinary/S3-compatible storage later only; do not implement image upload in Week 1
```

### Beta

```txt
Add Redis cache
Add job queue
Add AI response caching
Add admin review workflow
Add observability
```

### Growth

Extract heavy modules:

```txt
AI Analysis Service
Image Processing Service
Notification Worker
Product Knowledge Service
```

## 12. Future service extraction candidates

| Module | When to extract |
|---|---|
| AI Analysis | High AI traffic or cost control needed |
| Product Knowledge | Large product database and search traffic |
| Image Processing | Heavy uploads and analysis |
| Notification | Scheduled reminders and background jobs |
| Analytics | Need separate reporting pipeline |
