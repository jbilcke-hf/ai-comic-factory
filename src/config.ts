import { getValidNumber } from "./lib/getValidNumber"

export const MAX_NB_PAGES = getValidNumber(process.env.NEXT_PUBLIC_MAX_NB_PAGES, 1, 2, 1)

// TODO: this one should be dynamic and depend upon the page layout type
export const NB_PANELS_PER_PAGE = 4
