# 02-user-stories.md

# User Stories and Acceptance Criteria — MVP v1.2.6

## 1. Skin Profile

### Story

As a beginner skincare user,  
I want to create a skin profile,  
So that the app can personalize routine safety guidance based on my basic context.

### Acceptance criteria

- User can select skin type.
- User can select one or more skin concerns.
- User can select sensitivity level.
- User can select budget range.
- User can select experience level.
- User can update the profile later.
- API validates all enum values.
- User cannot update another user's skin profile.

## 2. Product Database

### Story

As a user,  
I want to choose products from a database or enter custom product names,  
So that I can build my skincare routine even if the app does not yet know every product.

### Acceptance criteria

- User can search products by name.
- User can filter by category.
- User can view product key actives.
- User can view suitable skin types and related concerns when available.
- User can add custom product text to routine.
- Product data has verification status.
- Admin can later review user-submitted product data.

## 3. Routine Builder

### Story

As a skincare user,  
I want to create morning and evening routines,  
So that I can organize what I use and when I use it.

### Acceptance criteria

- User can create a morning routine.
- User can create an evening routine.
- User can add, edit, delete, and reorder routine steps.
- Each step can reference a saved product or custom product name.
- Each step has category and frequency.
- Each step stores product snapshot fields at the time it is added or analyzed.
- User can only access their own routines.

## 4. RoutineLog

### Story

As a user,  
I want to mark which routine steps I completed each day,  
So that I can understand my consistency over time.

### Acceptance criteria

- User can create a RoutineLog for a date.
- User can mark completed step IDs.
- User can mark skipped step IDs.
- User can add short notes.
- User can update today's RoutineLog.
- User can only access their own RoutineLogs.
- Dashboard can calculate completion rate from RoutineLogs.

## 5. Routine Safety Analysis

### Story

As a beginner user,  
I want the app to analyze my routine for common safety issues,  
So that I can avoid overcomplicated or potentially irritating combinations.

### Acceptance criteria

- System uses `POST /api/routines/:id/analyze` as the canonical endpoint.
- System detects missing sunscreen in morning routine.
- System detects too many exfoliating actives.
- System detects retinoid plus exfoliant in the same evening routine.
- System detects too many steps for beginner users.
- System produces risk level: low, medium, or high.
- System stores rule results before AI explanation.
- System includes disclaimer.

## 6. AI Routine Explanation

### Story

As a user,  
I want AI to explain routine warnings in Vietnamese,  
So that I can understand what to change without reading technical skincare terms.

### Acceptance criteria

- AI receives only minimized routine context and rule results.
- AI response follows RoutineAnalysisResult JSON schema.
- AI does not diagnose disease.
- AI does not guarantee treatment outcomes.
- AI includes disclaimer.
- AI suggests professional help when severe or persistent symptoms are detected.

## 7. Ingredient Explainer

### Story

As a user,  
I want to understand cosmetic ingredients in simple Vietnamese,  
So that I can decide whether a product fits my routine.

### Acceptance criteria

- User can search ingredient by name or alias.
- System returns function, common uses, cautions, and avoid-with notes.
- AI explanation is beginner-friendly.
- AI avoids treatment guarantees.
- AI includes caution when ingredient is commonly irritating or active-heavy.
- Output follows IngredientExplanationResult JSON schema.
- Ingredient explanation is exposed through `POST /api/ingredients/explain`.
- Safety classifier runs before AI explanation when input may contain unsafe claims or prompt injection.

## 8. Skin Journal

### Story

As a user,  
I want to log skin observations separately from routine completion,  
So that I can track how my skin changes over time.

### Acceptance criteria

- User can create a journal entry using `localDate` and `timezone`.
- User can record products used.
- User can record observations and symptoms.
- User can edit or delete journal entries.
- User can only access their own journal.
- Optional image upload is private by default.

## 9. Account and data control

### Story

As a privacy-conscious user,  
I want to delete my data,  
So that I can control what the app stores about me.

### Acceptance criteria

