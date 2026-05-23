# Hướng dẫn triển khai: Lovable → Vercel

Dành cho dự án tạo từ **Lovable.dev** (TanStack Start + TanStack Router + Vite + React),
deploy lên Vercel — có hoặc không có Supabase backend.

---

## Stack

| Layer                | Công nghệ                                     |
| -------------------- | --------------------------------------------- |
| Framework            | TanStack Start (SSR) + TanStack Router        |
| Build                | `@lovable.dev/vite-tanstack-config` + Vite    |
| Styling              | Tailwind CSS v4 + shadcn/ui                   |
| Deploy               | Vercel (Node.js serverless)                   |
| Backend _(tuỳ chọn)_ | Supabase (Auth + PostgreSQL + Edge Functions) |

---

## Phần A — Bắt buộc (mọi dự án)

### A1 — Tắt Cloudflare adapter

Lovable mặc định build cho Cloudflare Workers. Vercel cần Node.js output.

**`vite.config.ts`:**

```ts
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
export default defineConfig({ cloudflare: false });
```

---

### A2 — Tạo Vercel serverless handler

Tạo file **`api/server.js`** — bridge từ Node.js `IncomingMessage` sang Web Fetch API mà TanStack Start dùng:

```js
import server from "../dist/server/server.bundle.js";

export default async function handler(req, res) {
  try {
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host =
      req.headers["x-forwarded-host"] || req.headers["host"] || "localhost";
    const url = `${protocol}://${host}${req.url}`;

    const chunks = [];
    if (!["GET", "HEAD"].includes(req.method)) {
      for await (const chunk of req) chunks.push(chunk);
    }

    const request = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: chunks.length > 0 ? Buffer.concat(chunks) : undefined,
    });

    const response = await server.fetch(request);

    res.statusCode = response.status;
    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (err) {
    console.error("[server] handler error:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain");
    res.end(
      `Server error: ${err?.message || String(err)}\n\n${err?.stack || ""}`,
    );
  }
}

