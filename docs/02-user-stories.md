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

## 10. Post-MVP v1.3 Skin Progress Insights & Calendar

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
