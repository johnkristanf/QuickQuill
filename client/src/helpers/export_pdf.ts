/* eslint-disable @typescript-eslint/no-explicit-any */
import { jsPDF } from "jspdf";
import { generateRandomDocumentName } from "./generate_docuName";

export const exportToPDF = () => {
    const doc = new jsPDF('p', 'px', 'a4');
    const htmlContent = serializeSlateContent();

    console.log("htmlContent in serialize: ", htmlContent);
    

    if (!htmlContent) {
        console.error('No content to export to PDF');
        return;
    }

    doc.html(htmlContent, {
        callback: (doc) => {
            doc.save(generateRandomDocumentName('.pdf'));
        },
        autoPaging: true,  
    });
}

const serializeSlateContent = () => {
    const editorContainer = document.getElementsByClassName('editor-container')[0];
    if (!editorContainer) return;

    const pages = Array.from(editorContainer.getElementsByClassName('page'));
    let htmlContent = '';
    
    pages.forEach(element => {
        const pageContent = JSON.parse(element.getAttribute('data-slate-content') || '[]');
        htmlContent += addNewStyledDocument(pageContent)
    });

    return htmlContent;

}

const addNewStyledDocument = (pageContent: any[]) => {

    const pageWidth = 450;  

    let htmlContent = `
        <div 
            style="
                display: block;
                width: ${pageWidth}px;
                height: 100%;
                padding: 15px;
            ">
    `;

    pageContent.forEach((node: any) => {
        if(node.type === 'paragraph'){
            htmlContent += createParagraphContent(node.children, node.align)
        } else if(node.type === 'bullet-list'){
            htmlContent += createBulletListContent(node.children)
        } else if(node.type === 'numbered-list'){
            htmlContent += createNumberedListContent(node.children)
        }
    })

    htmlContent += '</div>'


    return htmlContent;
}

const createParagraphContent = (children: any[], alignment: string = 'left') => {
    let paragraphContent = '';
    
    children.forEach((child) => {
        
        const styles = inlineStyleCheck(child)
        paragraphContent += `<span style="${styles}">${child.text}</span>`;
    });

    return `<p style="text-align: ${alignment};">${paragraphContent}</p>`;
}


const createBulletListContent = (listItems: any[], alignment: string = 'left') => {

    const ulStyles = `
        list-style-type: disc;
        padding-left: 20px;
        text-align: ${alignment};
        font-size: 15px; 
    `;

    const lists = listItems.map((listItem) => {

        const childContent = listItem.children
            .map((child: any) => {
                const styles = inlineStyleCheck(child);
                return `<span style="${styles}">${child.text}</span>`;
            }).join('');

        return `<li>${childContent}</li>`;

    }).join('');

    return `<ul style="${ulStyles}">${lists}</ul>`;
};

const createNumberedListContent = (listItems: any[], alignment: string = 'left') => {

    const olStyles = `
        list-style-type: decimal;
        padding-left: 30px;
        text-align: ${alignment};
        font-size: 15px;
    `;

    const lists = listItems.map((listItem) => {
        
        const childContent = listItem.children
            .map((child: any) => {
                const styles = inlineStyleCheck(child);
                return `<span style="${styles}">${child.text}</span>`;
            }).join('');

        return `<li >${childContent}</li>`;

    }).join('');

    return `<ol style="${olStyles}">${lists}</ol>`;
};


// const escapeHtml = (text: string) => {
//     if (!text) return "";
//     return text
//         .replace(/&/g, "&amp;") // Escape &
//         .replace(/</g, "&lt;")  // Escape <
//         .replace(/>/g, "&gt;")  // Escape >
//         .replace(/"/g, "&quot;") // Escape "
//         .replace(/'/g, "&#039;"); // Escape '
// };



const inlineStyleCheck = (nodeChild: any) => {
    let styles = '';

    if(nodeChild.fontSize){
        styles += `font-size: 15px; `;  
    } else {
        styles += `font-size: 11px; `;  

    }

    if (nodeChild.color) styles += `color: ${nodeChild.color}; `;
    if (nodeChild.fontFamily) styles += `font-family: ${nodeChild.fontFamily}; `;
    if (nodeChild.bold) styles += `font-weight: bold;`;
    if (nodeChild.italic) styles += `font-style: italic;`;
    if (nodeChild.underline) styles += `text-decoration: underline;`;

    return styles
}