- User can delete skin profile.
- User can delete routine.
- User can delete routine logs.
- User can delete journal entries.
- User can request account deletion.
- Deleted user-owned objects are not accessible.
- System does not log full personal notes by default.

## 10. Post-MVP v1.50 Saved Product Personal Tags

### Story

As an authenticated SkinWise VN user,
I want to add personal tags to my saved products,
So that I can organize and filter saved products by my own skincare intent.

### Acceptance criteria

- User can add one or more personal tags to a saved product.
- User can edit and remove tags on a saved product.
- User can filter saved products by one selected tag.
- Tags are stored on the user-owned saved-product record, not the global Product record.
- Tags are private to the authenticated user and are not exposed through public product catalogue or product detail APIs.
- Existing saved products without tags load as `tags: []`.
- Existing saved-product notes and decision-support metadata are preserved when tags are updated.
- Tags are validated for trimming, empty values, duplicate values, length, count, and allowed characters.

## 11. Post-MVP v1.51 Dashboard Routine Coverage Summary

### Story

As a logged-in SkinWise user,
I want to see a simple routine coverage summary on my dashboard,
So that I can understand whether my routine has basic morning/evening coverage and safe next steps.

### Acceptance criteria

- Dashboard API returns `routineCoverage`.
- Dashboard UI shows a routine coverage card.
- Card shows routine count, coverage items, caution count, and next action.
- Card links to the routines page.
- Wording stays educational and non-prescriptive.
- No schema change.
- No AI call.

## 12. MVP v1.52 - Dashboard Saved Product Tags Summary

### Story

As a logged-in SkinWise user,
I want to see a summary of my saved product personal tags on the dashboard,
So that I can quickly understand how my saved products are organized and continue reviewing them.

### Acceptance criteria

- Dashboard API returns `savedProductTags`.
- Dashboard UI shows a saved product tags summary card.
- Card shows total saved products.
- Card shows tagged and untagged product counts.
- Card shows top personal tags.
- Card links to the saved products page.
- Empty state works when there are no saved products.
- Empty state works when saved products exist but no tags have been added.
- No schema change.
- No AI call.
- No Product Match scoring change.

## 13. MVP v1.53 - Dashboard Saved Product Decision Queue Summary

### User Story

As a logged-in SkinWise VN user,
I want to see a simple decision queue summary for my saved products on the dashboard,
So that I can quickly know which saved products still need review before adding them to my routine.

### Business Value

- Helps users continue from saved product organization into decision-making.
- Shows whether saved products are still being considered, being tested, paused, kept, or missing decision metadata.
- Encourages users to review saved products before adding too many items into a routine.
- Stays educational and organizational only.

### Acceptance Criteria

- Dashboard API returns `savedProductDecisionQueue`.
- Summary includes total saved products, decision status counts, unset decision status count, missing planned routine slot count, missing personal note count, review-needed count, and `nextAction`.
- Dashboard UI shows a card named "Hàng chờ xem lại sản phẩm".
- Card shows total saved products and review-needed count.
- Card shows decision status breakdown for considering, testing, paused, kept, and unset status.
- Card shows missing planned routine slot and missing personal note counts.
- Card links to the saved products page.
- Empty state works when there are no saved products.
- Complete state works when saved products have enough organization metadata and no review-needed condition.
- Unknown non-blank decision status values are treated as review-needed without being displayed as supported categories.
- Wording remains educational, organizational, and non-medical.

### Out of Scope

- No database schema change.
- No saved product creation, update, deletion, normalization, or backfill.
- No Product Match scoring change.
- No Routine Safety Engine change.
- No AI call.
- No recommendation ranking.
- No notification or reminder logic.
- No admin product review workflow change.
- No public exposure of private saved-product metadata.

### Definition of Done

