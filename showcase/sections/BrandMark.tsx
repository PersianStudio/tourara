import { LOGO_SVG } from '../brand';

type BrandMarkProps = {
  size?: number;
  className?: string;
  /** Tour step target on the hero mark */
  tourId?: string;
};

/** Shared tourara logo mark used in hero, footer, and site chrome. */
export function BrandMark({ size = 56, className = '', tourId }: BrandMarkProps) {
  return (
    <img
      className={`brand-mark ${className}`.trim()}
      src={LOGO_SVG}
      width={size}
      height={size}
      alt="tourara"
      decoding="async"
      {...(tourId ? { 'data-tour': tourId } : {})}
    />
  );
}
