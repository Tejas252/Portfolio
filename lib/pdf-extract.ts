// import pdf from 'pdf-parse';

// export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
//   const data = await pdf(buffer);
//   return data.text;
// }

// import { getDocument } from '@xenova/pdf.js';

// export async function extractTextFromPdfBuffer(buffer: Buffer): Promise<string> {
//   const loadingTask = getDocument({ data: buffer });
//   const pdf = await loadingTask.promise;

//   const textContent: string[] = [];

//   for (let i = 1; i <= pdf.numPages; i++) {
//     const page = await pdf.getPage(i);
//     const content = await page.getTextContent();
//     const strings = content.items.map(item => 'str' in item ? item.str : '').join(' ');
//     textContent.push(strings);
//   }

//   return textContent.join('\n');
// }

