"use client"

import { useState } from "react"
import { Star, ThumbsUp, TrendingUp, MessageSquare, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const skills = [
  { id: "overall", label: "Overall Performance", icon: Star },
  { id: "problemSolving", label: "Problem Solving", icon: TrendingUp },
  { id: "communication", label: "Communication", icon: MessageSquare },
  { id: "codeQuality", label: "Code Quality", icon: ThumbsUp },
]

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={cn(
              "w-5 h-5 transition-colors",
              star <= (hovered || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            )}
          />
        </button>
      ))}
      <span className="text-xs text-muted-foreground ml-1 self-center">
        {(hovered || value) > 0 ? [
          "", "Poor", "Fair", "Good", "Great", "Excellent"
        ][hovered || value] : "Rate"}
      </span>
    </div>
  )
}

export function RatingForm({ onSubmit, sessionData }) {
  const [ratings, setRatings] = useState({
    overall: 0,
    problemSolving: 0,
    communication: 0,
    codeQuality: 0,
  })
  const [strengths, setStrengths] = useState("")
  const [improvements, setImprovements] = useState("")
  const [overallComment, setOverallComment] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (ratings.overall === 0) return

    const feedback = {
      ratings,
      strengths,
      improvements,
      overallComment,
      sessionData,
    }

    setSubmitted(true)
    onSubmit?.(feedback)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-green-400/10 flex items-center justify-center">
          <ThumbsUp className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Feedback Submitted!</h3>
        <p className="text-sm text-muted-foreground">
          Your feedback has been saved successfully.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Interviewer Feedback</span>
        </div>
      </div>

      <div className="p-4 space-y-5 flex-1">
        {/* Session quick stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Problem", value: sessionData?.problem || "Two Sum" },
            { label: "Language", value: sessionData?.language || "JavaScript" },
            { label: "Time Taken", value: sessionData?.timeTaken || "32:15" },
          ].map(stat => (
            <div key={stat.label} className="bg-secondary rounded-lg p-2 text-center">
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              <p className="text-xs font-medium text-foreground mt-0.5">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Star Ratings */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-foreground">Rate the candidate:</p>
          {skills.map(skill => (
            <div key={skill.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <skill.icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="text-xs text-foreground truncate">{skill.label}</span>
              </div>
              <StarRating
                value={ratings[skill.id]}
                onChange={(val) => setRatings(prev => ({ ...prev, [skill.id]: val }))}
              />
            </div>
          ))}
        </div>

        {/* Strengths */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-green-400 flex items-center gap-1.5">
            <ThumbsUp className="w-3.5 h-3.5" />
            Strengths
          </label>
          <textarea
            value={strengths}
            onChange={e => setStrengths(e.target.value)}
            placeholder="What did the candidate do well?"
            rows={2}
            className="w-full bg-secondary rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-green-400/50 border border-green-400/20"
          />
        </div>

        {/* Improvements */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-yellow-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            Areas to Improve
          </label>
          <textarea
            value={improvements}
            onChange={e => setImprovements(e.target.value)}
            placeholder="What can the candidate improve?"
            rows={2}
            className="w-full bg-secondary rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-yellow-400/50 border border-yellow-400/20"
          />
        </div>

        {/* Overall Comment */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            Overall Comments
          </label>
          <textarea
            value={overallComment}
            onChange={e => setOverallComment(e.target.value)}
            placeholder="Any additional feedback..."
            rows={2}
            className="w-full bg-secondary rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary border border-border"
          />
        </div>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={ratings.overall === 0}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <Send className="w-4 h-4" />
          Submit Feedback
        </Button>

        {ratings.overall === 0 && (
          <p className="text-[10px] text-center text-muted-foreground">
            Overall rating required to submit
          </p>
        )}
      </div>
    </div>
  )
}