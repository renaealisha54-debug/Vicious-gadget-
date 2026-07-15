'use client';

import { useState, useRef, useCallback } from 'react';

const LANGUAGES = ['kotlin', 'java', 'typescript', 'javascript', 'python', 'xml', 'gradle'];

const LANG_COLORS: Record<string, string> = {
  kotlin: '#7F52FF',
  java: '#ED8B00',
  typescript: '#3178C6',
  javascript: '#F7DF1E',
  python: '#3572A5',
  xml: '#e34c26',
  gradle: '#02303A',
};

type Tab = {
  id: string;
  name: string;
  language: string;
  content: string;
};

type AiPanel = 'complete' | 'snippet' | 'explain' | null;

const DEFAULT_TABS: Tab[] = [
  {
    id: '1',
    name: 'MainActivity.kt',
    language: 'kotlin',
    content: `package com.viciousvex.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.Text

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            Text("Hello, Vicious Vex!")
        }
    }
}
`,
  },
  {
    id: '2',
    name: 'build.gradle',
    language: 'gradle',
    content: `plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}

android {
    compileSdk 34
    defaultConfig {
        applicationId "com.viciousvex.app"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0"
    }
}
`,
  },
];

function getLangColor(lang: string) {
  return LANG_COLORS[lang] ?? '#888';
}

