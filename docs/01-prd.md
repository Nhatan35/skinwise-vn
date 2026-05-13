# 01-prd.md

# Product Requirements Document — MVP v1.2.6

## 1. MVP scope

The MVP focuses on routine safety, ingredient education, routine consistency tracking, and privacy-first journaling.

### Included

- Authentication with Auth.js / NextAuth.
- Skin profile onboarding.
- Product mini database.
- Ingredient mini knowledge base.
- Morning/evening routine builder.
- RoutineLog for daily completion tracking.
- Rule-based routine safety analysis.
- AI-generated Vietnamese explanation based on rule results.
- Skin journal for observations and symptoms.
- Basic dashboard.

### Excluded

- Marketplace checkout.
- Affiliate monetization.
- Medical diagnosis.
- Face scoring.
- Dermatologist booking.
- Full barcode scanner.
- Large-scale product crawling.
- Community feed.
- Push notifications in v1.

## 2. Core features

### Feature 1: Skin Profile

Collect user skincare context:

- Skin type.
- Main concerns.
- Sensitivity level.
- Budget range.
- Experience level.
- Ingredients to avoid.

### Feature 2: Product Database

A small curated product database for MVP:

- Product name.
- Brand.
- Category.
- Ingredient text.
- Key actives.
- Price range.
- Supported skin types.
- Supported concerns.
- Not-recommended-for notes.
- Verification status.

### Feature 3: Routine Builder

Users can create morning and evening routines.

Each routine contains ordered steps with:

- Product reference or custom product name.
- Product snapshot fields for analysis stability.
- Category.
- Frequency.
- Instructions.

### Feature 4: RoutineLog

Users can mark routine steps as completed or skipped on a specific date.

RoutineLog is separate from SkinJournal:

- RoutineLog = behavior tracking.
- SkinJournal = observation tracking.

This separation supports future dashboard metrics such as routine consistency, missed steps, and correlation between routine usage and journal observations.

### Feature 5: Routine Safety Analysis

The system runs deterministic safety rules before AI.

Examples:

- Missing sunscreen in morning routine.
- Too many exfoliating actives.
- Retinoid and exfoliant in same evening routine.
- Too many products for beginner.
- Multiple fragrance-heavy products for sensitive skin.

### Feature 6: AI Explanation

AI explains rule results in Vietnamese.

AI must:

- Use structured JSON output.
- Avoid medical diagnosis.
- Avoid treatment guarantees.
- Include disclaimer.
- Recommend professional help for severe or persistent symptoms.

### Feature 7: Skin Journal

Users can log:

- Date.
- Products used.
- Skin observations.
- Symptoms.
- Sleep/stress optional.
- Notes.
- Optional image later.

## 3. User flows

### Flow A: New user onboarding

1. User signs up.
2. User completes skin profile.
3. User sees starter routine guidance.
4. User creates first routine.
5. User runs routine safety analysis.

### Flow B: Analyze current routine

1. User opens routine detail page.
2. User clicks "Analyze routine".
3. Client calls `POST /api/routines/:id/analyze`.
4. System loads routine by `routineId + userId`.
5. System runs rule engine.
6. AI explains warnings using structured output.
7. User sees warnings, suggestions, and disclaimer.

### Flow C: Track routine completion

1. User opens today's checklist.
2. User marks routine steps as completed or skipped.
3. System creates or updates RoutineLog.
4. Dashboard displays consistency summary.

### Flow D: Explain ingredient

1. User searches or inputs ingredient.
2. System retrieves known ingredient data.
3. AI generates beginner-friendly explanation.
4. User sees cautions and safe usage context.

### Flow E: Journal tracking

1. User logs skin observations.
2. User records symptoms and notes.
3. User reviews timeline.
4. User compares consistency and changes over time.

## 4. Success metrics

### Activation

- 70% of registered users complete skin profile.
- 50% create at least one routine.
- 40% run first routine analysis.

### Engagement

- 30% return within 7 days.
- 25% create at least 3 journal entries.
- 35% create at least 3 RoutineLog records.
- Average routine analysis completion under 10 seconds.

### Safety

- 100% AI responses include disclaimer.
- 100% AI outputs conform to JSON schema.
- 0 known cross-user data access issues.
- 100% user-owned API routes check ownership.

## 5. Assumptions

- Users are willing to enter routine information manually.
- A small ingredient/product database is enough for MVP validation.
- Rule-based safety checks can cover high-value beginner risks.
- AI is most useful for explanation, not final decision-making.
- RoutineLog is needed for real consistency metrics.

## 6. Constraints

- Must use Next.js App Router and TypeScript.
- Must use MongoDB Atlas for MVP.
- Must validate API inputs with Zod.
- Must not call AI directly from client-side code.
- Must keep AI provider abstracted.
- Must use rule engine before AI.
- Must avoid medical diagnosis and treatment claims.
- Must use one canonical routine analysis endpoint: `POST /api/routines/:id/analyze`.

## 7. Out-of-scope features

- Payment.
- Subscription.
- Marketplace.
- Product scraping.
- Dermatologist chat.
- Advanced image analysis.
- Automated diagnosis.
- Social feed.