- Dashboard DTO includes `savedProductDecisionQueue`.
- Dashboard mapper computes all counts deterministically from existing saved-product records.
- Blank and unknown decision status values are handled safely.
- Dashboard renders the decision queue card with empty, review-needed, and complete states.
- Unit, API contract, UI, and E2E coverage are updated.
- Documentation and release evidence are updated for MVP v1.53.
- Production-ready is not claimed because MVP v1.48 deployed admin product review smoke remains open.

## 14. MVP v1.54 - Saved Products Review Queue Filters

### User Story

As a logged-in SkinWise VN user,
I want to filter my saved products by review status and missing organization details,
So that I can quickly find which products still need a decision, routine plan, or personal note.

### Business Value

- Completes the flow introduced by MVP v1.53: Dashboard shows how many saved products need review, and Saved Products helps users locate them.
- Reduces friction when users need to find saved products with missing decision status, planned routine slot, or personal note.
- Supports safer personal organization before users add too many products into a routine.
- Stays educational, organizational, non-medical, and non-diagnostic.

### Acceptance Criteria

- Saved Products page provides review queue filters.
- Filters include "Tất cả", "Cần xem lại", "Đang cân nhắc", "Đang dùng thử", "Tạm dừng", "Muốn giữ lại", "Chưa chọn trạng thái", "Chưa có kế hoạch routine", and "Chưa có ghi chú".
- "Tất cả" preserves the existing default saved-product list behavior and ordering.
- "Cần xem lại" uses the same review-needed rule as MVP v1.53.
- Supported status filters only show products with the matching `decisionStatus`.
- Missing-metadata filters show products with blank, missing, or whitespace-only values.
- Unknown non-blank `decisionStatus` values do not crash and are treated as review-needed.
- Filtered results do not duplicate products.
- Empty filtered state works.
- Existing saved-product edit, remove, tag, note, status, and comparison behavior remains unchanged.
- Wording remains educational, organizational, and non-medical.

### Business Rules

- Review-needed means at least one of: blank decision status, unknown non-blank decision status, blank planned routine slot, blank personal note, `decisionStatus === "considering"`, or `decisionStatus === "testing"`.
- Supported decision statuses are `considering`, `testing`, `paused`, and `kept`.
- Paused and kept products are not automatically review-needed unless another review-needed condition applies.
- Filtering is client-side, deterministic, read-only, and preserves loaded saved-product ordering.
- The page keeps local component state; no URL query contract is introduced in MVP v1.54.

### Out of Scope

- No database schema change.
- No saved product creation, update, deletion, normalization, or backfill as part of filtering.
- No Product Match scoring change.
- No Routine Safety Engine change.
- No AI call.
- No recommendation ranking.
- No notification, reminder, or review due-date logic.
- No admin product review workflow change.
- No public exposure of private saved-product metadata.
- No routing refactor.
- No new sorting behavior.

### Definition of Done

- Saved Products page includes review queue filters with accessible selected state.
- Shared deterministic review-needed logic is reused by Dashboard and Saved Products.
- Blank, whitespace-only, and unknown non-blank decision status values are handled safely.
- Unit, UI, and existing Saved Products E2E coverage are updated.
- Documentation and release evidence are updated for MVP v1.54.
- Production-ready is not claimed because MVP v1.48 deployed admin product review smoke remains open.

## 15. MVP v1.55 - Saved Product Review Reason Indicators

### User Story

As a logged-in SkinWise VN user,
I want to see why a saved product needs review,
So that I can quickly understand what information is missing or still undecided before updating my saved product details.

### Business Value

- Helps users understand why a product appears in the review queue.
- Reduces confusion after selecting the "Cần xem lại" filter.
- Shows whether the product is missing a decision status, planned routine slot, or personal note.
- Shows whether the product is still being considered or tested.
- Keeps the experience educational, organizational, non-medical, and non-diagnostic.

### Acceptance Criteria

