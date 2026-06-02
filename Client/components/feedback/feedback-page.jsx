"use client"

import { useState } from "react"
import { Trophy, Clock, ArrowLeft, CheckCircle2 } from "lucide-react"
import { CodeReviewPanel } from "./code-review-panel"
import { RatingForm } from "./rating-form"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const mockFinalCode = `function twoSum(nums, target) {
  const map = new Map()
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]
    
    if (map.has(complement)) {
      return [map.get(complement), i]
    }
    
    map.set(nums[i], i)
  }
  
  return []
}`

export function FeedbackPage({
  roomId,
  roomName,
  role = "interviewer",
  sessionData,
  onBack,
}) {
  const isInterviewer = role === "interviewer"

  const mockSession = {
    problem: "Two Sum",
    difficulty: "Easy",
    language: "JavaScript",
    timeTaken: "32:15",
    totalTime: "45:00",
    ...sessionData,
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">

      {/* ── Top Bar ── */}
      <header className="h-12 bg-card border-b border-border px-4 flex items-center justify-between shrink-0">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>

        {/* Center */}
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span className="font-semibold text-foreground text-sm">
            Interview Complete!
          </span>
        </div>

        {/* Right — Session info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-primary" />
            <span>{mockSession.problem}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{mockSession.timeTaken}</span>
          </div>
          <span className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-medium",
            mockSession.difficulty === "Easy"
              ? "bg-green-400/10 text-green-400"
              : mockSession.difficulty === "Medium"
              ? "bg-yellow-400/10 text-yellow-400"
              : "bg-red-400/10 text-red-400"
          )}>
            {mockSession.difficulty}
          </span>
        </div>
      </header>

      {/* ── Main Content ── */}
      {isInterviewer ? (
        // Interviewer: Code Review + Feedback Form
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Code Review (55%) */}
          <div className="w-[55%] border-r border-border overflow-hidden">
            <CodeReviewPanel
              code={mockFinalCode}
              language={mockSession.language}
            />
          </div>

          {/* Right: Rating Form (45%) */}
          <div className="w-[45%] overflow-hidden">
            <RatingForm
              sessionData={mockSession}
              onSubmit={(feedback) => {
                console.log("Feedback submitted:", feedback)
              }}
            />
          </div>
        </div>
      ) : (
        // Candidate: Apna summary dekhe
        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
          {/* Success message */}
          <div className="text-center space-y-2">
            <div className="w-20 h-20 rounded-full bg-green-400/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Great Job! 🎉
            </h2>
            <p className="text-muted-foreground text-sm">
              You completed the mock interview. Here's your session summary.
            </p>
          </div>

          {/* Session stats */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {[
              { label: "Problem Solved", value: mockSession.problem },
              { label: "Difficulty", value: mockSession.difficulty },
              { label: "Language Used", value: mockSession.language },
              { label: "Time Taken", value: mockSession.timeTaken },
            ].map(stat => (
              <div
                key={stat.label}
                className="bg-card border border-border rounded-xl p-4 text-center"
              >
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-sm font-semibold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Your code */}
          <div className="w-full max-w-2xl">
            <p className="text-xs font-medium text-foreground mb-2">Your Final Code:</p>
            <div className="rounded-xl overflow-hidden border border-border h-48">
              <CodeReviewPanel
                code={mockFinalCode}
                language={mockSession.language}
                readOnly={true}
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Feedback from your interviewer will appear here once submitted.
          </p>

          <Button
            onClick={onBack}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Back to Dashboard
          </Button>
        </div>
      )}
    </div>
  )
}