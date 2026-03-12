# CodeZen - Project Viva Guide

This document is designed to help you understand the internal working of **CodeZen** and prepare for your viva/project presentation. It covers the architecture, technologies used, data flow, and common questions you might be asked.

---

## 1. Project Overview
**CodeZen** is an all-in-one coding education platform that allows users to:
1.  **Learn**: Access interactive courses for 10+ programming languages.
2.  **Code**: Write and execute code in an integrated browser-based compiler.
3.  **Certify**: Take tests and earn verified certificates upon course completion.
4.  **Get Help**: Use an AI-powered assistant for debugging and explanations.

---

## 2. Technology Stack (The "What")

| Layer | Technology | Why we used it? |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16 (App Router)** | For server-side rendering (SSR), easy routing, and SEO. |
| **Library** | **React 19** | For building interactive UI components. |
| **Styling** | **Tailwind CSS v4** | For rapid, utility-first styling without writing custom CSS files. |
| **UI Components** | **Shadcn UI** | For pre-built, accessible components (Buttons, Cards, Dialogs). |
| **Animations** | **Framer Motion** | For smooth entry animations and transitions. |
| **Authentication** | **Clerk** | For secure user sign-up, sign-in, and session management. |
| **Database** | **PostgreSQL (via Prisma)** | To store user testimonials and potentially user data. |
| **Compiler API** | **Judge0** | To execute code remotely and return output. |
| **AI Model** | **Google Gemini 2.5** | To power the AI coding assistant. |

---

## 3. Key Modules & Working (The "How")

### A. The Compiler (`/compiler`)
*   **How it works:** It does **not** run code on the user's browser directly (except JS potentially). It sends the code to a remote server.
*   **Flow:**
    1.  User selects a language (e.g., Python) and types code.
    2.  User clicks "Run".
    3.  Frontend sends a POST request to **Judge0 API** (`https://ce.judge0.com/submissions`).
    4.  The request contains `source_code` and `language_id`.
    5.  Judge0 executes the code in a secure sandbox.
    6.  Judge0 returns `stdout` (output), `stderr` (errors), and execution time.
    7.  Frontend displays this result to the user.

### B. The AI Assistant (`/dashboard/ai-assistant`)
*   **How it works:** It acts as a chatbot contextually aware of programming.
*   **Flow:**
    1.  User types a question (e.g., "Explain this loop").
    2.  Frontend sends the message to our internal API route: `/api/chat-bot`.
    3.  The API route uses `@google/genai` to send the prompt to **Google Gemini**.
    4.  **System Prompting:** We inject a "System Instruction" telling Gemini to *only* answer coding questions and keep answers concise.
    5.  The AI response is returned and displayed in the chat interface.

### C. Courses & Progress (`/courses`)
*   **Data Source:** Course content (lessons, quizzes) is stored in `lib/data.ts`. This is a **static data** approach, making the app very fast as it doesn't need to query a database for course content.
*   **Dynamic Routing:** We use a file named `[id]/page.tsx`. If you go to `/courses/python`, Next.js captures `python` as the `id` parameter and fetches the corresponding course data.
*   **Progress Tracking:** User progress (completed lessons) is managed using React Context (`UserContext`) and persisted (saved) in the browser's **Local Storage** (or synced to a database if connected).

### D. Testimonials (Database Integration)
*   **How it works:** Allows users to submit feedback.
*   **Tech:** Uses **Server Actions** (`lib/actions.ts`) and **Prisma ORM**.
*   **Flow:**
    1.  User submits form.
    2.  `createTestimonial` function runs on the **Server**.
    3.  Prisma connects to the PostgreSQL database.
    4.  Data is inserted safely.
    5.  `getTestimonials` fetches the latest data to display on the marquee.

---

## 4. Project Structure (Where things are)

This tree structure shows the organization of key files in the project.

```
CodeZen/
├── app/                        # Main application logic (Next.js App Router)
│   ├── api/                    # Backend API routes
│   │   └── chat-bot/           # API for AI assistant (Gemini integration)
│   │       └── route.ts
│   ├── compiler/               # Code Compiler page
│   │   └── page.tsx
│   ├── courses/                # Course pages
│   │   ├── [id]/               # Dynamic route for specific courses (e.g., /courses/python)
│   │   │   ├── test/           # Test/Quiz page for the course
│   │   │   └── page.tsx        # Course learning page (video + notes)
│   │   └── page.tsx            # List of all courses
│   ├── dashboard/              # User dashboard (protected area)
│   ├── layout.tsx              # Root layout (Navbar, Footer, Providers)
│   └── page.tsx                # Landing Page (Home)
│
├── components/                 # Reusable UI components
│   ├── landing/                # Components specific to landing page (Hero, Features)
│   ├── ui/                     # Shadcn UI primitives (Buttons, Cards, Inputs)
│   ├── ai-assistant.tsx        # Chatbot UI component
│   ├── course-player.tsx       # Video player & markdown renderer
│   └── certificate.tsx         # Certificate generation component
│
├── lib/                        # Utilities and Data
│   ├── actions.ts              # Server Actions (Database operations)
│   ├── data.ts                 # Static course content (JSON-like structure)
│   ├── languages.ts            # Compiler language configs (ID, boilerplate)
│   └── utils.ts                # Helper functions (Tailwind class merger)
│
├── prisma/                     # Database Configuration
│   └── schema.prisma           # Database schema (Testimonial model)
│
├── public/                     # Static assets (images, icons)
├── .env                        # Environment variables (API keys - DO NOT SHARE)
├── middleware.ts               # Clerk authentication middleware
├── next.config.mjs             # Next.js configuration
├── package.json                # Project dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

---
