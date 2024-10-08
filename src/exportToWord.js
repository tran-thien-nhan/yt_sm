import { Document, Paragraph, Packer, TextRun } from 'docx';
import { saveAs } from 'file-saver';

export const exportToWord = (inputText, summary, questions) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun({ text: "Input Text", bold: true })],
          }),
          new Paragraph({
            children: [new TextRun(inputText)],
          }),
          new Paragraph({
            children: [new TextRun({ text: "Summary", bold: true })],
          }),
          new Paragraph({
            children: [new TextRun(summary)],
          }),
          new Paragraph({
            children: [new TextRun({ text: "Questions and Answers", bold: true })],
          }),
          ...questions.flatMap((item) => [
            new Paragraph({
              children: [new TextRun({ text: `Q: ${item.question}`, bold: true })],
            }),
            new Paragraph({
              children: [new TextRun(`A: ${item.answer}`)],
            }),
            new Paragraph({}), // Empty paragraph for spacing
          ]),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, "summary_and_discussion.docx");
  });
};