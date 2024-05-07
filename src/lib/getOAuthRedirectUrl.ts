export function getOAuthRedirectUrl(): string {
  if (typeof window === "undefined") {
    return "http://localhost:3000"
  }

  return (
    window.location.hostname === "aicomicfactory.app" ? "https://aicomicfactory.app"
    : window.location.hostname === "jbilcke-hf-ai-comic-factory.hf.space" ? "https://jbilcke-hf-ai-comic-factory.hf.space"
    : "http://localhost:3000"
  )
}