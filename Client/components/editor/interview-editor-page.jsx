"use client"

import { useState, useCallback, useEffect } from "react"
import { 
  Trophy, 
  Clock, 
  ChevronRight,
  Send,
  Lightbulb,
  FileText,
  Users,
  PhoneOff,
  Tag,
  SkipForward,
  Share2,
  Copy,
  Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { CodeEditor } from "./code-editor"
import { OutputPanel } from "./output-panel"
import { cn } from "@/lib/utils"

const mockProblem = {
  id: 1,
  title: "Two Sum",
  difficulty: "Easy",
  tags: ["Array", "Hash Table"],
  description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
      explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
    }
  ],
  constraints: [
    "2 <= nums.length <= 10⁴",
    "-10⁹ <= nums[i] <= 10⁹",
    "-10⁹ <= target <= 10⁹",
    "Only one valid answer exists."
  ],
  starterCode: {
    JavaScript: `function twoSum(nums, target) {\n  // Write your solution here\n  \n}`,
    Python: `def two_sum(nums, target):\n    # Write your solution here\n    pass`,
    Java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        \n    }\n}`
  }
}

const hints = [
  "Try using a Hash Map to store previously seen numbers.",
  "For each number, check if (target - number) exists in your map.",
  "Time complexity can be O(n) with the right approach."
]

const TOTAL_TIME = 45 * 60

export function InterviewEditorPage({ roomId, roomName, role = "interviewer", onEnd }) {
  const [code, setCode] = useState(mockProblem.starterCode["JavaScript"])
  const [language, setLanguage] = useState("JavaScript")
  const [output, setOutput] = useState("")
  const [errors, setErrors] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [messages, setMessages] = useState([
    { id: "1", from: "interviewer", text: "Welcome! Take your time to read the problem.", time: "now" }
  ])
  const [newMessage, setNewMessage] = useState("")
  const [activeTab, setActiveTab] = useState("chat")
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [runtime, setRuntime] = useState(undefined)
  const [memory, setMemory] = useState(undefined)
  const [linkCopied, setLinkCopied] = useState(false)

  const isInterviewer = role === "interviewer"

  // Timer countdown
  useEffect(() => {
    if (!isTimerRunning) return
    if (timeLeft <= 0) {
      setIsTimerRunning(false)
      return
    }
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isTimerRunning, timeLeft])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0")
    const s = (seconds % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  const timerColor = timeLeft < 5 * 60
    ? "text-red-400"
    : timeLeft < 15 * 60
    ? "text-yellow-400"
    : "text-green-400"

  const handleRunCode = useCallback(async () => {
    setIsRunning(true)
    setOutput("")
    setErrors([])
    await new Promise(resolve => setTimeout(resolve, 1500))
    setOutput(`Output: [0, 1]\n✓ Example 1 passed\n✓ Example 2 passed`)
    setRuntime("0.021s")
    setMemory("2.1 MB")
    setIsRunning(false)
  }, [])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        from: role,
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ])
    setNewMessage("")
  }

  // ✅ Share link handler
  const handleShareLink = useCallback(async () => {
    const candidateLink = `${window.location.origin}/interview/join/${roomId}`
    try {
      await navigator.clipboard.writeText(candidateLink)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 3000)
    } catch {
      // Fallback — alert se dikhao
      alert(`Share this link with candidate:\n${candidateLink}`)
    }
  }, [roomId])

  const difficultyColor = {
    Easy: "text-green-400 bg-green-400/10",
    Medium: "text-yellow-400 bg-yellow-400/10",
    Hard: "text-red-400 bg-red-400/10"
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">

      {/* ── Top Bar ── */}
      <header className="h-12 bg-card border-b border-border px-4 flex items-center justify-between shrink-0">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground text-sm">
              {roomName || "Mock Interview"}
            </span>
          </div>
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full font-medium",
            isInterviewer
              ? "bg-blue-500/10 text-blue-400"
              : "bg-purple-500/10 text-purple-400"
          )}>
            {isInterviewer ? "Interviewer" : "Candidate"}
          </span>
        </div>

        {/* Center — Timer */}
        <div className="flex items-center gap-3">
          <div className={cn("flex items-center gap-2 font-mono text-lg font-bold", timerColor)}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
          {isInterviewer && (
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="text-xs px-3 py-1 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
            >
              {isTimerRunning ? "Pause" : "Start Timer"}
            </button>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* ✅ Share Link Button — interviewer only */}
          {isInterviewer && (
            <button
              onClick={handleShareLink}
              className={cn(
                "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors",
                linkCopied
                  ? "bg-green-500/10 text-green-400"
                  : "bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
              )}
            >
              {linkCopied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  Share Link
                </>
              )}
            </button>
          )}

          {isInterviewer && (
            <button
              onClick={() => {}}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
            >
              <SkipForward className="w-3.5 h-3.5" />
              Next Problem
            </button>
          )}

          <button
            onClick={() => setShowEndConfirm(true)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            End Interview
          </button>
        </div>
      </header>

      {/* ── Main 3-Column Layout ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── Column 1: Problem Statement (25%) ── */}
        <div className="w-[25%] border-r border-border flex flex-col overflow-hidden bg-card">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Title + Difficulty */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-foreground text-base">
                  {mockProblem.title}
                </h2>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full font-medium",
                  difficultyColor[mockProblem.difficulty]
                )}>
                  {mockProblem.difficulty}
                </span>
              </div>
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {mockProblem.tags.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
              {mockProblem.description}
            </p>

            {/* Examples */}
            <div className="space-y-3">
              {mockProblem.examples.map((ex, i) => (
                <div key={i} className="rounded-lg bg-secondary p-3 text-xs space-y-1">
                  <p className="font-medium text-foreground">Example {i + 1}:</p>
                  <p className="text-muted-foreground">
                    <span className="text-foreground">Input:</span> {ex.input}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="text-foreground">Output:</span> {ex.output}
                  </p>
                  {ex.explanation && (
                    <p className="text-muted-foreground">
                      <span className="text-foreground">Explanation:</span> {ex.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div>
              <p className="text-xs font-medium text-foreground mb-2">Constraints:</p>
              <ul className="space-y-1">
                {mockProblem.constraints.map((c, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <ChevronRight className="w-3 h-3 mt-0.5 shrink-0 text-primary" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Change Problem — interviewer only */}
          {isInterviewer && (
            <div className="p-3 border-t border-border">
              <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <SkipForward className="w-4 h-4" />
                Change Problem
              </button>
            </div>
          )}
        </div>

        {/* ── Column 2: Code Editor + Output (50%) ── */}
        <div className="w-[50%] flex flex-col overflow-hidden">
          {/* Language selector */}
          <div className="h-9 bg-[#1e1e1e] border-b border-border flex items-center px-3 gap-2 shrink-0">
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value)
                setCode(mockProblem.starterCode[e.target.value] || "")
              }}
              className="bg-transparent text-sm text-muted-foreground focus:outline-none cursor-pointer"
            >
              {Object.keys(mockProblem.starterCode).map(lang => (
                <option key={lang} value={lang} className="bg-[#1e1e1e]">
                  {lang}
                </option>
              ))}
            </select>
            {isInterviewer && (
              <span className="ml-auto text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                Read Only (Interviewer)
              </span>
            )}
          </div>

          {/* Editor */}
          <div className={cn(
            "flex-1 overflow-hidden",
            isInterviewer && "pointer-events-none opacity-90"
          )}>
            <CodeEditor
              language={language}
              code={code}
              onChange={setCode}
              cursors={[]}
            />
          </div>

          {/* Output */}
          <OutputPanel
            output={output}
            errors={errors}
            runtime={runtime}
            memory={memory}
            isRunning={isRunning}
            onRun={handleRunCode}
          />
        </div>

        {/* ── Column 3: Chat + Hints + Notes (25%) ── */}
        <div className="w-[25%] border-l border-border flex flex-col overflow-hidden bg-card">
          {/* Tabs */}
          <div className="flex border-b border-border shrink-0">
            {[
              { id: "chat", label: "Chat", icon: Users },
              { id: "hints", label: "Hints", icon: Lightbulb },
              { id: "notes", label: "Notes", icon: FileText },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors relative",
                  activeTab === id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
                {activeTab === id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Chat Tab */}
            {activeTab === "chat" && (
              <>
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex flex-col gap-0.5",
                        msg.from === role ? "items-end" : "items-start"
                      )}
                    >
                      <span className="text-[10px] text-muted-foreground capitalize">
                        {msg.from} · {msg.time}
                      </span>
                      <div className={cn(
                        "px-3 py-2 rounded-xl text-xs max-w-[85%]",
                        msg.from === role
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground"
                      )}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="p-3 border-t border-border flex gap-2">
                  <input
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-secondary rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </>
            )}

            {/* Hints Tab */}
            {activeTab === "hints" && (
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {isInterviewer ? (
                  <>
                    <p className="text-xs text-muted-foreground">
                      Reveal hints one by one to help the candidate:
                    </p>
                    {hints.map((hint, i) => (
                      <div
                        key={i}
                        className={cn(
                          "rounded-lg border p-3 text-xs transition-all",
                          i < hintsRevealed
                            ? "border-primary/30 bg-primary/5 text-foreground"
                            : "border-border bg-secondary text-muted-foreground"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">Hint {i + 1}</span>
                          {i === hintsRevealed && (
                            <button
                              onClick={() => setHintsRevealed(i + 1)}
                              className="text-[10px] text-primary hover:underline"
                            >
                              Reveal
                            </button>
                          )}
                        </div>
                        {i < hintsRevealed ? (
                          <p>{hint}</p>
                        ) : (
                          <p className="blur-sm select-none">{hint}</p>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                    <Lightbulb className="w-8 h-8 opacity-30" />
                    <p className="text-xs text-center">
                      Hints are controlled by the interviewer
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === "notes" && (
              <div className="flex-1 p-3">
                <textarea
                  placeholder={
                    isInterviewer
                      ? "Add your notes about the candidate's approach..."
                      : "Jot down your thoughts and approach..."
                  }
                  className="w-full h-full bg-secondary rounded-lg p-3 text-xs text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── End Interview Confirm Modal ── */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowEndConfirm(false)}
          />
          <div className="relative z-10 w-full max-w-sm mx-4 bg-card rounded-2xl p-6 border border-border shadow-2xl">
            <h3 className="text-lg font-bold text-foreground mb-2">End Interview?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {isInterviewer
                ? "This will end the session for both participants. You'll be taken to the feedback page."
                : "Are you sure you want to end the interview session?"}
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowEndConfirm(false)}
                className="flex-1 border-border"
              >
                Cancel
              </Button>
              <Button
                onClick={onEnd}
                className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                End Interview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}