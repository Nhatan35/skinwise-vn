# Current Sprint Plan - SkinWise VN MVP

Last updated: 2026-06-08

## 1. Current Phase

```txt
Post-MVP controlled improvement
```

Status:

```txt
Product implementation: COMPLETE at MVP level
Stable baseline: v1.11-final-mvp / v1.11-portfolio-demo-ready
Post-MVP backlog: CREATED in v1.12
UX polish implementation: DONE in v1.13
Data quality expansion: DONE in v1.14
Product Match explainability and safety guardrails: DONE in v1.15
Audit cleanup and evidence sync: DONE in v1.15.1
Saved Product Comparison & Decision Support: DONE in v1.16
Latest completed milestone: MVP v1.16 - Saved Product Comparison & Decision Support
Current active sprint: MVP v1.16 - Saved Product Comparison & Decision Support
Current active sprint status: DONE
Current phase: Post-MVP controlled improvement
Portfolio Evidence Package documentation: PREPARED
Optional media evidence tasks: screenshots and demo video
```

This sprint intentionally switches active work back from portfolio-only evidence to a controlled product-improvement task. The change is limited to the existing Saved Products experience.

## 2. Objective

Allow users to select 2-3 saved products and compare existing skincare product fields side by side while preserving:

```txt
No medical diagnosis
No treatment claims
No product ranking
No best/worst product conclusion
No recommendation engine
No real AI recommendation
No marketplace/cart/checkout/payment/review/rating/social scope
No database schema or collection change
No unnecessary API route
Existing save, unsave, and product detail behavior
```

## 3. Files Touched

Planned/active files:

```txt
src/modules/saved-products/components/saved-products-page.tsx
src/modules/saved-products/components/saved-product-card.tsx
src/modules/saved-products/components/saved-products-comparison-panel.tsx
tests/unit/saved-products-ui.test.ts
tests/e2e/saved-products.authenticated.spec.ts
docs/post-mvp-backlog.md
docs/ai-coding/03-feature-status-matrix.md
docs/ai-coding/05-ai-change-log.md
docs/ai-coding/06-current-sprint-plan.md
```

## 4. Acceptance Criteria

Functional:

```txt
[x] User can select a saved product for comparison.
[x] User can deselect a selected product.
[x] User can select 2-3 products to compare.
[x] User cannot select more than 3 products.
[x] Comparison panel appears only when 2 or more products are selected.
[x] Comparison panel disappears when fewer than 2 products are selected.
[x] User can clear all selected comparison products.
[x] User can still view product details.
[x] User can still unsave products.
[x] Removing a saved product removes it from comparison state.
[x] Saved product reloads prune stale selected product ids.
```

Content and safety:

```txt
[x] Panel title is "So sánh sản phẩm đã lưu".
[x] Disclaimer is visible: "Thông tin chỉ mang tính giáo dục, không thay thế tư vấn y khoa."
[x] Empty fields show "Chưa có dữ liệu".
[x] UI does not say which product is best or worst.
[x] UI does not rank products.
[x] UI does not make treatment claims.
[x] UI does not give medical advice.
[x] UI does not pretend to recommend a product.
[x] Warnings and notRecommendedFor use cautious educational wording.
```

Technical:

```txt
[x] Comparison state uses item.productId.
[x] Set state is updated immutably.
[x] No database schema change.
[x] No new MongoDB collection.
[x] No unnecessary API route.
[x] No recommendation engine.
[x] No unrelated refactor.
[x] Existing Saved Products behavior remains intact.
```

Documentation:

```txt
[x] Backlog updated.
[x] Current sprint plan updated.
[x] Change log updated.
[x] Feature status matrix updated.
[x] No conflicting active v1.16 item remains.
[x] v1.16 is marked DONE only after validation passes.
```

## 5. Validation Checklist

Required before marking DONE:

```txt
[x] npm run lint
[x] npm run typecheck
[x] npm run test
[x] npm run build
[x] npm run test:e2e
[x] npm audit --omit=dev --audit-level=moderate
```

Current validation status:

```txt
Evidence date: 2026-06-08
Environment: Local Windows / PowerShell
Node: v24.14.0
npm: 11.14.1
npm run lint: PASS
npm run typecheck: PASS
npm run test: PASS - 97 files / 903 tests
npm run build: PASS after sandbox spawn EPERM rerun outside the sandbox
npm run test:e2e: PASS after sandbox spawn EPERM rerun outside the sandbox - 30/30 Playwright tests
npm audit --omit=dev --audit-level=moderate: PASS - 0 vulnerabilities
```

## 6. Non-Goals

```txt
No medical diagnosis.
No prescription or treatment guidance.
No skin score.
No image upload or image analysis.
No marketplace, cart, checkout, or payment.
No reviews, ratings, likes, or sharing.
No admin CRUD.
No database schema, collection, or index change.
No real AI recommendation.
No broad redesign of Saved Products.
No unrelated refactor.
```

## 7. Suggested Commit

```bash
git add .
git commit -m "feat: add saved product comparison"
```
