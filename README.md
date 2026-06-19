# 🏥 HealthSync - AI-Powered Medical Document Extraction Engine

HealthSync is a smart healthcare management application designed to stream clinical workflow by extracting critical structured insights from medical documents (PDFs and Images) using the Gemini AI Flash model. It automates the parsing of prescriptions, medical reports, and timelines, transforming unstructured clinical data into clean, structured digital patient charts.

🌐 **[https://ai-health-portal-xh81.vercel.app/]** 💻 **[https://github.com/arafat-yasin-2413/health-sync]**

---

## ✨ Core Features

- **🧠 Smart AI Extraction Engine:** Integrates Gemini AI (`gemini-1.5-flash` & `gemini-2.5-flash`) multimodal capabilities to scan uploaded prescriptions (PDFs/Images) and automatically extract doctor names, vital metrics (BP, Respiratory Rate), clinical summaries, and dynamic medicine arrays.
- **📁 Drag-and-Drop Uploader:** An interactive file upload section built with `react-dropzone` that shows real-time file metadata (name, size format, extensions) and features a pulsing AI extraction loader.
- **🔄 Dynamic Local Storage Management:** Complete client-side state persistence (`localStorage`) that loads active patient sessions and links generated clinical timelines flawlessly without data loss on refresh.
- **🎨 Responsive Unified Layout:** A clean, cohesive user interface engineered with Tailwind CSS and Shadcn UI, featuring a globally responsive navbar (`PortalNav`) matching perfectly with the central view constraints (`max-w-7xl`).

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Shadcn UI, Lucide React
- **File Management:** React Dropzone
- **AI Integration:** `@google/genai` (Google Gemini AI SDK)
- **State Management:** React Hooks (`useState`, `useEffect`, `useCallback`) with explicit Client/Server Action boundaries

---

## 🚀 Getting Started

Follow these steps to run the project locally:

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)
cd YOUR_REPO_NAME
```

### 2. Install Dependencies
```bash
pnpm i
```
### 3. Setup Environment Variables
Create a `.env.local` file in the root directory of your project and add your Gemini API Key: 
```bash
# Client-side gateway prefix
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_gemini_api_key_here

# Pure Node.js Server Environment Context
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 4. Run Development Server
```bash
pnpm dev
```

---

## 👤 Author

Developed by **MD YASIN ARAFAT** Frontend & MERN Stack Developer  

- **GitHub:** [@arafat-yasin-2413](https://github.com/arafat-yasin-2413)
- **LinkedIn:** [Md Yasin Arafat](https://linkedin.com/in/yasin-arafat-web)

---

*Copyright © 2026 HealthSync. All rights reserved.*

