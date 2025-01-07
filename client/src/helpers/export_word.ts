/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document, Packer, PageBreak, Paragraph, TextRun } from "docx";
import { saveAs } from 'file-saver';
import { generateRandomDocumentName } from "./generate_docuName";

export const exportToWord = () => {
  const editorContainer = document.getElementsByClassName('editor-container')[0];
  if (!editorContainer) return;

  const pages = Array.from(editorContainer.getElementsByClassName('page'));

  const paragraphs: Paragraph[] = [];

  pages.forEach((page, index) => {

    const pageContent = JSON.parse(page.getAttribute("data-slate-content") || "[]")

    addStyledContent(pageContent, paragraphs)

    addSeparatedPageBreak(index, pages, paragraphs);

  })

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "numbering-reference",
          levels: [
            {
              level: 0,
              format: "decimal",
              text: "%1.", 
              alignment: "left",
            },
          ],
        },
      ],
    },
    
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

 
  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, generateRandomDocumentName('.docx'));
  });
};

const addStyledContent  = (content: any[], paragraphs: Paragraph[]) => {
  content.forEach((node: any) => {
    if (node.type === 'paragraph' && Array.isArray(node.children)) {
      const paragraph = createStyledParagraph(node.children)
      paragraphs.push(paragraph);
    } else if(node.type === "bullet-list" || node.type === "numbered-list"){
      addNewList(node, paragraphs)
    }

  });
}

const createStyledParagraph = (children: any[]) => {
  const textRuns = children.map((child: any) => 
    new TextRun({
      text: child.text || "",
      bold: child.bold || false,
      italics: child.italic || false,
      underline: child.underline || false,
      color: child.color || "000000",
      size: (typeof child.fontSize === 'number' && !isNaN(child.fontSize)) ? child.fontSize * 2 : 24, // Word font size is in half-points
      font: child.fontFamily || "Arial", 
    })
  );

  return new Paragraph({ children: textRuns });
}

const addNewList = (listNode: any, paragraphs: Paragraph[]) => {
  listNode.children.forEach((listItem: any) => {
    const textRuns = listItem.children.map(
      
      (child: any) =>
        new TextRun({
          text: child.text || "",
          bold: child.bold || false,
          italics: child.italic || false,
          underline: child.underline || false,
          color: child.color || "000000", // Default to black
          size: child.fontSize ? child.fontSize * 2 : 24, // Word font size is in half-points
          font: child.fontFamily || "Arial",
        })
      
        
    );

    const isBulletList = listNode.type === "bullet-list";
    const isNumberedList = listNode.type === "numbered-list";

    const paragraph = new Paragraph({
      children: textRuns,
      bullet: isBulletList ? { level: 0 } : undefined,
      numbering: isNumberedList
        ? {
            reference: "numbering-reference",
            level: 0,
          }
        : undefined,

      indent: {
        left: 650, 
        hanging: 250, 
      },
    });

    paragraphs.push(paragraph);
  });
};

const addSeparatedPageBreak = (index: number, pages: Element[], paragraphs: Paragraph[]) => {
  if(index < pages.length - 1){
    paragraphs.push(new Paragraph({children: [new PageBreak()] }))
  }
}



