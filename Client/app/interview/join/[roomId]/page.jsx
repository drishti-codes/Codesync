"use client"

import { use, useState } from "react"
import { InterviewEditorPage } from "@/components/editor/interview-editor-page"
import { FeedbackPage } from "@/components/feedback/feedback-page"

export default function CandidatePage({ params }) {
  const { roomId } = use(params)
  const [showFeedback, setShowFeedback] = useState(false)

  if (showFeedback) {
    return (
      <FeedbackPage
        roomId={roomId}
        roomName="Mock Interview"
        role="candidate"
        onBack={() => window.history.back()}
      />
    )
  }

  return (
    <InterviewEditorPage
      roomId={roomId}
      roomName="Mock Interview"
      role="candidate"
      onEnd={() => setShowFeedback(true)}
    />
  )
}