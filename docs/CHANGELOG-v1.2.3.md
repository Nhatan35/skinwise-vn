# CHANGELOG-v1.2.3.md

# SDD v1.2.3 — Documentation Polish Only

## Summary

This version is documentation polish only. It does not change product positioning, does not add new MVP features, does not change architecture, and does not include code implementation.

SkinWise VN remains an AI skincare education and routine safety assistant, not a medical diagnosis app.

## Changes

### README

- Updated `Current SDD version` to `v1.2.3`.
- Updated `SDD version` to `MVP v1.2.3`.
- Simplified documentation map to reference the current changelog.
- Added note that older changelogs are kept for history.

### Source notes

- Updated source-notes version text to `v1.2.3`.
- Added v1.2.3 polish note.

### Heading numbering

- Fixed duplicated heading number in `docs/04-data-model.md`.
- Fixed duplicated heading number in `docs/07-security-privacy.md`.
- Renamed test-plan version-specific headings into stable descriptive headings.

### API Contract

- Added `CONFLICT` to common API errors.
- Clarified `POST /api/skin-journal` duplicate behavior:
  - one journal entry per `currentUser.id + localDate`;
  - duplicate same-day creation returns `CONFLICT`;
  - editing same day uses `PATCH /api/skin-journal/:id`.
- Clarified `POST /api/routine-logs` upsert behavior:
  - create when no record exists for `userId + routineId + localDate`;
  - update existing record when it exists;
  - never duplicate logs for the same unique key.

### Test Plan

- Added tests for SkinJournal duplicate `localDate` conflict.
- Added tests for RoutineLog upsert behavior.
- Added documentation consistency checks for README and source-notes version alignment.

### AGENTS.md

- Added v1.2.3 frozen SDD rules for AI coding assistants.

## No changes

- No new features.
- No architecture changes.
- No implementation code.
- No medical diagnosis scope.
- No treatment guarantees.
- No face scoring or appearance-pressure features.

## Freeze decision

After v1.2.3, the SDD is frozen for Week 1 Implementation Plan. Future changes should be limited to implementation notes, security corrections, or documentation bug fixes discovered during implementation.
