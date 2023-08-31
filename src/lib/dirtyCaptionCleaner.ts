export function dirtyCaptionCleaner({
  panel,
  instructions,
  caption
}: {
  panel: number;
  instructions: string;
  caption: string
}) {
  return {
    panel,
    instructions: (
      // need to remove from LLM garbage here, too
      (instructions.split(":").pop() || "")
      .replaceAll("Show a", "")
      .replaceAll("Show the", "")
      .replaceAll("Opens with a", "")
      .replaceAll("Opens with the", "")
      .replaceAll("Opens with", "")
      .replaceAll("Cut to a", "")
      .replaceAll("Cut to the", "")
      .replaceAll("Cut to", "")
      .replaceAll("End with a", "")
      .replaceAll("End with", "").trim() || ""
    ),
    caption: caption.split(":").pop()?.trim() || "",
  }
}