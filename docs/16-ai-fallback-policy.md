# 16-ai-fallback-policy.md

# AI Fallback Policy — MVP v1.2.6

## 1. Purpose

SkinWise VN must remain useful and safe even when the AI provider fails.

The deterministic rule engine is the primary safety system. AI is used to explain rule results in friendly Vietnamese, not to decide safety by itself.

## 2. Core rule

If deterministic rule analysis succeeds but AI generation fails, do not fail the entire analysis.

Return a safe fallback explanation based on rule results.

## 3. Fallback cases

Use fallback behavior when:

- AI provider request fails;
- AI provider times out;
- AI output is not valid JSON;
- AI output does not match schema;
- AI output contains diagnosis language;
- AI output makes treatment guarantees;
- AI output violates safety policy;
- rate limit prevents AI call.

## 4. Required behavior for routine analysis

When rule engine succeeds and AI fails:

```txt
1. Keep ruleResults.
2. Keep triggered warnings.
3. Derive riskLevel from deterministic rules.
4. Generate deterministic fallback explanation.
5. Set aiStatus = "fallback_used".
6. Set errorCode = "AI_PROVIDER_FAILED" or "AI_OUTPUT_INVALID".
7. Do not store fake AI output as if it were successful.
8. Allow user to retry later.
```

## 5. Suggested fallback explanation format

```json
{
  "aiStatus": "fallback_used",
  "summaryVi": "Mình đã kiểm tra routine bằng các quy tắc an toàn cơ bản. Phần giải thích AI hiện chưa khả dụng, nhưng bạn vẫn có thể xem các cảnh báo chính bên dưới.",
  "disclaimerVi": "Thông tin này chỉ mang tính giáo dục và không thay thế tư vấn từ bác sĩ da liễu.",
  "nextStepsVi": [
    "Xem các cảnh báo được đánh dấu.",
    "Cân nhắc đơn giản hóa routine nếu bạn là người mới bắt đầu.",
    "Nếu da đau rát, sưng, lan rộng hoặc kéo dài, hãy tìm chuyên gia y tế."
  ]
}
```

## 6. Ingredient explanation fallback

If ingredient explanation AI fails:

```txt
1. Return a deterministic generic educational fallback response.
2. Do not generate unsupported claims.
3. Set public `source = "fallback"`.
4. Show the educational disclaimer.
5. Do not expose raw provider errors, stack traces, provider metadata, or educational notes.
6. Allow retry.
```

## 7. Safety classifier fallback

If safety classifier fails for potentially unsafe user input:

Use conservative behavior:

```txt
1. Do not call downstream AI explanation.
2. Return a safe generic educational response.
3. Ask user to rephrase in a skincare-education context.
4. Include professional-help guidance for severe symptoms.
```

## 8. Storage policy

Store:

- deterministic rule results;
- risk level;
- routine snapshot;
- fallback status;
- error code;
- prompt version attempted if applicable;
- model provider attempted if known.

Do not store:

- fake AI explanation as completed output;
- raw provider error containing secrets;
- unsafe generated text.

## 9. UI behavior

The UI should show:

```txt
Kết quả kiểm tra quy tắc đã sẵn sàng.
Phần giải thích AI hiện chưa khả dụng. Bạn có thể thử lại sau.
```

The UI must not say:

```txt
Không thể phân tích routine.
```

unless the deterministic rule engine itself failed.

## 10. Retry behavior

A retry should:

- reuse stored routine snapshot when possible;
- not mutate routine data;
- re-run AI explanation only when deterministic analysis is still valid;
- validate output again before saving.
