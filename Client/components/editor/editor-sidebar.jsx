"use client"

import { useState } from "react"
import { 
  Files, 
  Search, 
  GitBranch, 
  Puzzle, 
  History,
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"

const icons = [
  { id: "explorer", icon: Files, title: "Explorer" },
  { id: "search", icon: Search, title: "Search" },
  { id: "git", icon: GitBranch, title: "Source Control" },
  { id: "extensions", icon: Puzzle, title: "Extensions" },
  { id: "history", icon: History, title: "Version History" },
]

export function EditorSidebar({ activeIcon, onIconChange }) {
  return (
    <div className="w-12 bg-[#1e1e1e] border-r border-border flex flex-col items-center py-2 gap-1">
      {/* Top icons */}
      <div className="flex flex-col items-center gap-1 flex-1">
        {icons.map(({ id, icon: Icon, title }) => (
          <button
            key={id}
            title={title}
            onClick={() => onIconChange(id)}
            className={cn(
              "p-2.5 rounded-lg transition-colors",
              activeIcon === id
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      {/* Bottom settings icon */}
      <button
        title="Settings"
        className="p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
      >
        <Settings className="w-5 h-5" />
      </button>
    </div>
  )
}