- Saved Product cards show review reason indicators when at least one review reason exists.
- Products with no review reasons do not show the review reason section.
- Review reason labels include "Chưa chọn trạng thái", "Chưa có kế hoạch routine", "Chưa có ghi chú", "Trạng thái cần kiểm tra lại", "Đang cân nhắc", and "Đang dùng thử".
- Blank decision status maps to `missing-decision-status`, not `unknown-decision-status`.
- Unknown non-blank decision status maps to `unknown-decision-status`, not `missing-decision-status`.
- Complete paused and kept products do not show review reasons.
- Paused and kept are not review reason types.
- Products can show multiple review reasons without duplicates.
- Review reason ordering is deterministic.
- Existing v1.54 Saved Products filters continue to work.
- Existing saved-product actions and metadata display remain unchanged.
- Wording remains educational, organizational, and non-medical.

### Business Rules

- Review reasons are derived from existing saved-product metadata only.
- Reason order is: missing decision status, missing routine slot, missing personal note, unknown decision status, considering, testing.
- `getSavedProductReviewReasons` stays consistent with the shared v1.54 `needsSavedProductReview` logic.
- A product considered review-needed must have at least one review reason.
- A product with no review reasons must not be considered review-needed.
- Review reasons are display-only and must not mutate saved-product records.

### Out of Scope

- No database schema change.
- No saved product creation, update, deletion, normalization, or backfill as part of rendering reasons.
- No Product Match scoring change.
- No Routine Safety Engine change.
- No AI call.
- No recommendation ranking.
- No notification, reminder, or review due-date logic.
- No admin product review workflow change.
- No public exposure of private saved-product metadata.
- No routing refactor.
- No new sorting behavior.
- No new filters.
- No API contract change.

### Definition of Done

- Saved Product cards include review reason indicators.
- Review reason logic is deterministic and covered by tests.
- Unknown, blank, and whitespace-only values are handled safely.
- Complete paused and kept products do not show review reasons.
- Existing filters, saved-product actions, ordering, and metadata display continue to work.
- Unit, UI, and E2E tests are updated.
- Documentation and release evidence are updated for MVP v1.55.
- Production-ready is not claimed because MVP v1.48 deployed admin product review smoke remains open.

## 16. MVP v1.59 - Admin Product Create/Edit Lite

### User Story

As a SkinWise admin,
I want to create and edit lightweight product catalogue records,
So that demo product content can be managed without adding a full CMS or marketplace workflow.

### Business Value

- Makes the product catalogue feel more maintainable and production-like for portfolio demos.
- Keeps public visibility controlled by the existing `verificationStatus` review flow.
- Supports safe demo content maintenance without hard delete, image upload, full ingredient CRUD, marketplace, payment, or AI-generated product content.

### Acceptance Criteria

- Admin users can open `/admin/products` and see a `Tạo sản phẩm` action.
- Admin users can create a product with name, brand, category, price range, ingredients text, key actives, tags, warnings, skin types, concerns, suitable-for, not-recommended-for, and verification status.
- New admin-created products use `source = "admin"`.
- New products default to `verificationStatus = "unverified"` when no status is provided.
- Admin users can edit existing product content from the admin product list.
- `PATCH /api/admin/products/[id]/verification-status` remains available as the status-only review route.
- Non-admin and unauthenticated users cannot create or edit products.
- Server validation rejects empty required fields, invalid enum values, unknown/internal fields, and direct writes to `source`, `createdByUserId`, `_id`, `id`, `createdAt`, or `updatedAt`.
- Product DTO responses do not expose `source` or `createdByUserId`.
- `unverified` products appear in the admin list but do not appear in the public catalogue.
- `reviewed` and `verified` products can appear in the public catalogue.
- Existing Product Catalogue, Product Detail, Product Match scoring, Routine Safety, Routine Coverage, and Admin Product Review status workflow remain unchanged.

### Out of Scope

- No product hard delete.
- No image upload or image management.
- No full ingredient CRUD.
- No marketplace, cart, checkout, or payment.
- No user-submitted product approval expansion.
- No real AI generation.
- No medical diagnosis, treatment recommendation, or skin scoring.
- No production-ready claim while MVP v1.48 deployed admin product review smoke evidence remains incomplete.

### Definition of Done

