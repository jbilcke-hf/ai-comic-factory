export function getUserPrompt({
  prompt,
  existingPanelsTemplate,
}: {
  prompt: string
  existingPanelsTemplate: string
}) {
  return `The story is about: ${prompt}.${existingPanelsTemplate}`
}