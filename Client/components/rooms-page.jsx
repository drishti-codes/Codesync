"use client"

import { useState, useMemo, useEffect } from "react"
import { ChevronDown, Trophy, Code2 } from "lucide-react"
import { RoomCard } from "./room-card"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { getRooms } from "@/lib/api"

const languages = [
  "All Languages",
  "JavaScript",
  "Python",
  "C++",
  "Java",
  "TypeScript",
  "Go",
]

// ✅ Backend room ko frontend format mein convert karo
function formatRoom(room) {
  const lastActiveDate = new Date(room.updatedAt)
  const now = new Date()
  const diffMs = now - lastActiveDate
  const diffMins = Math.floor(diffMs / 60000)

  let lastActive
  if (diffMins < 1) lastActive = "Just now"
  else if (diffMins < 60) lastActive = `${diffMins} min ago`
  else if (diffMins < 1440) lastActive = `${Math.floor(diffMins / 60)} hour ago`
  else lastActive = `${Math.floor(diffMins / 1440)} day ago`

  return {
    id: room._id,
    name: room.name,
    language: room.language,
    usersOnline: 0,
    lastActive,
    isLive: true,
    type: room.type,
  }
}

export function RoomsPage({ onJoinRoom, filterType }) {
  const [statusFilter, setStatusFilter] = useState("all")
  const [languageFilter, setLanguageFilter] = useState("All Languages")
  const [allRooms, setAllRooms] = useState([])
  const [loading, setLoading] = useState(true)

  const isInterviewPage = filterType === "interview"

  // ✅ Backend se rooms fetch karo
  useEffect(() => {
    async function fetchRooms() {
      try {
        const { rooms } = await getRooms()
        setAllRooms(rooms.map(formatRoom))
      } catch (error) {
        console.error("Failed to fetch rooms:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  const filteredRooms = useMemo(() => {
    return allRooms.filter((room) => {
      if (filterType === "collaboration" && room.type !== "collaboration") return false
      if (filterType === "interview" && room.type !== "interview") return false

      if (statusFilter === "live" && !room.isLive) return false
      if (statusFilter === "saved" && room.isLive) return false

      if (
        !isInterviewPage &&
        languageFilter !== "All Languages" &&
        room.language !== languageFilter
      ) return false

      return true
    })
  }, [allRooms, statusFilter, languageFilter, filterType])

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        {isInterviewPage ? (
          <Trophy className="w-8 h-8 text-blue-400" />
        ) : (
          <Code2 className="w-8 h-8 text-primary" />
        )}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isInterviewPage ? "All Interviews" : "All Rooms"}
          </h1>
          <p className="text-muted-foreground mt-0.5">
            {isInterviewPage
              ? "Browse and join all your mock interview sessions"
              : "Browse and join all your coding rooms"}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
          {["all", "live", "saved"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                statusFilter === status
                  ? isInterviewPage
                    ? "bg-blue-500 text-white"
                    : "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              )}
            >
              {status === "all" ? "All" : status === "live" ? "Live" : "Saved"}
            </button>
          ))}
        </div>

        {/* Language Dropdown — only for collaboration */}
        {!isInterviewPage && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-border bg-secondary hover:bg-card min-w-[160px] justify-between"
              >
                {languageFilter}
                <ChevronDown className="w-4 h-4 ml-2 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[160px] bg-card border-border">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang}
                  onClick={() => setLanguageFilter(lang)}
                  className={cn(
                    "cursor-pointer",
                    languageFilter === lang && "bg-primary/10 text-primary"
                  )}
                >
                  {lang}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Results count */}
        <span className="text-sm text-muted-foreground">
          {filteredRooms.length}{" "}
          {isInterviewPage ? "interview" : "room"}
          {filteredRooms.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onJoin={onJoinRoom}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            {isInterviewPage
              ? <Trophy className="w-8 h-8 text-blue-400/30" />
              : <span className="text-2xl">🔍</span>
            }
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {isInterviewPage ? "No interviews found" : "No rooms found"}
          </h3>
          <p className="text-muted-foreground">
            {isInterviewPage
              ? "Create a mock interview room to get started"
              : "Try adjusting your filters to find more rooms"}
          </p>
        </div>
      )}
    </div>
  )
}