
⚡ Vicious Vex
Part of the Vicious Suite — AI-powered developer tools by @renaealisha54-debug
An AI-powered web-based code editor built with Next.js 14 and Genkit + Gemini 2.5 Flash. Features syntax highlighting, file/project management, intelligent code completions, error explanations, and an integrated build console — all in a multi-panel IDE-style interface. Ships as a web app and can be wrapped as an Android APK via Capacitor.
✨ Features
Code Editor with Syntax Highlighting — Interactive editor supporting Java, Kotlin, TypeScript, XML, and more
AI Code Completion — Genkit flow delivers up to 3 context-aware completions at cursor position
AI Error Explanation & Fix — Paste an error message and get a plain-language explanation plus a concrete suggested fix
AI Code Snippet Generation — Generate boilerplate and code snippets from natural language prompts
Project & File Management — Create, open, save, delete, and organize files within the app
Integrated Build Console — Run Gradle/Java build commands and view real-time output logs
Customizable Workspace — Resizable, dockable panels for editor, file explorer, and console
🛠 Tech Stack
Layer
Tech
Framework
Next.js 14 (App Router)
AI Runtime
Genkit
AI Model
Gemini 2.5 Flash (googleai/gemini-2.5-flash)
Styling
Tailwind CSS
Fonts
Inter (UI), Source Code Pro (code)
Mobile Wrapper
Capacitor 6 (Android)
Package ID
com.viciousvex.app
🚀 Getting Started
Prerequisites
Node.js 18+
A Google AI API key (Gemini)
Android Studio + JDK 17 (only for APK builds)
Install & Run
Bash
Create a .env.local file:
Env
Start the dev server:
Bash
Open http://localhost:3000.
To run the Genkit dev UI:
Bash
📱 Android APK Build
Bash
Or step by step:
Bash
🤖 AI Flows
Flow
Input
Output
aiCodeCompletion
code, cursor position, language
up to 3 completions + explanation
aiErrorExplanationAndFix
code snippet, error message, language
explanation + suggested fix
aiCodeSnippetGeneration
prompt, language
generated code snippet
🎨 Design System
Token
Value
Background
#191923 (dark blue-grey)
Primary accent
#6666E6 (digital blue)
Highlight accent
#99E5FF (bright cyan)
UI font
Inter
Code font
Source Code Pro
