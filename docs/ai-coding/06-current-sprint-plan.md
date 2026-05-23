# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-23

## 1. Current sprint

```txt
TASK SJ-001 - Implement SkinJournal Backend API Foundation
```

## 2. Sprint goal

Add the authenticated SkinJournal backend API foundation without UI, image upload, image storage, or AI journal analysis.

## 3. Completed before this sprint

```txt
Week 1 Foundation completed
Week 2 Skin Profile, Product, and Ingredient Foundation completed
Week 3 Routine Builder and Routine Logs completed
Week 4 Routine Safety Engine and Routine Analysis completed
Week 5 AI Explanation and Ingredient Explainer completed
TASK AI-007 - Ingredient Explanation API with Validated AI Provider Fallback completed
```

## 4. Completed this sprint

```txt
[x] TASK SJ-001 - Implement SkinJournal Backend API Foundation completed.
[x] `POST /api/skin-journal` added.
[x] `GET /api/skin-journal` added.
[x] `PATCH /api/skin-journal/[id]` added.
[x] `DELETE /api/skin-journal/[id]` added.
[x] Endpoints require authentication.
[x] Repository operations are scoped by authenticated `userId`.
[x] Duplicate `userId + localDate` creates return `CONFLICT`.
[x] `localDate` is stored and queried as `YYYY-MM-DD`.
[x] PATCH cannot change `localDate`.
[x] Request schemas reject unknown fields and future image/photo fields.
[x] Public DTOs omit `userId`, `_id`, raw ObjectId values, image fields, and photo fields.
[x] Unit and API contract tests were added.
[x] Existing database collection helper and index definitions were reused.
[x] No dependency was added.
[x] UI was not changed.
[x] Image upload was not implemented.
[x] AI journal analysis was not implemented.
```

## 5. Not allowed this sprint

```txt
SkinJournal UI
Journal timeline page
Journal form page
Image upload
Image storage
Image analysis
AI journal analysis
Product lookup or validation for productsUsed
OpenAI changes
Gemini changes
Routine Analysis changes
Ingredient Explanation changes
Skin score
Medical diagnosis or medical recommendation features
```

## 6. Known follow-up

```txt
SkinJournal UI is not implemented yet.
SkinJournal dashboard integration is not implemented yet.
productsUsed is stored as string IDs and is not product-validated in SJ-001.
Future private image fields remain reserved and are not exposed by the MVP API.
```

## 7. Recommended next task

```txt
TASK SJ-002 - Implement SkinJournal Timeline UI
```
