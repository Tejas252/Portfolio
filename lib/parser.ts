export function extractJsonFromText(text: string): any | null {
    try {
      // Remove markdown code block markers
      const cleaned = text
        .replace(/```json|```/g, '')
        .trim();
  
      // Find the first JSON object or array
      const firstBrace = cleaned.indexOf('{');
      const firstBracket = cleaned.indexOf('[');
  
      const start = (firstBracket >= 0 && firstBracket < firstBrace) || firstBrace === -1
        ? firstBracket
        : firstBrace;
  
      const jsonText = cleaned.slice(start);
  
      return JSON.parse(jsonText);
    } catch (err) {
      console.error("Failed to parse JSON from LLM output:", err);
      return null;
    }
  }