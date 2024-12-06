export const ITypeMessageGlobal = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  DEFAULT: "default",
  FATAL: "fatal",
} as const;

export type ITypeMessageGlobal =
  (typeof ITypeMessageGlobal)[keyof typeof ITypeMessageGlobal];
