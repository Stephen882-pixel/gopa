import type { PObjectProps } from "@src/components/types";

export const textLight: PObjectProps = {
  primary: "rgba(41, 41, 41, 1)",
  secondary: "rgba(52, 49, 76, 0.54)",
  disabled: "rgba(52, 49, 76, 0.38)",
  hint: "rgba(52, 49, 76, 0.38)",
};

export const textDark: PObjectProps = {
  primary: "#fff",
  secondary: "rgba(255, 255, 255, 0.7)",
  disabled: "rgba(255, 255, 255, 0.64)",
  hint: "rgba(255, 255, 255, 0.64)",
};

export const bgPalette: PObjectProps = {
  light: {
    // Color Schemes:
    // - Mustard: fffaeb, fff8e3
    // - Blue 1: eaeeef, e7ebec
    // - Blue 2: e6ebee, e0e5e8
    // - Blue 3: e0e5e8, dde2e5
    // - Blue 4: fff, dde2e5
    // default: "#fff",
    // paper: "#dde2e5",
  },
  dark: {
    default: "#1a2038",
    paper: "#222a45",
  },
};
