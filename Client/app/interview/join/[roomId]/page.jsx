"use client"

import { use } from "react"
import { InterviewEditorPage } from 
  "@/components/editor/interview-editor-page"

export default function CandidatePage({ params }) {
  const { roomId } = use(params)

  return (
    <InterviewEditorPage
      roomId={roomId}
      roomName="Mock Interview"
      role="candidate"
      onEnd={() => window.history.back()}
    />
  )
}