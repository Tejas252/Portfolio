export const CONTENT_DIVIDER_PROMPT = `You are an expert in document structure analysis.

Below is a piece of text extracted from a PDF. Your job is to identify logical sections and subheadings, even if explicit headers are missing.

Return JSON in this format:
[
  { "section": "About Tejas", "content": "..." },
  { "section": "Tech Stack", "content": "..." },
  { "section": "Projects", "subsection": "Designtrack", "content": "..." }
]

don't add extra texts only send raw JSON
`