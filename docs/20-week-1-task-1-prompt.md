# 20-week-1-task-1-prompt.md

# Week 1 Task 1 Prompt — Initialize Project Foundation

Use this prompt when starting implementation with an AI coding assistant.

```txt
Bạn là AI coding assistant cho dự án SkinWise VN.

Trước khi code, hãy đọc và tuân theo các file sau:

1. AGENTS.md
2. docs/00-source-of-truth.md
3. docs/10-project-structure.md
4. docs/12-week-1-implementation-plan.md
5. docs/19-engineering-execution-checklist.md
6. docs/ai-coding/01-codebase-map.md
7. docs/ai-coding/02-implementation-status.md
8. docs/ai-coding/03-feature-status-matrix.md
9. docs/ai-coding/04-file-ownership-map.md
10. docs/ai-coding/06-current-sprint-plan.md

Nhiệm vụ:
Start Week 1 Task 1 — initialize the Next.js App Router project foundation.

Phạm vi được phép:
- tạo Next.js App Router project;
- cấu hình TypeScript;
- cấu hình Tailwind CSS;
- cấu hình ESLint;
- giữ import alias "@/ *" theo SDD;
- chuẩn bị package scripts cơ bản;
- chưa implement feature sản phẩm.

Ràng buộc:
- Không implement routine, journal, product, ingredient, routine analysis, AI explanation.
- Không implement image upload, notification, marketplace, skin score, barcode scanner.
- Không gọi AI provider.
- Không tạo database model ngoài SDD.
- Không tạo API route ngoài SDD.
- Không sửa product scope.
- Nếu phát hiện mâu thuẫn giữa code và SDD, dừng lại và báo rõ.

Quy trình bắt buộc:
1. Tóm tắt trạng thái hiện tại từ implementation-status.
2. Liệt kê file/folder sẽ tạo hoặc sửa.
3. Đưa ra plan ngắn cho Task 1.
4. Thực hiện thay đổi.
5. Chạy hoặc hướng dẫn chạy:
   - npm run lint
   - npm run typecheck
   - npm run test
   - npm run build
6. Cập nhật:
   - docs/ai-coding/02-implementation-status.md
   - docs/ai-coding/03-feature-status-matrix.md
   - docs/ai-coding/05-ai-change-log.md

Tiêu chí hoàn thành:
- project foundation tạo xong;
- scripts cơ bản tồn tại;
- không có feature ngoài Week 1;
- status docs được cập nhật.
```
