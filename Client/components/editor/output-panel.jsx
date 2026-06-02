"use client"

import { useState } from "react"
import { 
  ChevronUp, 
  ChevronDown, 
  Terminal as TerminalIcon, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  Cpu,
  X,
  Play
} from "lucide-react"
import { cn } from "@/lib/utils"

export function OutputPanel({ output, errors, runtime, memory, isRunning, onRun }) {
  const [activeTab, setActiveTab] = useState("output")
  const [isExpanded, setIsExpanded] = useState(true)
  const [stdinValue, setStdinValue] = useState("")

  const tabs = [
    { id: "output", label: "Output", count: output ? 1 : 0 },
    { id: "errors", label: "Errors", count: errors.length },
    { id: "terminal", label: "Terminal", count: 0 },
    { id: "stdin", label: "Stdin", count: 0 },
  ]

  return (
    <div className={cn(
      "bg-card border-t border-border transition-all duration-300",
      isExpanded ? "h-48" : "h-10"
    )}>
      {/* Header */}
      <div className="h-10 px-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          {/* Run Button */}
          <button
            onClick={onRun}
            disabled={isRunning}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
              isRunning 
                ? "bg-success/20 text-success cursor-wait" 
                : "bg-success text-success-foreground hover:bg-success/90 glow-success"
            )}
          >
            <Play className={cn("w-4 h-4", isRunning && "animate-pulse")} />
            {isRunning ? "Running..." : "Run Code"}
          </button>

          <div className="h-5 w-px bg-border mx-2" />

          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setIsExpanded(true)
              }}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5",
                activeTab === tab.id && isExpanded
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.id === "errors" && tab.count > 0 ? (
                <AlertCircle className="w-3 h-3 text-destructive" />
              ) : tab.id === "output" && output ? (
                <CheckCircle2 className="w-3 h-3 text-success" />
              ) : null}
              {tab.label}
              {tab.count > 0 && (
                <span className={cn(
                  "px-1.5 py-0.5 rounded text-[10px]",
                  tab.id === "errors" ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Stats */}
          {(runtime || memory) && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {runtime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{runtime}</span>
                </div>
              )}
              {memory && (
                <div className="flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  <span>{memory}</span>
                </div>
              )}
            </div>
          )}

          {/* Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="h-[calc(100%-40px)] overflow-auto">
          {activeTab === "output" && (
            <div className="p-4 font-mono text-sm">
              {isRunning ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Running code...
                </div>
              ) : output ? (
                <pre className="text-success whitespace-pre-wrap">{output}</pre>
              ) : (
                <span className="text-muted-foreground">Run your code to see output here</span>
              )}
            </div>
          )}

          {activeTab === "errors" && (
            <div className="p-4 font-mono text-sm space-y-2">
              {errors.length > 0 ? (
                errors.map((error, i) => (
                  <div key={i} className="flex items-start gap-2 text-destructive">
                    <X className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                ))
              ) : (
                <span className="text-muted-foreground">No errors</span>
              )}
            </div>
          )}

          {activeTab === "terminal" && (
            <div className="p-4 font-mono text-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <TerminalIcon className="w-4 h-4" />
                <span>Terminal</span>
              </div>
              <div className="text-foreground">
                <span className="text-success">$</span>{" "}
                <span className="text-muted-foreground">Ready for input...</span>
              </div>
            </div>
          )}

          {activeTab === "stdin" && (
            <div className="p-4">
              <textarea
                value={stdinValue}
                onChange={(e) => setStdinValue(e.target.value)}
                placeholder="Enter input for your program..."
                className="w-full h-24 bg-secondary border border-border rounded-lg p-3 text-sm font-mono text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}