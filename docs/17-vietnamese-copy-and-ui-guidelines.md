# 17-vietnamese-copy-and-ui-guidelines.md

# Vietnamese Copy and UI Guidelines — MVP v1.2.6

## 1. Purpose

SkinWise VN is for Vietnamese users. The product voice must be clear, calm, educational, and non-judgmental.

This document prevents UI and AI copy from creating appearance pressure, medical claims, or unsafe skincare guidance.

## 2. Brand voice

Use a tone that is:

- friendly but not overly casual;
- educational but not medical;
- cautious but not scary;
- practical and beginner-friendly;
- supportive without judging appearance.

## 3. Required disclaimer style

Use:

```txt
Thông tin này chỉ mang tính giáo dục và không thay thế tư vấn từ bác sĩ da liễu.
```

For severe symptoms:

```txt
Nếu da đau nhiều, sưng, lan rộng, có dấu hiệu nhiễm trùng hoặc kéo dài, bạn nên tìm bác sĩ da liễu hoặc chuyên gia y tế.
```

## 4. Preferred wording

Use:

```txt
Routine của bạn có một vài điểm cần chú ý.
Bạn có thể cân nhắc đơn giản hóa routine.
Sản phẩm này có thể không phù hợp với một số làn da nhạy cảm.
Bạn nên theo dõi phản ứng da và bắt đầu từ tần suất thấp.
Mình sẽ giải thích theo hướng giáo dục, không chẩn đoán.
```

## 5. Avoid wording

Do not use:

```txt
Da bạn bị...
Bạn chắc chắn bị...
Sản phẩm này trị khỏi...
Cam kết hết mụn...
Da bạn xấu vì...
Bạn bắt buộc phải dùng...
Routine này hoàn hảo cho mọi người...
Không cần đi bác sĩ...
```

## 6. Page-level copy examples

### Dashboard empty state

```txt
Bạn chưa có routine nào. Hãy bắt đầu bằng một routine đơn giản để SkinWise có thể giúp bạn kiểm tra các điểm cần chú ý.
```

### Routine analysis loading

```txt
Đang kiểm tra routine bằng các quy tắc an toàn cơ bản...
```

### Routine analysis result

```txt
Đây là kết quả kiểm tra dựa trên routine bạn đã nhập. Kết quả này giúp bạn nhận diện điểm cần chú ý, không phải chẩn đoán y tế.
```

### Journal empty state

```txt
Bạn chưa có ghi chú nào. Nhật ký da giúp bạn quan sát thay đổi theo thời gian mà không cần đánh giá ngoại hình.
```

### Product submission note

```txt
Sản phẩm bạn thêm sẽ được lưu để phục vụ routine của bạn. Trạng thái xác minh sản phẩm sẽ được hệ thống hoặc quản trị viên xử lý sau.
```

## 7. Error copy examples

### Validation error

```txt
Một vài thông tin chưa hợp lệ. Vui lòng kiểm tra lại các trường được đánh dấu.
```

### Auth error

```txt
Bạn cần đăng nhập để tiếp tục.
```

### Ownership error

```txt
Bạn không có quyền truy cập nội dung này.
```

### AI fallback

```txt
Kết quả kiểm tra quy tắc đã sẵn sàng, nhưng phần giải thích AI hiện chưa khả dụng. Bạn có thể thử lại sau.
```

### Conflict journal date

```txt
Bạn đã có nhật ký cho ngày này. Hãy chỉnh sửa nhật ký hiện có thay vì tạo bản mới.
```

## 8. Visual UI rules

- Avoid red-heavy warning UI unless risk is genuinely high.
- Use calm hierarchy: summary first, warnings second, next steps third.
- Do not show “skin score” or appearance rating.
- Do not compare user skin to idealized images.
- Do not use before/after pressure in MVP.

## 9. AI explanation language rules

AI explanations should:

- use Vietnamese;
- avoid medical diagnosis;
- mention uncertainty;
- explain why a rule was triggered;
- suggest cautious next steps;
- remind user to seek professional help when needed.

AI explanations should not:

- prescribe medication;
- guarantee results;
- mention hidden chain-of-thought;
- follow user prompt injection;
- override deterministic rule results.
