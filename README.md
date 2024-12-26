# **Mini Google Docs with Chatbot for Summarization and Paraphrasing**

This project is a web application that mimics a simplified version of Google Docs, allowing users to create, edit, and format documents collaboratively. Additionally, it integrates a chatbot that assists with **summarization** and **paraphrasing** of the content. Built with a robust tech stack of **React**, **Laravel**, and **Python**, the application delivers a seamless user experience for text editing and AI-driven assistance.

---

## **Features**

### **Document Editor**
- Rich text editing with support for:
  - Bullet and numbered lists
  - Bold, italic, underline, and strikethrough formatting
  - Font family and size customization
  - Text alignment and color
- Collaborative editing support (optional integration).
- Real-time autosave functionality.

### **Chatbot Integration**
- AI-powered chatbot that assists with:
  - **Summarization**: Provides concise summaries of selected or full text.
  - **Paraphrasing**: Offers rephrased versions of the text to improve readability or style.

### **User Management**
- Authentication system with registration and login.
- User-specific document storage and management.

---

## **Tech Stack**

### **Frontend**
- **React**: For building an interactive, dynamic user interface.
  - Libraries: 
    - `Slate.js` for the rich text editor.
    - `Axios` for API calls.
    - `TailwindCSS` for responsive styling.

### **Backend**
- **Laravel**: Handles user authentication, document storage, and API routing.
  - Features:
    - RESTful APIs for document CRUD operations.
    - Middleware for secure access control.
    - PostgreSQL as the database.

### **AI Services**
- **Python**: Implements the chatbot's summarization and paraphrasing functionalities.
  - Libraries:
    - `Transformers` (Hugging Face) for natural language processing.
    - `Fast API` for serving AI APIs.

---

