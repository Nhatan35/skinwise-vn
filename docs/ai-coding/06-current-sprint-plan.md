# Current Sprint Plan - SkinWise VN MVP v1.2.6

Last updated: 2026-05-23

## 1. Current sprint

```txt
TASK SJ-002 - Implement SkinJournal Timeline UI
```

## 2. Sprint goal

Add the protected SkinJournal Timeline UI for authenticated users without changing the SJ-001 backend API contract and without image upload, AI journal analysis, calendar heatmap, or analytics/insight views.

## 3. Completed before this sprint

```txt
Week 1 Foundation completed
Week 2 Skin Profile, Product, and Ingredient Foundation completed
Week 3 Routine Builder and Routine Logs completed
Week 4 Routine Safety Engine and Routine Analysis completed
Week 5 AI Explanation and Ingredient Explainer completed
TASK AI-007 - Ingredient Explanation API with Validated AI Provider Fallback completed
TASK SJ-001 - Implement SkinJournal Backend API Foundation completed
```

## 4. Completed this sprint

```txt
[x] TASK SJ-002 - Implement SkinJournal Timeline UI completed.
[x] `/journal` page added at `src/app/(dashboard)/journal/page.tsx`.
[x] Dashboard navigation enables Journal with `routes.JOURNAL`.
[x] `/journal/:path*` is protected by the auth proxy.
[x] SkinJournal timeline lists entries from `GET /api/skin-journal`.
[x] Create form posts to `POST /api/skin-journal`.
[x] Edit form patches `PATCH /api/skin-journal/[id]`.
[x] Delete action calls `DELETE /api/skin-journal/[id]` after confirmation.
[x] Loading, empty, success, and error states were added.
[x] Client-side validation mirrors SJ-001 constraints for localDate, timezone, arrays, symptoms, sleepHours, stressLevel, and notes.
[x] Client payload builders send only canonical SkinJournal fields.
[x] Duplicate localDate conflicts map to a friendly UI message.
[x] Source-level and client/helper tests were added.
[x] No dependency was added.
[x] SJ-001 backend API contract was not changed.
[x] Image upload was not implemented.
[x] AI journal analysis was not implemented.
[x] Calendar heatmap and analytics/insight views were not implemented.
```

## 5. Not allowed this sprint

```txt
Backend SkinJournal API contract changes
Photo upload
Image preview
Image storage
Image analysis
AI journal analysis
Calendar heatmap
Analytics or insight view
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
productsUsed remains a string list and is not product-validated or name-resolved.
Future private image fields remain reserved and are not exposed by the MVP UI/API.
SkinJournal calendar/analytics views are not implemented.
SkinJournal AI analysis is not implemented.
Private journal image upload is not implemented.
```

## 7. Recommended next task

```txt
Choose the next SkinJournal task from product priorities:
- TASK SJ-003 - Add SkinJournal Product Linking / Product Name Resolution
- TASK SJ-003 - Implement SkinJournal Calendar/Insight View
- TASK SJ-003 - Implement Private Journal Image Upload
```
