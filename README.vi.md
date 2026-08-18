<p align="center">
  <img src="assets/logo.svg" width="120" height="120" alt="InkOS Logo">
  <img src="assets/inkos-text.svg" width="240" height="65" alt="InkOS">
</p>

<h1 align="center">AI Agent Sáng Tác Truyện<br><sub>Hệ thống AI Agent cho tiểu thuyết, truyện ngắn, kịch bản, phim tương tác, IP nội dung và dịch thuật đa ngôn ngữ</sub></h1>

<p align="center">
  <a href="https://www.npmjs.com/package/@actalk/inkos"><img src="https://img.shields.io/npm/v/@actalk/inkos.svg?color=cb3837&logo=npm" alt="npm version"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-AGPL%20v3-blue.svg" alt="License: AGPL-3.0"></a>
  <a href="https://github.com/Narcooo/inkos/stargazers"><img src="https://img.shields.io/github/stars/Narcooo/inkos?style=flat&logo=github&color=yellow" alt="GitHub stars"></a>
  <a href="https://www.npmjs.com/package/@actalk/inkos"><img src="https://img.shields.io/npm/dm/@actalk/inkos?color=cb3837&logo=npm&label=downloads" alt="npm downloads"></a>
  <a href="https://clawhub.ai/narcooo/inkos"><img src="https://img.shields.io/badge/🦞%20ClawHub-Skill-FF6B35?labelColor=1a1a1a" alt="ClawHub Skill"></a>
</p>

<p align="center">
  <a href="README.en.md">English</a> | <a href="README.md">中文</a> | <a href="README.ja.md">日本語</a> | Tiếng Việt
</p>

---

InkOS là hệ thống AI Agent dành cho sáng tác truyện và dịch thuật đa ngôn ngữ: tiểu thuyết dài kỳ, truyện ngắn độc lập, kịch bản, đồng nhân ngoại truyện, phỏng văn tiếp bút, phim tương tác, thế giới mở và dịch thuật dài — tất cả đều bắt đầu từ cùng một bàn làm việc. Hỗ trợ Studio, TUI, CLI; giao sáng tạo, thiết lập, nhân vật, ký ức, kiểm duyệt, chỉnh sửa, bìa sách, trạng thái tương tác và giao hàng đa ngôn ngữ cho agent quản lý thống nhất.

---

## Tính Năng Nổi Bật

- **Studio Web** — giao diện trực quan, chat với AI để viết sách, tạo truyện ngắn, làm bìa, chơi thế giới mở
- **Hỗ trợ tiếng Việt** — viết truyện tiếng Việt ngay từ đầu, giao diện hoàn toàn tiếng Việt
- **37 chiều kiểm duyệt** — nhân vật, dòng thời gian, móc câu chuyện, nhịp độ, văn phong, chống AI slop
- **Ký ức dài hạn** — SQLite + JSON schema, không lo truyện dài bị lạc mạch
- **Đa mô hình** — Gemini, Kimi, Claude, GPT, Ollama, bất kỳ endpoint OpenAI-compatible
- **Tiến trình nền** — viết tự động nhiều chương, thông báo Telegram/webhook khi xong

---

## Cài Đặt Nhanh

Yêu cầu **Node.js 22+**.

```bash
npm i -g @actalk/inkos
```

### Khởi tạo dự án

```bash
inkos init my-novel
cd my-novel
inkos                  # mở Studio tại http://localhost:4567
```

Vào Studio → **Cấu hình mô hình** → chọn nhà cung cấp → dán API Key → Kiểm tra kết nối → Lưu.

### Hoặc cấu hình qua CLI

```bash
inkos config set-global \
  --provider custom \
  --base-url https://api.moonshot.cn/v1 \
  --api-key sk-... \
  --model kimi-k2.5
```

---

## Bắt Đầu Viết

### Tiểu thuyết dài

```bash
inkos book create --title "Thiên Đạo Thư Viện" --genre xuanhuan
inkos write next thiendaothuuvien      # viết chương tiếp
inkos write next thiendaothuuvien --count 5  # viết 5 chương liên tiếp
inkos status                           # xem tiến độ
inkos review list thiendaothuuvien     # xem bản nháp
inkos review approve-all thiendaothuuvien
inkos export thiendaothuuvien --format epub
```

### Truyện ngắn hoàn chỉnh

Trong Studio Chat, gõ:

```
Viết một truyện ngắn 12 chương, hướng: đô thị hôn nhân phản chuyển, nữ chính lấy được bằng chứng rồi phản công.
```

Hoặc qua CLI:

```bash
inkos short run \
  --direction "Đô thị, hôn nhân phản chuyển, nữ chính phản công" \
  --chapters 12 \
  --words 1500
```

### Thế giới mở / Phim tương tác

Trong Studio Chat, chọn **Thế giới mở** rồi mô tả:

```
Tạo một thế giới tiên hiệp. Thời gian không cố định theo lượt, luyện công có thể mất vài ngày. Trang bị có độ hiếm nhưng không dùng bảng số liệu.
```

---

## Cấu Hình Mô Hình

### Studio (khuyến nghị)

Vào **Cấu hình mô hình** trong Studio, chọn nhà cung cấp và dán API Key.

Studio hỗ trợ: Google Gemini, Moonshot (Kimi), MiniMax, DeepSeek, Zhipu, OpenRouter, kkaiapi, Ollama, LM Studio và bất kỳ endpoint OpenAI-compatible nào.

### CLI / môi trường triển khai

