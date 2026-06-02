"use client"

import { useState, useCallback } from "react"
import { EditorNavbar } from "./editor-navbar"
import { EditorSidebar } from "./editor-sidebar"
import { CodeEditor } from "./code-editor"
import { CollabPanel } from "./collab-panel"
import { OutputPanel } from "./output-panel"
import { VersionHistory } from "./version-history"

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

export function EditorPage({ roomId, roomName, language, onLeave }) {
  const [code, setCode] = useState("")
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

    await new Promise(resolve => setTimeout(resolve, 1500))

    setOutput(`Fibonacci(10) = 55
Doubled: [2, 4, 6, 8, 10]
Arjun knows: JavaScript, Python, React`)
    setRuntime("0.023s")
    setMemory("2.4 MB")
    setIsRunning(false)
  }, [])

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