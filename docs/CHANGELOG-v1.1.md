# CHANGELOG-v1.1.md

# SDD v1.1 Changes

## 1. Reason for update

This version applies the review instructions from the uploaded guidance file and hardens the SDD before implementation.

## 2. Key corrections

### 2.1 Canonical routine analysis route

Changed from ambiguous route options to:

```txt
POST /api/routines/:id/analyze
GET  /api/routines/:id/analyses
```

### 2.2 Product model expanded

Added:

```txt
skinTypes
concerns
suitableFor
notRecommendedFor
```

### 2.3 RoutineStep snapshot fields added

Added:

```txt
productNameSnapshot
brandSnapshot
keyActivesSnapshot
ingredientTextSnapshot
```

### 2.4 RoutineLog added

Added RoutineLog as a separate entity from SkinJournal.

RoutineLog tracks completion behavior. SkinJournal tracks skin observations.

### 2.5 Auth.js env variables clarified

README now prefers consistent Auth.js v5-style variables:

```txt
AUTH_SECRET
AUTH_URL
AUTH_GOOGLE_ID
AUTH_GOOGLE_SECRET
```

### 2.6 Project structure added

Added:

```txt
docs/10-project-structure.md
```

### 2.7 Routine safety rules separated

Added:

```txt
docs/11-routine-safety-rules.md
```

### 2.8 SafetyClassifierResult schema added

Added JSON schema to:

```txt
docs/06-ai-contract.md
```

## 3. Files updated

```txt
docs/01-prd.md
docs/02-user-stories.md
docs/03-system-architecture.md
docs/04-data-model.md
docs/05-api-contract.md
docs/06-ai-contract.md
docs/08-test-plan.md
docs/09-release-plan.md
docs/10-project-structure.md
docs/11-routine-safety-rules.md
docs/source-notes.md
AGENTS.md
README.md
```
