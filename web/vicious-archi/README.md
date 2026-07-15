# Vicious Archi

**Intelligent Code Dissector & AI Documentation Workbench**

Vicious Archi is a Next.js tool that takes raw monolith code blobs, parses them into logical file structures, detects the framework, extracts dependencies, scaffolds boilerplate, and generates context-aware README files using Google Gemini AI.

---

## Features

- **Live Code Dissector** — paste a code blob, get a structured file tree in real time
- **Framework Detection** — automatically identifies Next.js, React, Vue, Express, and more
- **Dependency Extractor** — scans imports and lists all external packages
- **Scaffold Generator** — auto-generates `package.json` and `tsconfig.json` from detected deps
- **AI README Synthesis** — uses Gemini 2.5 Flash (via Genkit) to write a context-aware README
- **ZIP Export** — downloads the full dissected project as a ready-to-use archive
- **Interactive File Explorer** — browse the generated architecture in a split-pane workbench

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Google AI Studio](https://aistudio.google.com/app/apikey) API key

### Installation

```bash
git clone https://github.com/your-username/vicious-archi.git
cd vicious-archi
npm install
```

### Environment Setup

Copy the example env file and add your key:

```bash
cp .env.example .env
```

Edit `.env`:

```
GOOGLE_GENAI_API_KEY=your_api_key_here
```

### Running

```bash
# Development
npm run dev

# Production build
npm run build
npm run start
```

App runs on [http://localhost:9002](http://localhost:9002)

---

## How to Use

1. Paste a monolith code blob into the left editor pane
2. Use `// FILE: path/to/file.ext` markers to define file boundaries (optional but recommended)
3. Click **Dissect** — the right pane populates with your project architecture
4. Click **Synthesize README** to generate AI documentation
5. Click **Export ZIP** to download the full project

**Example input format:**

```
// FILE: src/components/Button.tsx

import React from 'react';
export const Button = () => <button>Click me</button>;

// FILE: src/app/page.tsx

import { Button } from '../components/Button';
export default function Home() { return <Button />; }
```

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **AI**: Google Genkit + Gemini 2.5 Flash
- **UI**: shadcn/ui + Tailwind CSS + Radix UI
- **Export**: JSZip

---

## Project Structure

```
src/
├── ai/
│   ├── flows/generate-codebase-readme.ts  # Genkit AI flow
│   ├── genkit.ts                           # Genkit + Google AI config
│   └── dev.ts                              # Genkit dev server entry
├── app/
│   ├── layout.tsx
│   ├── page.tsx                            # Main workbench UI
│   └── globals.css
├── components/
│   ├── ui/                                 # shadcn/ui components
│   └── workbench/
│       ├── CodeEditor.tsx                  # Left pane input
│       ├── FileExplorer.tsx                # Right pane tree navigator
│       └── StatusBar.tsx                   # Footer status strip
├── hooks/
│   └── use-toast.ts
└── lib/
    ├── dissector.ts    # Core parsing, framework detection, dep extraction
    ├── scaffolder.ts   # Boilerplate generation
    ├── types.ts        # Shared interfaces
    └── utils.ts        # cn() helper
```

---

## License

MIT
