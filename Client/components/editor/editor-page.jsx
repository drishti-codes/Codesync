"use client"

import { useState, useCallback } from "react"
import { EditorNavbar } from "./editor-navbar"
import { EditorSidebar } from "./editor-sidebar"
import { CodeEditor } from "./code-editor"
import { CollabPanel } from "./collab-panel"
import { OutputPanel } from "./output-panel"
import { VersionHistory } from "./version-history"
import { executeCode } from "@/lib/api"

const mockUsers = [
  { id: "1", name: "Arjun", color: "#e85d75", isAdmin: true, isOnline: true },
  { id: "2", name: "Sarah", color: "#60a5fa", isOnline: true },
  { id: "3", name: "Mike", color: "#34d399", isOnline: true },
  { id: "4", name: "John", color: "#f59e0b", isOnline: false },
]

const mockCursors = [
  { userId: "2", userName: "Sarah", color: "#60a5fa", position: { lineNumber: 8, column: 15 } },
  { userId: "3", userName: "Mike", color: "#34d399", position: { lineNumber: 15, column: 22 } },
]

// ✅ Language ke hisaab se default code — 12 languages
const defaultCodeByLanguage = {
  JavaScript: `// Welcome to CodeSync!
// Start coding collaboratively with your team

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log("Fibonacci(10) =", result);
`,

  TypeScript: `// Welcome to CodeSync!
// Start coding collaboratively with your team

function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result: number = fibonacci(10);
console.log("Fibonacci(10) =", result);
`,

  Python: `# Welcome to CodeSync!
# Start coding collaboratively with your team

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

result = fibonacci(10)
print("Fibonacci(10) =", result)
`,

  Java: `// Welcome to CodeSync!
// Start coding collaboratively with your team

public class Main {
    static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }

    public static void main(String[] args) {
        int result = fibonacci(10);
        System.out.println("Fibonacci(10) = " + result);
    }
}
`,

  "C++": `// Welcome to CodeSync!
// Start coding collaboratively with your team

#include <iostream>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    int result = fibonacci(10);
    cout << "Fibonacci(10) = " << result << endl;
    return 0;
}
`,

  C: `// Welcome to CodeSync!
// Start coding collaboratively with your team

#include <stdio.h>

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    printf("Fibonacci(10) = %d\\n", fibonacci(10));
    return 0;
}
`,

  Go: `// Welcome to CodeSync!
// Start coding collaboratively with your team

package main

import "fmt"

func fibonacci(n int) int {
	if n <= 1 {
		return n
	}
	return fibonacci(n-1) + fibonacci(n-2)
}

func main() {
	result := fibonacci(10)
	fmt.Println("Fibonacci(10) =", result)
}
`,

  Rust: `// Welcome to CodeSync!
// Start coding collaboratively with your team

fn fibonacci(n: u32) -> u32 {
    if n <= 1 {
        return n;
    }
    fibonacci(n - 1) + fibonacci(n - 2)
}

fn main() {
    let result = fibonacci(10);
    println!("Fibonacci(10) = {}", result);
}
`,

  Ruby: `# Welcome to CodeSync!
# Start coding collaboratively with your team

def fibonacci(n)
  return n if n <= 1
  fibonacci(n - 1) + fibonacci(n - 2)
end

result = fibonacci(10)
puts "Fibonacci(10) = #{result}"
`,

  PHP: `<?php
// Welcome to CodeSync!
// Start coding collaboratively with your team

function fibonacci($n) {
    if ($n <= 1) return $n;
    return fibonacci($n - 1) + fibonacci($n - 2);
}

$result = fibonacci(10);
echo "Fibonacci(10) = " . $result . "\\n";
`,

  "C#": `// Welcome to CodeSync!
// Start coding collaboratively with your team

using System;

class Program {
    static int Fibonacci(int n) {
        if (n <= 1) return n;
        return Fibonacci(n - 1) + Fibonacci(n - 2);
    }

    static void Main() {
        Console.WriteLine("Fibonacci(10) = " + Fibonacci(10));
    }
}
`,

  Kotlin: `// Welcome to CodeSync!
// Start coding collaboratively with your team

fun fibonacci(n: Int): Int {
    if (n <= 1) return n
    return fibonacci(n - 1) + fibonacci(n - 2)
}

fun main() {
    println("Fibonacci(10) = \${fibonacci(10)}")
}
`,
}

export function EditorPage({ roomId, roomName, language, onLeave }) {
  const initialCode = defaultCodeByLanguage[language] || defaultCodeByLanguage.JavaScript

  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState("")
  const [errors, setErrors] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [activeIcon, setActiveIcon] = useState("explorer")
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [runtime, setRuntime] = useState(undefined)
  const [memory, setMemory] = useState(undefined)
  const [shareMessage, setShareMessage] = useState(null)

  const handleRunCode = useCallback(async () => {
    setIsRunning(true)
    setOutput("")
    setErrors([])

    const startTime = performance.now()

    try {
      const result = await executeCode(code, language)
      const endTime = performance.now()

      if (result.error) {
        setErrors([result.error])
      } else {
        setOutput(result.output || "(no output)")
      }

      setRuntime(`${((endTime - startTime) / 1000).toFixed(3)}s`)
      setMemory("—")
    } catch (err) {
      setErrors([err.message || "Execution failed"])
    } finally {
      setIsRunning(false)
    }
  }, [code, language])

  const handleShare = useCallback(async () => {
    const shareUrl = `${window.location.origin}/room/${roomId}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      setShareMessage("Link copied!")
    } catch {
      setShareMessage(`Share: ${shareUrl}`)
    }
    setTimeout(() => setShareMessage(null), 3000)
  }, [roomId])

  const handleRestoreVersion = useCallback((versionId) => {
    console.log("Restoring version:", versionId)
    setShowVersionHistory(false)
  }, [])

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Navbar */}
      <EditorNavbar
        roomName={roomName}
        users={mockUsers}
        isRunning={isRunning}
        isDarkTheme={isDarkTheme}
        shareMessage={shareMessage}
        onRun={handleRunCode}
        onShare={handleShare}
        onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
        onLeave={onLeave}
      />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <EditorSidebar
          activeIcon={activeIcon}
          onIconChange={setActiveIcon}
        />

        {/* Editor area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Code Editor */}
          <CodeEditor
            language={language}
            code={code}
            onChange={setCode}
            cursors={mockCursors}
          />

          {/* Output Panel */}
          <OutputPanel
            output={output}
            errors={errors}
            runtime={runtime}
            memory={memory}
            isRunning={isRunning}
            onRun={handleRunCode}
          />
        </div>

        {/* Right Collab Panel */}
        <CollabPanel
          users={mockUsers}
          currentUserId="1"
        />
      </div>

      {/* Version History Drawer */}
      <VersionHistory
        isOpen={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
        onRestore={handleRestoreVersion}
      />
    </div>
  )
}