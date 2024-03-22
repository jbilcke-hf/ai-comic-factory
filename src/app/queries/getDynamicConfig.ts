"use server"

import { getValidBoolean } from "@/lib/getValidBoolean"
import { getValidNumber } from "@/lib/getValidNumber"
import { getValidString } from "@/lib/getValidString"
import { DynamicConfig } from "@/types"

export async function getDynamicConfig(): Promise<DynamicConfig> {
  const maxNbPages = getValidNumber(process.env.MAX_NB_PAGES, 1, Number.MAX_SAFE_INTEGER, 1)
  const nbPanelsPerPage = 4 // for now this is static
  const nbTotalPanelsToGenerate = maxNbPages * nbPanelsPerPage

  const config = {
    maxNbPages,
    nbPanelsPerPage,
    nbTotalPanelsToGenerate,
    oauthClientId: getValidString(process.env.HUGGING_FACE_OAUTH_CLIENT_ID, ""),
    oauthRedirectUrl: getValidString(process.env.HUGGING_FACE_OAUTH_REDIRECT_URL, ""),
    oauthScopes: "openid profile inference-api",
    enableHuggingFaceOAuth: getValidBoolean(process.env.ENABLE_HUGGING_FACE_OAUTH, false),
    enableHuggingFaceOAuthWall: getValidBoolean(process.env.ENABLE_HUGGING_FACE_OAUTH_WALL, false),
  }

  return config
}