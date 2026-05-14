# 06-current-sprint-plan.md

# Current Sprint Plan — SkinWise VN MVP v1.2.6

Last updated: 2026-05-14

## 1. Current sprint

```txt
Week 1 — Foundation Setup
```

## 2. Sprint goal

Create a clean, deployable Next.js foundation for SkinWise VN without implementing product features prematurely.

## 3. Allowed tasks this sprint

```txt
Initialize Next.js App Router project
Configure TypeScript
Configure Tailwind CSS
Initialize shadcn/ui
Create base project folders
Create .env.example
Create environment validation with Zod
Create MongoDB client helper
Create Auth.js foundation
Create protected dashboard shell
Create shared layout states
Create basic test setup
Create feature flag config
Prepare repeatable database index script placeholder
Copy or create PR checklist and CI template
Update implementation status docs
```

## 4. Not allowed this sprint

```txt
Routine analysis
AI explanation implementation
Ingredient AI explanation
Product recommendation
Image upload
AI face analysis
Skin score
Marketplace
Affiliate monetization
Barcode scanner
Community feed
Push notifications
Subscription/payment
Admin review UI
Microservices
RAG/vector database
Queue/background jobs
```

## 5. Sprint task breakdown

### Task 1 — Project initialization

Expected output:

```txt
package.json
next.config.ts
tsconfig.json
src/app/layout.tsx
src/app/page.tsx
```

### Task 2 — Tooling and UI foundation

Expected output:

```txt
Tailwind configured
shadcn/ui initialized
basic shared UI components available
```

### Task 3 — Environment validation

Expected output:

```txt
src/config/env.ts
.env.example verified
unit tests for env validation
```

### Task 4 — MongoDB foundation

Expected output:

```txt
src/infrastructure/database/mongodb.ts
src/infrastructure/database/collections.ts
unit tests or smoke checks
```

### Task 5 — Auth foundation

Expected output:

```txt
src/modules/auth/auth.config.ts
src/modules/auth/get-current-user.ts
src/app/api/auth/[...nextauth]/route.ts
src/middleware.ts
```

### Task 6 — Dashboard shell

Expected output:

```txt
src/app/(dashboard)/layout.tsx
src/app/(dashboard)/dashboard/page.tsx
navigation shell
empty states
no fake product feature implementation
```

### Task 7 — GET /api/me lazy AppUserProfile + Week 1 gate

Expected output:

```txt
src/app/api/me/route.ts
src/modules/users/app-user-profile.types.ts
src/modules/users/app-user-profile.repository.ts
src/modules/users/app-user-profile.mapper.ts
tests/unit/app-user-profile.test.ts
tests/unit/me-api-contract.test.ts
docs/ai-coding/02-implementation-status.md updated
docs/ai-coding/03-feature-status-matrix.md updated
docs/ai-coding/05-ai-change-log.md updated
```

## 6. Sprint Definition of Done

```txt
[x] App runs locally.
[x] Build passes.
[x] Lint passes.
[x] Basic tests run.
[x] Feature flag config exists.
[x] Repeatable database index script placeholder exists.
[x] CI template exists or is copied into the implementation repo.
[x] Folder structure matches docs/10-project-structure.md.
[x] Environment validation exists.
[x] MongoDB helper exists.
[x] Auth foundation exists.
[x] Dashboard shell exists.
[x] GET /api/me lazy AppUserProfile creation exists.
[x] No out-of-scope features implemented.
[x] Status docs updated.
```

## 7. Prompt to start sprint implementation

Use this prompt when starting coding:

```txt
Bạn là AI coding assistant cho dự án SkinWise VN.

Trước khi code, hãy đọc và tuân theo:
1. AGENTS.md
2. docs/00-source-of-truth.md
3. docs/10-project-structure.md
4. docs/12-week-1-implementation-plan.md
5. docs/19-engineering-execution-checklist.md
6. docs/ai-coding/01-codebase-map.md
7. docs/ai-coding/02-implementation-status.md
8. docs/ai-coding/03-feature-status-matrix.md
9. docs/ai-coding/06-current-sprint-plan.md
10. docs/20-week-1-task-1-prompt.md

Nhiệm vụ hiện tại:
Start Week 1 Foundation Setup.

Yêu cầu:
- Không thêm feature ngoài Week 1.
- Không động vào routine analysis, AI explanation, product recommendation, journal logic.
- Chỉ tạo/sửa file cần thiết cho foundation.
- Sau khi code xong, cập nhật implementation-status, feature-status-matrix và ai-change-log.
- Nếu thấy mâu thuẫn giữa code hiện tại và SDD, dừng lại và báo trước.
```
