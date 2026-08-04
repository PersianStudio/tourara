# tourara

**جعبه ابزار تور محصول برای React** — ماسک SVG، جایگذاری هوشمند تولتیپ، نشانگر tip، ناوبری صفحه‌کلید، و میزبان مبتنی بر Context برای اپ‌های چندصفحه‌ای. همتایان فقط React (بدون MUI و Zustand).

**زبان‌ها:** [English (README.md)](./README.md) · فارسی (همین سند)

| | |
|---|---|
| **پکیج** | [`@persianstudio/tourara`](https://www.npmjs.com/package/@persianstudio/tourara) *(به‌زودی روی npm)* |
| **دمو** | [persianstudio.github.io/tourara](https://persianstudio.github.io/tourara/) |
| **مخزن** | [github.com/PersianStudio/tourara](https://github.com/PersianStudio/tourara) |
| **مجوز** | MIT |

---

## چرا tourara ساخته شد؟

ما به دنبال یک **سیستم تورینگ متن‌باز و کاملاً قابل سفارشی‌سازی** بودیم — چیزی که کنترل کامل روی UI، اکشن‌های هر مرحله، و انیمیشن‌ها بدهد، بدون اینکه با کتابخانه بجنگیم.

پس از جستجو در اکوسیستم، کامپوننت توری پیدا نکردیم که همهٔ این نیازها را با کنترل کامل روی ظاهر و رفتار برآورده کند. بنابراین موتور را خودمان ساختیم، در محصولات‌مان استفاده کردیم، و حالا آن را منتشر می‌کنیم تا بقیهٔ توسعه‌دهندگان هم بتوانند آنبوردینگ را همین‌طور بسازند.

**tourara برای این ساخته شده که داشته باشید:**

1. **UI سفارشی** — اسلات‌های tooltip، footer و mask تا تور با برند شما جور باشد، نه یک پوستهٔ ثابت  
2. **اکشن سفارشی** — next/prev تعاملی، کلیک برای رفتن به مرحله بعد، و هلپرهای DOM برای فلوهای واقعی  
3. **حرکت سفارشی** — جایگذاری، اسکرول خودکار، و ترنزیشن‌هایی که خودتان تنظیم می‌کنید  

---

## قابلیت‌ها

- ماسک نورافکن SVG  
- جایگذاری هوشمند در ۱۳ جهت  
- **RTL و LTR** — `direction: 'ltr' | 'rtl'` (پیش‌فرض **`ltr`**)  
- نشانگر tip برای مراحل غیرفعال  
- حالت store (`TourHost` + `useTour`) یا controlled (`Tour`)  
- مراحل تعاملی و اسلات‌های رندر  

**متن‌های پیش‌فرض کتابخانه انگلیسی است.** برای رابط فارسی برچسب‌ها را خودتان بدهید (`finishBtnText`، `skipBtnText`، …).

---

## نصب

```bash
pnpm add @persianstudio/tourara
```

پکیج npm فقط کتابخانهٔ کامپایل‌شده (`dist/`) را شامل می‌شود — نه showcase، نه `src/`، نه `docs/`. دمو روی [GitHub Pages](https://persianstudio.github.io/tourara/) است.

---

## شروع سریع (LTR — پیش‌فرض)

```tsx
import { TourProvider, TourHost, useTour, useTourContext, type TourStep } from '@persianstudio/tourara';

const steps: TourStep[] = [
  {
    selector: '[data-tour="nav"]',
    title: 'Navigation',
    content: 'Primary navigation.',
  },
];

function PageTour() {
  useTour({ tourOptions: { steps }, openImmediately: true });
  const { setTourProps } = useTourContext();
  return (
    <button type="button" onClick={() => setTourProps({ isOpen: true })}>
      Start tour
    </button>
  );
}

export function App() {
  return (
    <TourProvider>
      <TourHost />
      <PageTour />
      <nav data-tour="nav">…</nav>
    </TourProvider>
  );
}
```

---

## حالت RTL (فارسی)

پیش‌فرض `direction` برابر **`ltr`** است. برای راست‌به‌چپ:

```tsx
<Tour
  direction="rtl"
  steps={[
    {
      selector: '[data-tour="panel"]',
      title: 'خوش آمدید',
      content: 'این یک مرحلهٔ نمونه با متن فارسی است.',
    },
  ]}
  isOpen={open}
  onClose={() => setOpen(false)}
  finishBtnText="پایان"
  skipBtnText="رد کردن"
  prevLabel="قبلی"
  nextLabel="بعدی"
  closeLabel="بستن"
/>
```

در RTL:

- روی تولتیپ و پورتال `dir="rtl"` اعمال می‌شود  
- ترجیح‌های east/west جایگذاری آینه می‌شوند  
- آیکن قبلی/بعدی برعکس می‌شود  
- با ← جلو و با → عقب می‌روید (ترتیب خواندن)  

نمونهٔ زنده در بخش **RTL / LTR** شوی‌کیس: [persianstudio.github.io/tourara/#rtl](https://persianstudio.github.io/tourara/#rtl)

---

## API کوتاه

| خروجی | نقش |
|--------|------|
| `Tour` | تور کنترل‌شده |
| `TourHost` | میزبان متصل به store |
| `useTour` / `useTourContext` | ثبت مراحل و باز کردن تور |
| `direction` | `'ltr'` (پیش‌فرض) یا `'rtl'` |
| `CardinalOrientation` | enum جایگذاری |
| `conditionalTourAction` و … | هلپرهای DOM |

جزئیات کامل گزینه‌ها در [README.md انگلیسی](./README.md) آمده است.

---

## توسعه محلی

```bash
pnpm install
pnpm dev              # http://localhost:5173/tourara/
pnpm build
pnpm build:showcase
```

مستندات مشارکت‌کنندگان (معماری، API، مشارکت، انتشار npm) در پوشهٔ [`docs/`](./docs/) است — به‌ویژه [docs/PUBLISHING.md](./docs/PUBLISHING.md).

---

## انتشار روی npm

```bash
pnpm typecheck && pnpm build && pnpm pack:check
pnpm publish --access public
```

همتایان (peers) فقط `react` و `react-dom` هستند.

---

## مجوز

[MIT](./LICENSE) © Persian Studio
