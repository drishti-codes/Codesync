"use client"

import { useRef, useEffect, useState } from "react"
import Editor from "@monaco-editor/react"
import { MessageSquare, Plus, X, Check, AlertTriangle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const commentTypes = [
  { id: "good", label: "Good", icon: Check, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/30", lineColor: "#22c55e20" },
  { id: "improve", label: "Improve", icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/30", lineColor: "#eab30820" },
  { id: "wrong", label: "Wrong", icon: XCircle, color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/30", lineColor: "#f8717120" },
]

export function CodeReviewPanel({ code, language }) {
  const editorRef = useRef(null)
  const hoverTimeoutRef = useRef(null)  // ✅ timeout ref
  const [comments, setComments] = useState([])
  const [activeCommentLine, setActiveCommentLine] = useState(null)
  const [commentText, setCommentText] = useState("")
  const [commentType, setCommentType] = useState("good")
  const [hoveredLine, setHoveredLine] = useState(null)
  const [decorations, setDecorations] = useState([])

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor

    editor.onMouseMove((e) => {
      // ✅ Pehle se chal raha timeout cancel karo
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      if (e.target.position) {
        setHoveredLine(e.target.position.lineNumber)
      }
    })

    editor.onMouseLeave(() => {
      // ✅ 400ms baad null karo — "+" pe jaane ka time mile
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredLine(null)
      }, 400)
    })
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  // Decorations update karo jab bhi comments change hon
  useEffect(() => {
    if (!editorRef.current) return

    const newDecorations = comments.map(comment => {
      const type = commentTypes.find(t => t.id === comment.type)
      return {
        range: {
          startLineNumber: comment.lineNumber,
          startColumn: 1,
          endLineNumber: comment.lineNumber,
          endColumn: 1000,
        },
        options: {
          isWholeLine: true,
          className: `review-line-${comment.type}`,
          glyphMarginClassName: `review-glyph-${comment.type}`,
          overviewRuler: {
            color: type?.lineColor || "#ffffff20",
            position: 1,
          },
        }
      }
    })

    const ids = editorRef.current.deltaDecorations(decorations, newDecorations)
    setDecorations(ids)
  }, [comments])

  const handleAddComment = (lineNumber) => {
    // ✅ Timeout clear karo jab "+" click ho
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    setActiveCommentLine(lineNumber)
    setCommentText("")
    setCommentType("good")
  }

  const handleSaveComment = () => {
    if (!commentText.trim()) return

    setComments(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        lineNumber: activeCommentLine,
        text: commentText,
        type: commentType,
      }
    ])
    setActiveCommentLine(null)
    setCommentText("")
  }

  const handleDeleteComment = (id) => {
    setComments(prev => prev.filter(c => c.id !== id))
  }

  const getLineComments = (lineNumber) => {
    return comments.filter(c => c.lineNumber === lineNumber)
  }

  const totalLines = code.split("\n").length

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Code Review</span>
          {comments.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {comments.length} comment{comments.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-3">
          {commentTypes.map(type => (
            <div key={type.id} className="flex items-center gap-1">
              <type.icon className={cn("w-3 h-3", type.color)} />
              <span className="text-[10px] text-muted-foreground">{type.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Line numbers + comment indicators */}
        <div
          className="w-8 bg-[#1e1e1e] flex flex-col shrink-0 overflow-hidden relative"
          // ✅ "+" button pe hover karne pe timeout cancel karo
          onMouseEnter={() => {
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current)
            }
          }}
          onMouseLeave={() => {
            hoverTimeoutRef.current = setTimeout(() => {
              setHoveredLine(null)
            }, 400)
          }}
        >
          {Array.from({ length: totalLines }, (_, i) => {
            const lineNum = i + 1
            const lineComments = getLineComments(lineNum)
            const isHovered = hoveredLine === lineNum

            return (
              <div
                key={lineNum}
                className="relative flex items-center justify-center"
                style={{ height: "19px" }}
              >
                {/* "+" button on hover */}
                {isHovered && lineComments.length === 0 && (
                  <button
                    onClick={() => handleAddComment(lineNum)}
                    onMouseEnter={() => {
                      // ✅ "+" pe mouse aaye toh timeout cancel karo
                      if (hoverTimeoutRef.current) {
                        clearTimeout(hoverTimeoutRef.current)
                      }
                    }}
                    className="w-4 h-4 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-transform z-10"
                  >
                    <Plus className="w-2.5 h-2.5 text-primary-foreground" />
                  </button>
                )}

                {/* Comment indicator dots */}
                {lineComments.length > 0 && (
                  <div className="flex gap-0.5">
                    {lineComments.map(c => {
                      const type = commentTypes.find(t => t.id === c.type)
                      return (
                        <div
                          key={c.id}
                          className={cn("w-2 h-2 rounded-full", type?.bg, "border", type?.border)}
                        />
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 overflow-hidden relative">
          <Editor
            height="100%"
            language={language?.toLowerCase() || "javascript"}
            value={code}
            theme="vs-dark"
            onMount={handleEditorMount}
            options={{
              readOnly: true,
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              renderLineHighlight: "all",
              padding: { top: 8 },
              automaticLayout: true,
              scrollbar: { vertical: "hidden" },
            }}
          />

          {/* Inline comment form */}
          {activeCommentLine && (
            <div
              className="absolute left-0 right-0 z-20 px-4 py-3 bg-card border-y border-border shadow-lg"
              style={{ top: `${(activeCommentLine - 1) * 19 + 8}px` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-muted-foreground">Line {activeCommentLine}:</span>
                {/* Type selector */}
                <div className="flex gap-1">
                  {commentTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setCommentType(type.id)}
                      className={cn(
                        "flex items-center gap-1 px-2 py-0.5 rounded text-[10px] border transition-all",
                        commentType === type.id
                          ? cn(type.bg, type.border, type.color)
                          : "border-border text-muted-foreground hover:border-primary/30"
                      )}
                    >
                      <type.icon className="w-3 h-3" />
                      {type.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setActiveCommentLine(null)}
                  className="ml-auto text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  autoFocus
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSaveComment()}
                  placeholder="Add your review comment..."
                  className="flex-1 bg-secondary rounded-lg px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={handleSaveComment}
                  className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comments List */}
      {comments.length > 0 && (
        <div className="border-t border-border max-h-40 overflow-y-auto shrink-0">
          <div className="p-3 space-y-2">
            {comments.map(comment => {
              const type = commentTypes.find(t => t.id === comment.type)
              return (
                <div
                  key={comment.id}
                  className={cn(
                    "flex items-start gap-2 p-2 rounded-lg border text-xs",
                    type?.bg, type?.border
                  )}
                >
                  <type.icon className={cn("w-3.5 h-3.5 shrink-0 mt-0.5", type?.color)} />
                  <div className="flex-1 min-w-0">
                    <span className="text-muted-foreground">Line {comment.lineNumber}: </span>
                    <span className="text-foreground">{comment.text}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Custom styles for line highlights */}
      <style jsx global>{`
        .review-line-good { background-color: #22c55e15 !important; }
        .review-line-improve { background-color: #eab30815 !important; }
        .review-line-wrong { background-color: #f8717115 !important; }
      `}</style>
    </div>
  )
}