export const config = { api: { bodyParser: false } };
```

> `server.bundle.js` được esbuild tạo lúc build — không commit vào git.

---

### A3 — Thêm script `build:vercel` vào `package.json`

`dist/server/server.js` (output của TanStack Start) import nhiều npm package bên ngoài
(`h3-v2`, `@tanstack/router-core`, `seroval`, `react`, `react-dom`…). Vercel không
trace được chúng qua build artifact. Dùng esbuild bundle thành 1 file self-contained.

Thêm vào `"scripts"` trong **`package.json`**:

```json
"build:vercel": "npm run build && mkdir -p public && cp -r dist/client/assets public/ && node_modules/.bin/esbuild dist/server/server.js --bundle --platform=node --format=esm --external:node:* \"--banner:js=import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);\" --outfile=dist/server/server.bundle.js"
```

**Giải thích từng phần:**

| Phần                                                  | Tác dụng                                                                                     |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `npm run build`                                       | Vite build → `dist/client/` (assets) + `dist/server/server.js`                               |
| `mkdir -p public && cp -r dist/client/assets public/` | Copy assets vào `public/` để Vercel serve static                                             |
| `esbuild ... --bundle`                                | Bundle `server.js` + tất cả npm deps → `server.bundle.js`                                    |
| `--external:node:*`                                   | Giữ Node.js built-ins bên ngoài bundle                                                       |
| `--banner:js=...`                                     | Inject polyfill `require` — cần vì `react-dom` CJS dùng dynamic `require()` trong ESM bundle |
| `--outfile=dist/server/server.bundle.js`              | Output cùng thư mục với `assets/` để dynamic import resolve đúng                             |

---

### A4 — Cấu hình `vercel.json`

```json
{
  "buildCommand": "npm run build:vercel",
  "outputDirectory": "public",
  "functions": {
    "api/server.js": {
      "includeFiles": "dist/server/**",
      "maxDuration": 30
    }
  },
  "rewrites": [{ "source": "/(.*)", "destination": "/api/server" }]
}
```

**Giải thích:**

| Trường                           | Lý do                                                                                                                                            |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `buildCommand`                   | Gọi script ở A3                                                                                                                                  |
| `outputDirectory: "public"`      | **Bắt buộc** — Vercel serve static files từ đây. Thiếu dòng này: `/assets/*.js` bị route vào serverless → JS không load → app kẹt "Đang tải" mãi |
| `includeFiles: "dist/server/**"` | Đảm bảo các chunk động (`dist/server/assets/*.js`) được deploy cùng function                                                                     |
| `rewrites "/(.*)"`               | Mọi request không match static file đều vào SSR handler                                                                                          |
| ~~`runtime`~~                    | **Không dùng** — `runtime: "nodejs22.x"` là format AWS Lambda, Vercel sẽ báo lỗi schema                                                          |

---

### A5 — Thêm `public/` vào `.gitignore`

```gitignore
# Vercel static output (generated at build time)
public/
```

---

## Phần B — Dự án có Supabase backend

### B1 — Fix Supabase crash khi thiếu env vars

`createClient("", "")` ném `Error: supabaseUrl is required.` — crash toàn bộ serverless function ngay khi load module.

**`src/lib/supabase.ts`** — dùng placeholder thay vì empty string:

```ts
const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !key) {
  console.warn("[App] Thiếu VITE_SUPABASE_URL hoặc VITE_SUPABASE_ANON_KEY.");
}

export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  key || "placeholder-anon-key",
);
```

> Module load được dù thiếu env vars. Auth sẽ không hoạt động cho đến khi set đúng giá trị.

---

### B2 — Set environment variables trên Vercel

> `VITE_` prefix = Vite **embed giá trị vào bundle lúc build**, không phải lúc runtime.
> Phải **redeploy** sau khi set hoặc thay đổi env vars.

Vào **Vercel Dashboard → Project → Settings → Environment Variables**:

| Key                      | Lấy từ đâu                                                | Environment                      |
| ------------------------ | --------------------------------------------------------- | -------------------------------- |
| `VITE_SUPABASE_URL`      | Supabase Dashboard → Project Settings → API → Project URL | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API → anon/public | Production, Preview, Development |

Các biến khác nếu có (ví dụ: `VITE_MAPBOX_TOKEN`, `VITE_STRIPE_KEY`…) thêm tương tự.

> **Không cần** set `SUPABASE_SERVICE_ROLE_KEY` trên Vercel — biến này chỉ dùng trong
> Supabase Edge Functions, chạy trên server Supabase (qua `Deno.env.get(...)`).

---

### B3 — Fix RLS nếu sales user không thấy dữ liệu

Nếu hàm helper RLS (`is_admin()`, `current_employee_id()`) query ngược lại bảng `employees`
với `SECURITY INVOKER`, PostgreSQL rơi vào đệ quy → trả về rỗng → mọi user thấy như guest.

**Fix:** Chạy trong Supabase Dashboard → SQL Editor:

```sql
create or replace function current_employee_id()
returns uuid language sql stable security definer set search_path = public
as $$ select id from employees where user_id = auth.uid() limit 1; $$;

create or replace function is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from employees where user_id = auth.uid() and role = 'admin'); $$;
```

---

### B4 — Deploy Supabase Edge Functions

Nếu dự án có thư mục `supabase/functions/`:

```bash
npx supabase login
npx supabase link --project-ref <project-ref>   # lấy từ Supabase Dashboard URL
npx supabase functions deploy                   # deploy tất cả
# hoặc deploy từng function:
npx supabase functions deploy <tên-function>
```

---

## Checklist

### Bắt buộc (mọi dự án)

- [ ] `vite.config.ts` có `cloudflare: false`
- [ ] `api/server.js` đã tạo
- [ ] `package.json` có script `build:vercel`
- [ ] `vercel.json` có `outputDirectory: "public"` và không có `runtime`
- [ ] `public/` đã thêm vào `.gitignore`

### Chỉ khi có Supabase

- [ ] `createClient` dùng placeholder thay vì empty string
- [ ] `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` đã set trên Vercel
- [ ] Redeploy sau khi set env vars
- [ ] Edge Functions đã deploy (nếu có)
- [ ] RLS helper functions dùng `SECURITY DEFINER` (nếu có phân quyền theo nhân viên)

---

## Lỗi thường gặp

| Lỗi                                                     | Nguyên nhân                                           | Fix                                     |
| ------------------------------------------------------- | ----------------------------------------------------- | --------------------------------------- |
| `Function Runtimes must have a valid version`           | `runtime: "nodejs22.x"` trong `vercel.json`           | Xóa dòng `runtime`                      |
| `buildCommand should NOT be longer than 256 characters` | Lệnh esbuild quá dài trong `vercel.json`              | Chuyển vào `package.json` script (A3)   |
| `500 FUNCTION_INVOCATION_FAILED` — crash khi load       | Dynamic `require()` fail trong ESM bundle             | Thêm `--banner:js` polyfill (A3)        |
| `{"status":500,"unhandled":true,"message":"HTTPError"}` | Supabase `createClient("")` crash hoặc thiếu env vars | B1 + B2                                 |
| App kẹt "Đang tải…" mãi                                 | `/assets/*.js` không load (thiếu `outputDirectory`)   | Thêm `"outputDirectory": "public"` (A4) |
| `404 NOT_FOUND`                                         | Thiếu `rewrites` hoặc `outputDirectory` sai           | Kiểm tra `vercel.json` (A4)             |
| Sales user không thấy dữ liệu                           | RLS helper function dùng `SECURITY INVOKER` → đệ quy  | B3                                      |
