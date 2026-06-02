"use client"

import { useRef, useEffect, useState } from "react"
import Editor from "@monaco-editor/react"

const defaultCode = `// Welcome to CodeSync!
// Start coding collaboratively with your team

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Test the function
const result = fibonacci(10);
console.log("Fibonacci(10) =", result);

// Array manipulation example
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

// Object destructuring
const user = {
  name: "Arjun",
  role: "Developer",
  skills: ["JavaScript", "Python", "React"]
};

const { name, skills } = user;
console.log(\`\${name} knows: \${skills.join(", ")}\`);
`

export function CodeEditor({ language, code, onChange, cursors }) {
  const editorRef = useRef(null)
  const [decorations, setDecorations] = useState([])

  const handleEditorMount = (editor) => {
    editorRef.current = editor
    updateCursorDecorations()
  }

  const updateCursorDecorations = () => {
    if (!editorRef.current) return

    const newDecorations = cursors.map((cursor) => ({
      range: {
        startLineNumber: cursor.position.lineNumber,
        startColumn: cursor.position.column,
        endLineNumber: cursor.position.lineNumber,
        endColumn: cursor.position.column + 1,
      },
      options: {
        className: `cursor-${cursor.userId}`,
        beforeContentClassName: `cursor-label-${cursor.userId}`,
        hoverMessage: { value: cursor.userName },
      },
    }))

    const ids = editorRef.current.deltaDecorations(decorations, newDecorations)
    setDecorations(ids)
  }

  useEffect(() => {
    updateCursorDecorations()
  }, [cursors])

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Cursor labels overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
        {cursors.map((cursor) => (
          <div
            key={cursor.userId}
            className="absolute px-2 py-0.5 text-xs font-medium text-primary-foreground rounded-t"
            style={{
              backgroundColor: cursor.color,
              top: `${(cursor.position.lineNumber - 1) * 19 - 18}px`,
              left: `${cursor.position.column * 7.8 + 60}px`,
            }}
          >
            {cursor.userName}
          </div>
        ))}
      </div>

      {/* File tabs */}
      <div className="h-9 bg-[#1e1e1e] border-b border-border flex items-center px-2">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-card border-t-2 border-t-primary rounded-t text-sm text-foreground">
          <span>index.js</span>
          <button className="ml-2 text-muted-foreground hover:text-foreground">
            ×
          </button>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
          <span>App.jsx</span>
        </div>
      </div>

      <Editor
        height="calc(100% - 36px)"
        language={language.toLowerCase()}
        value={code || defaultCode}
        onChange={(value) => onChange(value || "")}
        onMount={handleEditorMount}
        theme="vs-dark"
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          lineNumbers: "on",
          renderLineHighlight: "all",
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          padding: { top: 16 },
          bracketPairColorization: { enabled: true },
          suggest: {
            showKeywords: true,
            showSnippets: true,
          },
        }}
      />

      {/* Custom cursor styles */}
      <style jsx global>{`
        ${cursors.map(
          (cursor) => `
          .cursor-${cursor.userId} {
            background-color: ${cursor.color}40 !important;
            border-left: 2px solid ${cursor.color} !important;
          }
        `
        ).join("")}
      `}</style>
    </div>
  )
}