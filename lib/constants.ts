export const DEVELOPER_LINK = process.env.NEXT_PUBLIC_DEVELOPER_LINK || "";
export const HOC_NUMBER = process.env.NEXT_PUBLIC_HOC_NUMBER;
export const LEVEL = process.env.NEXT_PUBLIC_LEVEL;

export const IS_DEV = process.env.NODE_ENV === "development";
export const BASE_URL = IS_DEV
  ? process.env.NEXT_PUBLIC_DEV_BASE_URL
  : process.env.NEXT_PUBLIC_PROD_BASE_URL;
