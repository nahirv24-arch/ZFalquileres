import type { SVGProps } from "react";

/** Íconos de línea propios (sin dependencias). Decorativos por defecto: aria-hidden. */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 20, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const IconBed = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 15h18M6 9V6.5A1.5 1.5 0 0 1 7.5 5h9A1.5 1.5 0 0 1 18 6.5V9" />
  </Icon>
);
export const IconBath = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2ZM6 12V6a2 2 0 0 1 3.5-1.3M7 19l-1 2M17 19l1 2" />
  </Icon>
);
export const IconArea = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
  </Icon>
);
export const IconBalcony = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 20h16M5 20v-7M9 20v-7M15 20v-7M19 20v-7M4 13h16M8 13V5h8v8" />
  </Icon>
);
export const IconPin = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 1 1 14 0C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </Icon>
);
export const IconSearch = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </Icon>
);
export const IconChevronLeft = (p: IconProps) => (
  <Icon {...p}>
    <path d="m15 18-6-6 6-6" />
  </Icon>
);
export const IconChevronRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="m9 18 6-6-6-6" />
  </Icon>
);
export const IconCompass = (p: IconProps) => (
  <Icon {...p}>
    <path d="m21 3-7.5 18-2.5-7.5L3.5 11 21 3Z" />
  </Icon>
);
export const IconCube = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3ZM4 7.5 12 12l8-4.5M12 12v9" />
  </Icon>
);
export const IconCheck = (p: IconProps) => (
  <Icon {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Icon>
);
export const IconX = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
);
export const IconExpand = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
  </Icon>
);
export const IconMenu = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
);
export const IconCompare = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 4v16M16 4v16M4 8h4M16 16h4M4 16h4M16 8h4" />
  </Icon>
);
export const IconInfo = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </Icon>
);
export const IconExternal = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </Icon>
);
export const IconRotate = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4" />
  </Icon>
);
export const IconHand = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 11V5a1.5 1.5 0 0 1 3 0v5M12 10V4a1.5 1.5 0 0 1 3 0v6M15 10V6a1.5 1.5 0 0 1 3 0v8a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L3.5 13.5a1.5 1.5 0 0 1 2.3-1.9L9 14" />
  </Icon>
);
export const IconBuilding = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 21V4h10v17M15 9h4v12M3 21h18M8 8h4M8 12h4M8 16h4" />
  </Icon>
);
