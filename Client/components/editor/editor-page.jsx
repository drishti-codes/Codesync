"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { EditorNavbar } from "./editor-navbar"
import { EditorSidebar } from "./editor-sidebar"
import { CodeEditor } from "./code-editor"
import { CollabPanel } from "./collab-panel"
import { OutputPanel } from "./output-panel"
import { VersionHistory } from "./version-history"
import { executeCode } from "@/lib/api"
import { connectSocket, disconnectSocket } from "@/lib/socket"

const mockCursors = []

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
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
const result: number = fibonacci(10);
console.log("Fibonacci(10) =", result);
`,
  Python: `# Welcome to CodeSync!
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

result = fibonacci(10)
print("Fibonacci(10) =", result)
`,
  Java: `// Welcome to CodeSync!
public class Main {
    static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    public static void main(String[] args) {
        System.out.println("Fibonacci(10) = " + fibonacci(10));
    }
}
`,
  "C++": `// Welcome to CodeSync!
#include <iostream>
using namespace std;
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
int main() {
    cout << "Fibonacci(10) = " << fibonacci(10) << endl;
    return 0;
}
`,
  C: `// Welcome to CodeSync!
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
package main
import "fmt"
func fibonacci(n int) int {
	if n <= 1 { return n }
	return fibonacci(n-1) + fibonacci(n-2)
}
func main() {
	fmt.Println("Fibonacci(10) =", fibonacci(10))
}
`,
  Rust: `// Welcome to CodeSync!
fn fibonacci(n: u32) -> u32 {
    if n <= 1 { return n; }
    fibonacci(n - 1) + fibonacci(n - 2)
}
fn main() {
    println!("Fibonacci(10) = {}", fibonacci(10));
}
`,
  Ruby: `# Welcome to CodeSync!
def fibonacci(n)
  return n if n <= 1
  fibonacci(n - 1) + fibonacci(n - 2)
end
puts "Fibonacci(10) = #{fibonacci(10)}"
`,
  PHP: `<?php
function fibonacci($n) {
    if ($n <= 1) return $n;
    return fibonacci($n - 1) + fibonacci($n - 2);
}
echo "Fibonacci(10) = " . fibonacci(10) . "\\n";
`,
  "C#": `// Welcome to CodeSync!
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
fun fibonacci(n: Int): Int {
    if (n <= 1) return n
    return fibonacci(n - 1) + fibonacci(n - 2)
}
fun main() {
    println("Fibonacci(10) = \${fibonacci(10)}")
}
`,
}

// ✅ Random color for user cursor
const userColors = ["#e85d75", "#60a5fa", "#34d399", "#f59e0b", "#a78bfa", "#f97316"]
const getRandomColor = () => userColors[Math.floor(Math.random() * userColors.length)]

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

  // ✅ Real users + messages
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [cursors, setCursors] = useState([])

  const socketRef = useRef(null)
  const isRemoteChange = useRef(false)

  // ✅ Socket.io connection
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (!savedUser) return

    const user = JSON.parse(savedUser)
    const userWithColor = { ...user, color: getRandomColor() }

    const socket = connectSocket()
    socketRef.current = socket

    // Room join karo
    socket.emit("join-room", { roomId, user: userWithColor })

    // ✅ Users list update
    socket.on("room-users", (roomUsers) => {
      setUsers(roomUsers)
    })

    // ✅ Real-time code sync
    socket.on("code-update", (newCode) => {
      isRemoteChange.current = true
      setCode(newCode)
    })

    // ✅ Chat messages
    socket.on("new-message", (message) => {
      setMessages(prev => [...prev, message])
    })

    // ✅ Cursor positions
    socket.on("cursor-update", (cursorData) => {
      setCursors(prev => {
        const others = prev.filter(c => c.userId !== cursorData.userId)
        return [...others, cursorData]
      })
    })

    // ✅ User joined notification
    socket.on("user-joined", (joinedUser) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        system: true,
        text: `${joinedUser?.name || "Someone"} joined the room`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }])
    })

    // ✅ User left notification
    socket.on("user-left", (leftUser) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        system: true,
        text: `${leftUser?.name || "Someone"} left the room`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }])
      setCursors(prev => prev.filter(c => c.userId !== leftUser?.id))
    })

    return () => {
      socket.off("room-users")
      socket.off("code-update")
      socket.off("new-message")
      socket.off("cursor-update")
      socket.off("user-joined")
      socket.off("user-left")
      disconnectSocket()
    }
  }, [roomId])

  // ✅ Code change → Socket se broadcast karo
  const handleCodeChange = useCallback((newCode) => {
    if (isRemoteChange.current) {
      isRemoteChange.current = false
      setCode(newCode)
      return
    }
    setCode(newCode)
    socketRef.current?.emit("code-change", { roomId, code: newCode })
  }, [roomId])

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

  const handleSendMessage = useCallback((message) => {
    const savedUser = localStorage.getItem("user")
    if (!savedUser) return
    const user = JSON.parse(savedUser)

    const msgData = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userColor: "#60a5fa",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    socketRef.current?.emit("send-message", { roomId, message: msgData })
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
        users={users.length > 0 ? users : []}
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
            onChange={handleCodeChange}
            cursors={cursors}
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
          users={users}
          currentUserId={JSON.parse(localStorage.getItem("user") || "{}").id}
          messages={messages}
          onSendMessage={handleSendMessage}
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