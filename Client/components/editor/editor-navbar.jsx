"use client"

import { 
  Play, 
  Share2, 
  Sun, 
  Moon, 
  MoreHorizontal,
  Copy,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function EditorNavbar({
  roomName,
  users,
  isRunning,
  isDarkTheme,
  shareMessage,
  onRun,
  onShare,
  onToggleTheme,
  onLeave,
}) {
  return (
    <header className="h-12 bg-card border-b border-border px-4 flex items-center justify-between">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">{"</>"}</span>
          </div>
          <span className="font-semibold text-foreground hidden sm:block">CodeSync</span>
        </div>

        <div className="h-6 w-px bg-border" />

        {/* Room name */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{roomName}</span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-live" />
            Live
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Connected users */}
        <div className="flex items-center -space-x-2">
          {users.slice(0, 4).map((user) => (
            <div
              key={user.id}
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-primary-foreground ring-2 ring-card"
              style={{ backgroundColor: user.color }}
              title={user.name}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          ))}
          {users.length > 4 && (
            <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-foreground ring-2 ring-card">
              +{users.length - 4}
            </div>
          )}
        </div>

        {/* Share button */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className="border-border hover:bg-secondary hidden sm:flex"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          {shareMessage && (
            <div className="absolute top-full right-0 mt-2 px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-foreground whitespace-nowrap z-50 shadow-lg">
              {shareMessage}
            </div>
          )}
        </div>

        {/* Run button */}
        <Button
          size="sm"
          onClick={onRun}
          disabled={isRunning}
          className="bg-success hover:bg-success/90 text-success-foreground glow-success"
        >
          <Play className={`w-4 h-4 mr-2 ${isRunning ? "animate-pulse" : ""}`} />
          {isRunning ? "Running..." : "Run"}
        </Button>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        >
          {isDarkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* More options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            <DropdownMenuItem className="cursor-pointer">
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in New Tab
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onLeave} className="text-destructive cursor-pointer">
              Leave Room
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}