/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { Editor, Transforms, Text, Element } from "slate";
import { Message } from "@/types/chatbot";
import { useChatbotStore } from "@/store/chatbotState";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const DOCUMENT_FONTS = [
  "Arial", 
  "Courier New", 
  "Georgia", 
  "Times New Roman", 
  "Verdana", 
  "Roboto", 
  "Lobster", 
  "Montserrat" 
];

export const DOCUMENT_FONT_SIZES = [8, 9, 10, 11, 12, 13, 14, 18, 24, 30, 36, 48, 60, 72, 96];


export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}


export const formatDate = (dateString: string) => {
  const options: any = {
    month: 'short',  
    day: 'numeric',  
    year: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true, 
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  return formattedDate;
};

export const simulateTypingEffect = async (text: string) => {

  const updateConversationState = useChatbotStore.getState().updateConversationState;

  const typingDelay = 10;
  let botMessage = { sender: 'bot', text: '' } as Message;

  updateConversationState((prevConversation: Message[]) => [...prevConversation, botMessage]);
  
  for (let i = 0; i < text.length; i++) {
    await new Promise(resolve => setTimeout(resolve, typingDelay));
    botMessage = { sender: 'bot', text: botMessage.text + text[i] };
    updateConversationState((prevConversation: Message[]) => {
      const newConversation = [...prevConversation];
      newConversation[newConversation.length - 1] = botMessage;
      return newConversation;
    });
  }
};


// -------------------------------- TEXT CUSTOM EDITOR METHOD UTILS -------------------------



// ----------------------------------- ACTIVE CHECKER METHODS ----------------------------

export const isActiveCheckerMethods = {

  isBulletBlockActive(editor: Editor) {
    const [match] = Editor.nodes(editor, {
      // @ts-expect-error - Ignore the unknown `type` property because it is dynamically added
      match: n => n.type === 'bullet-list',
    })

    return !!match
  },

  isNumberedBlockActive(editor: Editor) {
    const [match] = Editor.nodes(editor, {
      // @ts-expect-error - Ignore the unknown `type` property because it is dynamically added
      match: n => n.type === 'numbered-list', 
    })

    return !!match
  },


  isTextDecorationTypeActive(editor: Editor, decoration_type: string){
    const marks = Editor.marks(editor) as Record<string, unknown>;
    return marks ? marks[decoration_type] === true: false
  },


}


// ----------------------------------- TOGGLEABLE METHODS ----------------------------


export const toggleEditorMethods = {

  toggleBulletBlock(editor: Editor) {
    const isActive = isActiveCheckerMethods.isBulletBlockActive(editor);

    
    if(isActive){

      Transforms.unwrapNodes(editor, {
        match: n => Element.isElement(n) && n.type === 'bullet-list',
        split: true
      })

      Transforms.setNodes(editor, {
        type: 'paragraph'
      });


    } else {
      Transforms.wrapNodes(editor, {
        type: 'bullet-list',
        children: []
      });

      Transforms.setNodes(editor, { type: 'list-item' })
    }

    
  },
  

  toggleNumberedBlock(editor: Editor){
    const isActive = isActiveCheckerMethods.isNumberedBlockActive(editor)

    if(isActive){
      Transforms.unwrapNodes(editor, {
      // @ts-expect-error - Ignore the unknown `type` property because it is dynamically added
        match: n => Element.isElement(n) && n.type === 'numbered-list',
        split: true
      })

      // @ts-expect-error - Ignore the unknown `type` property because it is dynamically added
      Transforms.setNodes(editor, { type: 'paragraph' });

    } else {

      Transforms.wrapNodes(editor, {
      // @ts-expect-error - Ignore the unknown `type` property because it is dynamically added
        type: 'numbered-list',
        children: []
      });

      // @ts-expect-error - Ignore the unknown `type` property because it is dynamically added
      Transforms.setNodes(editor, { type: 'list-item' })
    }
  },

  insertNewListItem(editor: Editor){
    const [list] = Editor.nodes(editor, {
      // @ts-expect-error - Ignore the unknown `type` property because it is dynamically added
      match: n => Element.isElement(n) && n.type === 'numbered-list',
    });

    if(list){
      Transforms.insertNodes(editor, {
      // @ts-expect-error - Ignore the unknown `type` property because it is dynamically added
        type: 'list-item',
        children: [{ text: '' }],
      })
    }
  },
  

  insertNewBulletListItem(editor: Editor){
    const [list] = Editor.nodes(editor, {
      // @ts-expect-error - Ignore the unknown `type` property because it is dynamically added
      match: n => Element.isElement(n) && n.type === 'bullet-list',
    });

    if(list){
      Transforms.insertNodes(editor, {
      // @ts-expect-error - Ignore the unknown `type` property because it is dynamically added
        type: 'list-item',
        children: [{ text: '' }],
      })
    }
  },




  toggleUnderlineMark(editor: Editor){
    const isActive = isActiveCheckerMethods.isTextDecorationTypeActive(editor, 'underline')
    if(isActive){
      Editor.removeMark(editor, 'underline')
    } else {
      Editor.addMark(editor, 'underline', true)
    }
  },


  toggleBoldMark(editor: Editor){
    const isActive = isActiveCheckerMethods.isTextDecorationTypeActive(editor, 'bold')
    if(isActive){
      Editor.removeMark(editor, 'bold')
    } else {
      Editor.addMark(editor, 'bold', true)
    }
  },


  toggleItalicMark(editor: Editor){
    const isActive = isActiveCheckerMethods.isTextDecorationTypeActive(editor, 'italic')
    if(isActive){
      Editor.removeMark(editor, 'italic')
    } else {
      Editor.addMark(editor, 'italic', true)
    }
  },


}

// ----------------------------------- NOT TOGGLEABLE METHODS ----------------------------

export const notToggleableEditorMethods = {

  setTextColorMark(editor: Editor, color: string){
    Editor.addMark(editor, 'color', color)
  },

  setTextAlignment(editor: Editor, aligment: string){
    Transforms.setNodes(
      editor, 
      // @ts-expect-error - Ignore the unknown `align` property because it is dynamically added
      { align: aligment },
      { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
    )
  },


  // ----------------------- FONT STYLINGS -------------------------------

  setFontFamily(editor: Editor, fontFamily: string){
    Editor.addMark(editor, 'fontFamily', fontFamily)
  },

  getFontFamily(editor: Editor){
    const [match] = Editor.nodes(editor, {
      // @ts-expect-error - Ignore the unknown `fontFamily` property because it is dynamically added
      match: n => Text.isText(n) && n.fontFamily,
      universal: true
    });
  
    // @ts-expect-error - Ignore the unknown `fontFamily` property because it is dynamically added
    return match ? match[0].fontFamily : 'default';
  
  },



  setFontSize(editor: Editor, fontSize: string){
    Editor.addMark(editor, 'fontSize', fontSize)
  },


  adjustFontSize(editor: Editor, adjustment: number){
    const [match] = Editor.nodes(editor, {
      // @ts-expect-error - Ignore the unknown `fontSize` property because it is dynamically added
      match: n => Text.isText(n) && n.fontSize,
      universal: true
    });
  
    // @ts-expect-error - Ignore the unknown `fontSize` property because it is dynamically added
    const currentFontsize = match ? parseInt(match[0].fontSize || "16", 10): 16;
    const newFontSize = currentFontsize + adjustment;
  
    this.setFontSize(editor, `${newFontSize}px`)

  } 

}