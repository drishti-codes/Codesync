"use client"

import { useState, useEffect } from "react"
import { X, RotateCcw, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Version {
  id: string
  timestamp: string
  userName: string
  userColor: string
  description: string
  linesChanged: number
}

interface VersionHistoryProps {
  isOpen: boolean
  onClose: () => void
  onRestore: (versionId: string) => void
}

const mockVersions: Version[] = [
  {
    id: "v6",
    timestamp: "Just now",
    userName: "You",
    userColor: "#e85d75",
    description: "Added fibonacci function",
    linesChanged: 12,
  },
  {
    id: "v5",
    timestamp: "5 min ago",
    userName: "Sarah",
    userColor: "#60a5fa",
    description: "Fixed edge case in sorting",
    linesChanged: 3,
  },
  {
    id: "v4",
    timestamp: "15 min ago",
    userName: "Mike",
    userColor: "#34d399",
    description: "Refactored main function",
    linesChanged: 28,
  },
  {
    id: "v3",
    timestamp: "1 hour ago",
    userName: "Arjun",
    userColor: "#e85d75",
    description: "Initial algorithm implementation",
    linesChanged: 45,
  },
  {
    id: "v2",
    timestamp: "2 hours ago",
    userName: "Sarah",
    userColor: "#60a5fa",
    description: "Added test cases",
    linesChanged: 20,
  },
  {
    id: "v1",
    timestamp: "3 hours ago",
    userName: "Mike",
    userColor: "#34d399",
    description: "Project setup",
    linesChanged: 10,
  },
]

export function VersionHistory({ isOpen, onClose, onRestore }: VersionHistoryProps) {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-96 bg-card border-l border-border z-50 transform transition-transform duration-300",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Version History</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Timeline */}
        <div className="p-4 h-[calc(100%-56px)] overflow-y-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
            
            <div className="space-y-4">
              {mockVersions.map((version, index) => (
                <div
                  key={version.id}
                  className={cn(
                    "relative pl-10 cursor-pointer group",
                    selectedVersion === version.id && "opacity-100",
                    selectedVersion && selectedVersion !== version.id && "opacity-60"
                  )}
                  onClick={() => setSelectedVersion(
                    selectedVersion === version.id ? null : version.id
                  )}
                >
                  {/* Timeline dot */}
                  <div 
                    className={cn(
                      "absolute left-2.5 top-2 w-3 h-3 rounded-full border-2 border-card transition-all",
                      index === 0 ? "bg-success" : "bg-border group-hover:bg-primary"
                    )}
                    style={index === 0 ? {} : { backgroundColor: selectedVersion === version.id ? version.userColor : undefined }}
                  />
                  
                  <div className={cn(
                    "p-4 rounded-xl border transition-all",
                    selectedVersion === version.id 
                      ? "bg-secondary border-primary/50" 
                      : "bg-card border-border hover:border-primary/30"
                  )}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-primary-foreground"
                          style={{ backgroundColor: version.userColor }}
                        >
                          {version.userName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {version.userName}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {version.timestamp}
                      </span>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm text-foreground mb-2">
                      {version.description}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="text-success">+{Math.floor(version.linesChanged * 0.7)} lines</span>
                      <span className="text-destructive">-{Math.floor(version.linesChanged * 0.3)} lines</span>
                    </div>
                    
                    {/* Restore button */}
                    {selectedVersion === version.id && index !== 0 && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onRestore(version.id)
                        }}
                        className="mt-3 w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Restore this version
                      </Button>
                    )}
                    
                    {index === 0 && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-success">
                        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-live" />
                        Current version
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
