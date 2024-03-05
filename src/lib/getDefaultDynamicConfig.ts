import { DynamicConfig } from "@/types"

export const getDefaultDynamicConfig = (): DynamicConfig => ({
  maxNbPages: 1,
  nbPanelsPerPage: 4,
  nbTotalPanelsToGenerate: 4,
  oauthClientId: "",
  oauthRedirectUrl: "http://localhost:3000",
  oauthScopes: "openid profile inference-api",
  enableHuggingFaceOAuth: false,
  enableHuggingFaceOAuthWall: false,
})