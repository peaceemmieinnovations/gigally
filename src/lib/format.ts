/**
 * Strip markdown artifacts (**, ***, ##, etc.) from AI-generated text
 * and return clean, readable text.
 */
export function cleanMarkdown(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1") // bold/italic markers
    .replace(/#{1,6}\s*/g, "")                 // headings
    .replace(/`{1,3}[^`]*`{1,3}/g, (m) => m.replace(/`/g, "")) // inline code
    .replace(/\n{3,}/g, "\n\n")                // excessive newlines
    .trim();
}
