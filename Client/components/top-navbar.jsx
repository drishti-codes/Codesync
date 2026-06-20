"use client"

import { useState } from "react"
import { Bell, ChevronDown, Plus, LogIn } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function TopNavbar({
  userName,
  showJoinRoom = false,
  onCreateRoom,
  onProfileClick,
  onSettingsClick,
  onJoinRoom,
  onLogout,
}) {
  const [joinInput, setJoinInput] = useState("")

  const handleJoin = () => {
    if (joinInput.trim()) {
      const roomId = joinInput.includes("/")
        ? joinInput.split("/").pop() || joinInput
        : joinInput

      onJoinRoom(roomId.trim())
      setJoinInput("")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleJoin()
    }
  }

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      {/* Join Room */}
      {showJoinRoom ? (
        <div className="flex-1 max-w-md">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Paste room link or ID to join..."
              value={joinInput}
              onChange={(e) => setJoinInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-secondary border-border focus:border-primary"
            />

            <Button
              onClick={handleJoin}
              disabled={!joinInput.trim()}
              variant="outline"
              className="border-border hover:bg-primary hover:text-primary-foreground hover:border-primary shrink-0"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Join
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button
          onClick={onCreateRoom}
          className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Room
        </Button>

        <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-cursor-blue flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>

              <span className="text-sm font-medium text-foreground hidden sm:block">
                {userName}
              </span>

              <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48 bg-card border-border">
            <DropdownMenuItem onClick={onProfileClick} className="cursor-pointer">
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer">
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={onLogout} className="text-destructive cursor-pointer">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}