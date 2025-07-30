export function splitByParagraphOrHeading(text: string): string[] {
  const lines = text.split('\n');
  const chunks: string[] = [];
  let currentChunk = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Heading detector: Line that starts with a capital and has no punctuation
    const isLikelyHeading = /^[A-Z][a-zA-Z\s]{3,50}$/.test(line);

    // Paragraph boundary: empty line or heading
    if (line === '' || isLikelyHeading) {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }

      if (isLikelyHeading) {
        chunks.push(line); // Treat heading as standalone
      }
    } else {
      currentChunk += ' ' + line;
    }
  }

  // Push last chunk
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}


export function smartChunkingForAIStructuring(text: string) {
  const MAX_CHUNK = 1000; // tokens
  const sections = splitByParagraphOrHeading(text); // conservative split
  const chunks: string[] = [];

  let current = "";
  for (let section of sections) {
    if (current.length + section.length > MAX_CHUNK) {
      chunks.push(current);
      current = section;
    } else {
      current += "\n\n" + section;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}