Dùng file `.env` trong thư mục dự án hoặc `~/.inkos/.env`:

```bash
INKOS_LLM_PROVIDER=custom
INKOS_LLM_BASE_URL=https://api.moonshot.cn/v1
INKOS_LLM_API_KEY=sk-...
INKOS_LLM_MODEL=kimi-k2.5
INKOS_DEFAULT_LANGUAGE=vi
```

### Đa mô hình theo agent

```bash
inkos config set-model writer gemini-2.5-pro --provider google
inkos config set-model auditor gemini-2.5-flash --provider google
inkos config show-models
```

---

## Chẩn Đoán

```bash
inkos doctor
```

Hiển thị nguồn cấu hình hiện tại, nhà cung cấp, mô hình và kiểm tra kết nối API.

---

## Cách Hoạt Động

InkOS dùng pi-agent harness làm lõi nhận thức và gọi công cụ. Mỗi chương dài chạy theo luồng:

**Lập kế hoạch → Biên soạn → Viết → Kiểm duyệt → Chỉnh sửa (nếu cần) → Đồng bộ trạng thái**

| Agent | Vai trò |
|---|---|
| **Radar** | Quét xu hướng thị trường, định hướng câu chuyện |
| **Planner** | Đọc ý định tác giả + trọng tâm + ký ức, tạo mục tiêu chương |
| **Composer** | Chọn ngữ cảnh từ trạng thái và tài liệu, biên dịch bộ quy tắc |
| **Architect** | Tạo nền tảng khi lập sách: thế giới quan, nhân vật, quy tắc |
| **Writer** | Viết nội dung dựa trên ngữ cảnh đã biên soạn |
| **Observer** | Trích xuất 9 loại sự kiện từ nội dung (nhân vật, địa điểm, móc câu...) |
| **Auditor** | Kiểm tra 37 chiều: liên tục tính, nhịp độ, văn phong, AI slop |
| **Reviser** | Sửa các vấn đề nghiêm trọng; mặc định tối đa 1 lần tự động |

### Ký ức dài hạn

| Lớp | Mục đích |
|---|---|
| `story/state/*.json` | Trạng thái có cấu trúc, xác thực bằng Zod schema |
| `story/*.md` | Bản chiếu dạng Markdown để người đọc xem |
| `story/memory.db` | SQLite FTS5 — truy vấn sự kiện, móc câu, tóm tắt theo độ liên quan |

---

## Tham Khảo Lệnh

| Lệnh | Mô tả |
|---|---|
| `inkos init [tên]` | Khởi tạo dự án |
| `inkos book create` | Tạo sách mới (`--genre`, `--brief <file>`, `--chapter-words`) |
| `inkos write next [id]` | Viết chương tiếp (`--count`, `--words`) |
| `inkos write rewrite [id] <n>` | Viết lại chương N |
| `inkos draft [id]` | Chỉ tạo bản nháp |
| `inkos audit [id] [n]` | Kiểm duyệt chương |
| `inkos revise [id] [n]` | Chỉnh sửa chương |
| `inkos short run` | Tạo truyện ngắn hoàn chỉnh |
| `inkos review list [id]` | Xem danh sách bản nháp |
| `inkos review approve-all [id]` | Duyệt tất cả |
| `inkos export [id]` | Xuất sách (`--format txt/md/epub`) |
| `inkos status [id]` | Xem trạng thái dự án |
| `inkos agent "<lệnh>"` | Chế độ agent ngôn ngữ tự nhiên |
| `inkos interact` | Cổng vào cho agent ngoài (`--json`, `--message`) |
| `inkos fanfic init` | Tạo sách đồng nhân từ nguyên tác |
| `inkos import chapters [id]` | Nhập chương có sẵn để tiếp tục |
| `inkos style analyze <file>` | Phân tích văn phong tham khảo |
| `inkos style import <file> [id]` | Áp dụng văn phong vào sách |
| `inkos forecast create/show/select` | Tạo và chọn nhánh cốt truyện tương lai |
| `inkos radar scan` | Quét xu hướng thị trường |
| `inkos eval [id]` | Báo cáo đánh giá chất lượng |
| `inkos doctor` | Chẩn đoán cấu hình và kết nối |
| `inkos config set-global` | Cài cấu hình LLM toàn cục |
| `inkos config set-model <agent> <model>` | Định tuyến mô hình theo agent |
| `inkos studio` / `inkos` | Mở Studio tại cổng 4567 |
| `inkos tui` | Mở TUI terminal toàn màn hình |
| `inkos up / down` | Khởi động/dừng tiến trình nền |
| `inkos update` | Cập nhật lên phiên bản mới nhất |

---

## Lộ Trình

- [x] Studio Web (Vite + React + Hono)
- [x] Thế giới mở / Phim tương tác
- [x] Hỗ trợ tiếng Việt
- [ ] Chỉnh sửa cục bộ (viết lại nửa chương + cập nhật tầng sau)
- [ ] Plugin agent tùy chỉnh
- [ ] Xuất định dạng nền tảng (Wattpad, TruyenFull...)

---

## Đóng Góp

```bash
pnpm install
pnpm dev       # chế độ theo dõi
pnpm test      # chạy kiểm thử
pnpm typecheck # kiểm tra kiểu
```

---

## Ghi Nhận

Runtime agent của InkOS được xây dựng trên [pi](https://github.com/badlogic/pi-mono) (`@mariozechner/pi-ai` và `@mariozechner/pi-agent-core`, tác giả Mario Zechner).

## Giấy Phép

[AGPL-3.0](LICENSE)