- Admin create/edit API routes and UI are implemented.
- Schema, repository/use-case, API contract, client, UI, and E2E coverage are updated.
- Documentation and release evidence are updated for MVP v1.59.
- Production-ready is not claimed because MVP v1.48 deployed admin product review smoke remains open.

## 17. MVP v1.60 - Admin Ingredient Create/Edit Lite

### User Story

As a SkinWise admin,
I want to create and edit lightweight Ingredient Library records,
So that the ingredient knowledge base can be maintained without adding a full CMS.

### Business Value

- Makes Ingredient Library maintenance feel closer to a real product workflow.
- Keeps user-facing `/ingredients`, `/ingredients/[id]`, and ingredient explanation flows stable.
- Adds minimal data-quality protection for duplicate normalized `inciName` values.
- Avoids delete, merge/deduplication, bulk import, image upload, AI generation, product-to-ingredient auto-linking, and medical claims.

### Acceptance Criteria

- Admin users can open `/admin/ingredients`.
- Unauthenticated users are redirected or rejected according to the existing admin pattern.
- Non-admin users cannot view or call admin ingredient management.
- Admin users can list, search, and filter ingredients by function.
- Admin users can create ingredients with `inciName`, aliases, functions, common uses, suitable-for, caution-for, avoid-with, evidence level, and source references.
- Admin users can edit existing ingredient content.
- Create rejects empty `inciName`, invalid `evidenceLevel`, oversized values, and internal fields.
- Update supports partial fields and rejects empty `inciName`, invalid `evidenceLevel`, oversized values, and internal fields.
- Create and `inciName` update reject duplicate normalized names case-insensitively.
- PATCH invalid ids return 400; valid missing ids return 404.
- `sourceRefs` keeps the current `string[]` shape.
- Server sets `createdAt` and `updatedAt`; update refreshes `updatedAt`.
- User-facing `/ingredients`, `/ingredients/[id]`, `GET /api/ingredients`, `GET /api/ingredients/[id]`, and `POST /api/ingredients/explain` remain unchanged.
- Admin create/edit controls do not appear in user-facing ingredient routes.

### Out of Scope

- No ingredient delete or soft delete.
- No publish/unpublish workflow.
- No ingredient merge/deduplication workflow.
- No bulk CSV import/export.
- No ingredient image upload.
- No ingredient version history or audit log.
- No AI auto-generation or real AI provider change.
- No product ingredient auto-linking or product-to-ingredient relational mapping.
- No medical diagnosis, treatment recommendation, or production-ready claim.

### Definition of Done

- Admin ingredient API routes and UI are implemented.
- Schema, repository/use-case, API contract, client, UI, and E2E coverage are updated.
- Documentation and release evidence are updated for MVP v1.60.
- Production-ready is not claimed because MVP v1.48 deployed admin product review smoke remains open.

## 18. Post-MVP v1.3 Skin Progress Insights & Calendar

### Story

As a skincare tracker user,
I want to review my routine consistency, journal activity, symptoms, product mentions, and calendar history,
So that I can understand my own self-tracked skincare patterns without receiving diagnosis or appearance scoring.

### Acceptance criteria

- User can open the protected `/insights` route from dashboard navigation.
- User can view a latest 30-day range by default.
- User can request `GET /api/insights?from=YYYY-MM-DD&to=YYYY-MM-DD`.
- API validates real local dates and rejects partial, reversed, unknown-field, or over-90-day ranges.
- Routine consistency uses routine slots, not only days, so multiple routines per day are handled accurately.
- Calendar includes every local date in the selected range, including days with no logs or journal entries.
- Journal activity counts only the authenticated user's SkinJournal entries.
- Product usage shows only visible product catalogue records and skips missing, hidden, invalid, or unauthorized products.
- Next actions link to existing safe tracking routes such as `/routine-logs/today`, `/journal`, and `/routines`.
- UI copy remains neutral and must not include skin scores, diagnosis, medication advice, treatment claims, face analysis, or product-causality claims.