function AddTabModal({ onAdd, onClose }: { onAdd: (name: string, lang: string) => void; onClose: () => void }) {
  const [name, setName] = useState('');
  const [lang, setLang] = useState('kotlin');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-[#191923] border border-[#2e2e42] rounded-xl p-6 w-80 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">New File</h2>
        <input
          autoFocus
          className="w-full bg-[#13131c] border border-[#2e2e42] rounded-lg px-3 py-2 text-sm text-white placeholder-[#555] mb-3 outline-none focus:border-[#6666E6]"
          placeholder="filename.kt"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && name.trim() && onAdd(name.trim(), lang)}
        />
        <select
          className="w-full bg-[#13131c] border border-[#2e2e42] rounded-lg px-3 py-2 text-sm text-white mb-4 outline-none focus:border-[#6666E6]"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <button
            className="flex-1 bg-[#6666E6] hover:bg-[#5555cc] text-white text-sm font-medium py-2 rounded-lg transition-colors"
            onClick={() => name.trim() && onAdd(name.trim(), lang)}
          >
            Create
          </button>
          <button
            className="flex-1 bg-[#2e2e42] hover:bg-[#3a3a52] text-white text-sm py-2 rounded-lg transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function SnippetPanel({ language }: { language: string }) {
  const [desc, setDesc] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function generate() {
    if (!desc.trim()) return;
    setLoading(true); setError(''); setResult('');
    try {
      const r = await fetch('/api/snippet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, description: desc }),
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      setResult(d.codeSnippet);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-[#888] leading-relaxed">Describe what you want to generate in {language}.</p>
      <textarea
        className="w-full bg-[#13131c] border border-[#2e2e42] rounded-lg px-3 py-2 text-sm text-white placeholder-[#555] resize-none outline-none focus:border-[#6666E6] h-20"
        placeholder="e.g. a function to debounce coroutine calls"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <button
        className="bg-[#6666E6] hover:bg-[#5555cc] disabled:opacity-40 text-white text-sm font-medium py-2 rounded-lg transition-colors"
        onClick={generate}
        disabled={loading || !desc.trim()}
      >
        {loading ? 'Generating…' : 'Generate'}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {result && (
        <pre className="bg-[#0e0e16] border border-[#2e2e42] rounded-lg p-3 text-xs text-[#99E5FF] overflow-auto whitespace-pre-wrap max-h-64">
          {result}
        </pre>
      )}
    </div>
  );
}

function ExplainPanel({ code, language }: { code: string; language: string }) {
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<{ explanation: string; suggestedFix: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function explain() {
    if (!errorMsg.trim() || !code.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const r = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeSnippet: code, errorMessage: errorMsg, programmingLanguage: language }),
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      setResult(d);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-[#888] leading-relaxed">Paste an error message. AI will explain it using the current file's code.</p>
      <textarea
        className="w-full bg-[#13131c] border border-[#2e2e42] rounded-lg px-3 py-2 text-sm text-white placeholder-[#555] resize-none outline-none focus:border-[#6666E6] h-20"
        placeholder="Paste error message here…"
        value={errorMsg}
        onChange={(e) => setErrorMsg(e.target.value)}
      />
      <button
        className="bg-[#6666E6] hover:bg-[#5555cc] disabled:opacity-40 text-white text-sm font-medium py-2 rounded-lg transition-colors"
        onClick={explain}
        disabled={loading || !errorMsg.trim()}
      >
        {loading ? 'Analyzing…' : 'Explain & Fix'}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {result && (
        <div className="flex flex-col gap-2">
          <div className="bg-[#0e0e16] border border-[#2e2e42] rounded-lg p-3">
            <p className="text-xs text-[#888] mb-1 font-semibold uppercase tracking-wide">Explanation</p>
            <p className="text-xs text-white leading-relaxed">{result.explanation}</p>
          </div>
          <div className="bg-[#0e0e16] border border-[#2e2e42] rounded-lg p-3">
            <p className="text-xs text-[#888] mb-1 font-semibold uppercase tracking-wide">Suggested Fix</p>
            <pre className="text-xs text-[#99E5FF] whitespace-pre-wrap">{result.suggestedFix}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

function CompletePanel({ code, language, onInsert }: { code: string; language: string; onInsert: (s: string) => void }) {
  const [result, setResult] = useState<{ suggestions: string[]; explanation: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function complete() {
    setLoading(true); setError(''); setResult(null);
    try {
      const r = await fetch('/api/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentCode: code, cursorPosition: code.length, language }),
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      setResult(d);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-[#888] leading-relaxed">Get AI completions for the current file at cursor end.</p>
      <button
        className="bg-[#6666E6] hover:bg-[#5555cc] disabled:opacity-40 text-white text-sm font-medium py-2 rounded-lg transition-colors"
        onClick={complete}
        disabled={loading}
      >
        {loading ? 'Thinking…' : 'Get Completions'}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {result && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-[#888]">{result.explanation}</p>
          {result.suggestions.map((s, i) => (
            <div key={i} className="bg-[#0e0e16] border border-[#2e2e42] rounded-lg p-3 group relative">
              <pre className="text-xs text-[#99E5FF] whitespace-pre-wrap">{s}</pre>
              <button
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-[10px] bg-[#6666E6] text-white px-2 py-0.5 rounded transition-opacity"
                onClick={() => onInsert(s)}
              >
                Insert
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [tabs, setTabs] = useState<Tab[]>(DEFAULT_TABS);
  const [activeTabId, setActiveTabId] = useState('1');
  const [aiPanel, setAiPanel] = useState<AiPanel>(null);
  const [showAddTab, setShowAddTab] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  function updateContent(val: string) {
    setTabs((prev) => prev.map((t) => t.id === activeTab.id ? { ...t, content: val } : t));
  }

  function addTab(name: string, language: string) {
    const id = Date.now().toString();
    setTabs((prev) => [...prev, { id, name, language, content: '' }]);
    setActiveTabId(id);
    setShowAddTab(false);
  }

  function closeTab(id: string) {
    if (tabs.length === 1) return;
    const idx = tabs.findIndex((t) => t.id === id);
    const next = tabs[idx === 0 ? 1 : idx - 1];
    setTabs((prev) => prev.filter((t) => t.id !== id));
    if (activeTabId === id) setActiveTabId(next.id);
  }

  function insertAtEnd(snippet: string) {
    updateContent(activeTab.content + '\n' + snippet);
    textareaRef.current?.focus();
  }

  function togglePanel(p: AiPanel) {
    setAiPanel((prev) => prev === p ? null : p);
  }

  const lineCount = activeTab?.content.split('\n').length ?? 1;

  return (
    <div className="dark flex flex-col h-screen bg-[#191923] text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-11 border-b border-[#2e2e42] bg-[#13131c] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[#6666E6] font-bold text-sm tracking-tight">⚡ Vicious Vex</span>
          <span className="text-[#333] text-xs">|</span>
          <span className="text-[#555] text-xs">AI Code Editor</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            title="AI Complete"
            onClick={() => togglePanel('complete')}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${aiPanel === 'complete' ? 'bg-[#6666E6] text-white' : 'text-[#888] hover:text-white hover:bg-[#2e2e42]'}`}
          >
            ✦ Complete
          </button>
          <button
            title="Generate Snippet"
            onClick={() => togglePanel('snippet')}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${aiPanel === 'snippet' ? 'bg-[#6666E6] text-white' : 'text-[#888] hover:text-white hover:bg-[#2e2e42]'}`}
          >
            ✦ Snippet
          </button>
          <button
            title="Explain Error"
            onClick={() => togglePanel('explain')}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${aiPanel === 'explain' ? 'bg-[#6666E6] text-white' : 'text-[#888] hover:text-white hover:bg-[#2e2e42]'}`}
          >
            ✦ Explain
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main editor */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center bg-[#13131c] border-b border-[#2e2e42] overflow-x-auto shrink-0 scrollbar-none">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs cursor-pointer border-r border-[#2e2e42] shrink-0 group transition-colors ${
                  activeTabId === tab.id
                    ? 'bg-[#191923] text-white border-t-2 border-t-[#6666E6]'
                    : 'text-[#666] hover:text-white hover:bg-[#1e1e2e]'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: getLangColor(tab.language) }}
                />
                {tab.name}
                {tabs.length > 1 && (
                  <span
                    className="opacity-0 group-hover:opacity-100 text-[#555] hover:text-white ml-1 leading-none"
                    onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                  >
                    ×
                  </span>
                )}
              </div>
            ))}
            <button
              onClick={() => setShowAddTab(true)}
              className="px-3 py-2.5 text-xs text-[#555] hover:text-white transition-colors shrink-0"
              title="New file"
            >
              +
            </button>
          </div>

          {/* Editor area */}
          <div className="flex flex-1 overflow-hidden font-mono text-sm">
            {/* Line numbers */}
            <div
              className="select-none text-right pr-3 pl-3 pt-3 text-[#3a3a52] text-xs leading-6 bg-[#13131c] border-r border-[#2e2e42] overflow-hidden shrink-0"
              style={{ minWidth: '3rem' }}
            >
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i + 1}>{i + 1}</div>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              className="flex-1 bg-[#191923] text-[#c9d1d9] text-xs leading-6 p-3 resize-none outline-none font-mono caret-[#6666E6] overflow-auto"
              value={activeTab?.content ?? ''}
              onChange={(e) => updateContent(e.target.value)}
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>

          {/* Status bar */}
          <div className="flex items-center gap-4 px-4 h-7 bg-[#0e0e16] border-t border-[#2e2e42] shrink-0">
            <span className="text-[10px] text-[#555]">
              <span style={{ color: getLangColor(activeTab?.language) }}>●</span>{' '}
              {activeTab?.language}
            </span>
            <span className="text-[10px] text-[#555]">{lineCount} lines</span>
            <span className="text-[10px] text-[#555]">{activeTab?.content.length} chars</span>
            <span className="ml-auto text-[10px] text-[#6666E6]">Groq · llama-3.3-70b</span>
          </div>
        </div>

        {/* AI Sidebar */}
        {aiPanel && (
          <div className="w-72 flex flex-col border-l border-[#2e2e42] bg-[#13131c] overflow-y-auto shrink-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#2e2e42]">
              <span className="text-xs font-semibold text-[#6666E6] uppercase tracking-wider">
                {aiPanel === 'complete' ? '✦ AI Complete' : aiPanel === 'snippet' ? '✦ Generate Snippet' : '✦ Explain Error'}
              </span>
              <button
                onClick={() => setAiPanel(null)}
                className="text-[#555] hover:text-white text-sm transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              {aiPanel === 'snippet' && (
                <SnippetPanel language={activeTab?.language ?? 'kotlin'} />
              )}
              {aiPanel === 'explain' && (
                <ExplainPanel code={activeTab?.content ?? ''} language={activeTab?.language ?? 'kotlin'} />
              )}
              {aiPanel === 'complete' && (
                <CompletePanel
                  code={activeTab?.content ?? ''}
                  language={activeTab?.language ?? 'kotlin'}
                  onInsert={insertAtEnd}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {showAddTab && <AddTabModal onAdd={addTab} onClose={() => setShowAddTab(false)} />}
    </div>
  );
}
