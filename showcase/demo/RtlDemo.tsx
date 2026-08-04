import { useState } from 'react';
import type { TourDirection } from '@persianstudio/tourara';

interface RtlDemoProps {
  onStartRtlTour: () => void;
  direction: TourDirection;
  onDirectionChange: (dir: TourDirection) => void;
}

export function RtlDemo({ onStartRtlTour, direction, onDirectionChange }: RtlDemoProps) {
  const isRtl = direction === 'rtl';

  return (
    <section className="section" id="rtl" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="section-head">
        <h2 data-tour="rtl-hero">{isRtl ? 'راست‌به‌چپ و چپ‌به‌راست' : 'RTL & LTR support'}</h2>
        <p>
          {isRtl
            ? 'جهت پیش‌فرض کتابخانه ltr و متن‌های پیش‌فرض انگلیسی است. برای رابط فارسی direction="rtl" را تنظیم کنید و برچسب‌ها را خودتان فارسی بدهید.'
            : 'Default direction is ltr with English labels. Switch to rtl to mirror east/west placement, flip chrome with dir="rtl", and demo Persian copy in the tour.'}
        </p>
      </div>

      <div className="rtl-toolbar">
        <div className="rtl-switch" role="group" aria-label="Tour direction">
          <button
            type="button"
            className={direction === 'ltr' ? 'is-active' : ''}
            onClick={() => onDirectionChange('ltr')}
          >
            LTR
          </button>
          <button
            type="button"
            className={direction === 'rtl' ? 'is-active' : ''}
            onClick={() => onDirectionChange('rtl')}
          >
            RTL
          </button>
        </div>
        <button type="button" className="btn btn-yellow btn-compact" onClick={onStartRtlTour}>
          {isRtl ? 'شروع تور فارسی' : 'Start RTL tour (FA)'}
        </button>
      </div>

      <div className="rtl-shell" data-tour="rtl-shell">
        <div className="rtl-top" data-tour="rtl-nav">
          <strong>{isRtl ? 'میز کار فارسی' : 'Persian workspace'}</strong>
          <span>{isRtl ? 'نمونهٔ رابط راست‌چین' : 'Sample RTL surface'}</span>
        </div>
        <div className="rtl-body">
          <aside className="rtl-side">
            <button type="button">{isRtl ? 'خانه' : 'Home'}</button>
            <button type="button" className="is-active">
              {isRtl ? 'گزارش‌ها' : 'Reports'}
            </button>
            <button type="button">{isRtl ? 'تنظیمات' : 'Settings'}</button>
          </aside>
          <article className="panel" data-tour="rtl-panel">
            <p className="eyebrow">{isRtl ? 'نمونه' : 'Sample'}</p>
            <h3>{isRtl ? 'پنل محتوا' : 'Content panel'}</h3>
            <p>
              {isRtl
                ? 'این بلوک هدف تور RTL است. فلش قبلی/بعدی و جهت متن با direction هم‌راستا می‌شوند.'
                : 'This block is the RTL tour target. Prev/next chevrons and text direction follow the direction prop.'}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

/** Local state helper if needed by App — kept for clarity. */
export function useRtlDirection(initial: TourDirection = 'ltr') {
  return useState<TourDirection>(initial);
}
