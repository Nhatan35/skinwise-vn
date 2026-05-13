# 11-routine-safety-rules.md

# Routine Safety Rules — MVP v1.2.6

## 1. Purpose

This document defines deterministic routine safety rules. These rules run before AI.

AI can explain these rules, but AI must not override them.

## 2. Rule severity levels

| Severity | Meaning |
|---|---|
| low | Informational or mild improvement |
| medium | User should review and adjust |
| high | User should simplify, pause risky combination, or seek appropriate help if symptoms exist |

## 3. MVP rule table

| Rule code | Severity | Condition | Message |
|---|---|---|---|
| MISSING_SUNSCREEN_AM | medium | Morning routine does not include a sunscreen category step | Routine buổi sáng đang thiếu chống nắng. |
| TOO_MANY_ACTIVES | high | Routine includes 3 or more strong active signals such as AHA, BHA, retinoid, benzoyl peroxide, strong vitamin C | Routine có nhiều hoạt chất mạnh, người mới bắt đầu nên đơn giản hóa. |
| RETINOID_PLUS_EXFOLIANT | high | Evening routine contains retinoid plus AHA/BHA/PHA exfoliant in the same routine | Không nên dùng retinoid cùng acid tẩy da chết cùng một buổi nếu chưa có kinh nghiệm. |
| TOO_MANY_STEPS_BEGINNER | medium | User experienceLevel is beginner and routine has more than 7 steps | Routine có thể quá phức tạp cho người mới bắt đầu. |
| FRAGRANCE_SENSITIVE_CAUTION | medium | User sensitivityLevel is high or skinType is sensitive and routine has 2 or more fragrance-flagged products | Da nhạy cảm nên cẩn thận với nhiều sản phẩm có hương liệu. |
| MISSING_MOISTURIZER | low | Routine has treatment or exfoliant but no moisturizer category | Routine có treatment nhưng chưa có bước dưỡng ẩm hỗ trợ. |
| TOO_MANY_CUSTOM_PRODUCTS | low | More than 5 routine steps use customProductName without ingredient data | Nhiều sản phẩm chưa có dữ liệu thành phần nên phân tích có thể chưa đầy đủ. |

## 4. Active ingredient normalization

Before running safety rules, the rule engine must normalize ingredient and active names into deterministic `ActiveSignal` values.

```ts
type ActiveSignal =
  | "AHA"
  | "BHA"
  | "PHA"
  | "RETINOID"
  | "BENZOYL_PEROXIDE"
  | "VITAMIN_C_STRONG"
  | "FRAGRANCE";
```

### Normalization input order

For each routine step:

1. Read `keyActivesSnapshot` first.
2. Read `ingredientTextSnapshot` second.
3. If snapshot fields are missing and `productId` exists, load current product data and create a best-effort snapshot.
4. If only `customProductName` exists, classify only from available custom text and mark analysis confidence lower.

### Alias mapping

| Alias examples | Normalized signal |
|---|---|
| glycolic acid, lactic acid, mandelic acid, alpha hydroxy acid | AHA |
| salicylic acid, beta hydroxy acid | BHA |
| gluconolactone, lactobionic acid, polyhydroxy acid | PHA |
| retinol, retinal, retinaldehyde, adapalene, retinoid | RETINOID |
| benzoyl peroxide, BPO | BENZOYL_PEROXIDE |
| ascorbic acid, L-ascorbic acid, pure vitamin C | VITAMIN_C_STRONG |
| fragrance, parfum, perfume, essential oil blend | FRAGRANCE |

### Normalization algorithm

```txt
1. Convert text to lowercase.
2. Normalize punctuation and repeated whitespace.
3. Match known aliases.
4. Deduplicate ActiveSignal values per routine step.
5. Deduplicate ActiveSignal values across the routine for rule-level checks.
6. Preserve matched aliases in metadata for debugging.
```

Rule engine must run on normalized signals, not raw ingredient strings.

## 5. Rule engine output

```ts
type RuleResult = {
  code: string;
  severity: "low" | "medium" | "high";
  message: string;
  triggered: boolean;
  metadata?: Record<string, unknown>;
};
```

## 6. Risk level mapping

```txt
If any high rule is triggered -> riskLevel = high
Else if any medium rule is triggered -> riskLevel = medium
Else -> riskLevel = low
```

## 7. Safety wording constraints

Rule messages must not:

- diagnose disease;
- guarantee treatment results;
- shame appearance;
- force product purchases;
- suggest prescription medication.

Rule messages should:

- be calm;
- be specific;
- explain risk in simple Vietnamese;
- recommend simplification when appropriate.
