import { CardinalOrientation, type TourStep } from '@persianstudio/tourara';

/** Persian RTL demo steps — labels and copy are FA; direction is set on the tour props. */
export const RTL_TOUR_STEPS: TourStep[] = [
  {
    selector: '[data-tour="rtl-hero"]',
    title: 'پشتیبانی راست‌به‌چپ',
    content:
      'تورارا هم LTR و هم RTL را پشتیبانی می‌کند. جهت پیش‌فرض ltr است؛ با direction="rtl" چیدمان و فلش‌ها آینه می‌شوند.',
    finishBtnText: 'شروع',
    skipBtnText: 'رد کردن',
    noSkipBtn: true,
  },
  {
    selector: '[data-tour="rtl-nav"]',
    title: 'هدف‌گذاری در رابط فارسی',
    content: 'سلکتورها همان CSS هستند. متن و dir روی تولتیپ راست‌چین می‌شود و شرق/غرب جایگذاری آینه می‌گردد.',
    orientationPreferences: [CardinalOrientation.SOUTH, CardinalOrientation.EAST],
    finishBtnText: 'پایان',
    skipBtnText: 'رد کردن',
    prevLabel: 'قبلی',
    nextLabel: 'بعدی',
    closeLabel: 'بستن',
  },
  {
    selector: '[data-tour="rtl-panel"]',
    title: 'اقدامات و برچسب‌ها',
    content: 'برچسب دکمه‌ها را با finishBtnText، skipBtnText، prevLabel و nextLabel فارسی کنید — پیش‌فرض کتابخانه انگلیسی می‌ماند.',
    finishBtnText: 'پایان',
    skipBtnText: 'رد کردن',
    prevLabel: 'قبلی',
    nextLabel: 'بعدی',
  },
];
