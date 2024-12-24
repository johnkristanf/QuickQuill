import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from 'file-saver';

export const exportToWord = () => {
  const content = document.getElementById("print-editor"); // Get the editor content
  if (!content) return;

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: Array.from(content.children).map((child) =>
          new Paragraph({
            children: [
              new TextRun({
                text: (child as HTMLElement).innerText,
              }),
            ],
          })
        ),
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, "document.docx");
  });
};
