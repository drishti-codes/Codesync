"use client"

import { useState, useMemo } from "react"
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

const allRooms = [
  // ✅ Collaboration rooms
  {
    id: "1",
    name: "Algorithm Practice",
    language: "Python",
    usersOnline: 3,
    lastActive: "2 min ago",
    isLive: true,
    type: "collaboration",
  },
  {
    id: "2",
    name: "React Project",
    language: "TypeScript",
    usersOnline: 5,
    lastActive: "5 min ago",
    isLive: true,
    type: "collaboration",
  },
  {
    id: "3",
    name: "Data Structures",
    language: "Java",
    usersOnline: 0,
    lastActive: "2 hours ago",
    isLive: false,
    type: "collaboration",
  },
  {
    id: "4",
    name: "System Design",
    language: "JavaScript",
    usersOnline: 2,
    lastActive: "1 hour ago",
    isLive: true,
    type: "collaboration",
  },
  {
    id: "5",
    name: "Competitive Coding",
    language: "C++",
    usersOnline: 0,
    lastActive: "1 day ago",
    isLive: false,
    type: "collaboration",
  },
  {
    id: "6",
    name: "Backend API",
    language: "Go",
    usersOnline: 1,
    lastActive: "30 min ago",
    isLive: true,
    type: "collaboration",
  },
  {
    id: "7",
    name: "Machine Learning",
    language: "Python",
    usersOnline: 0,
    lastActive: "3 days ago",
    isLive: false,
    type: "collaboration",
  },
  {
    id: "8",
    name: "Frontend Workshop",
    language: "TypeScript",
    usersOnline: 4,
    lastActive: "10 min ago",
    isLive: true,
    type: "collaboration",
  },
  {
    id: "9",
    name: "Database Design",
    language: "JavaScript",
    usersOnline: 0,
    lastActive: "1 week ago",
    isLive: false,
    type: "collaboration",
  },
  {
    id: "10",
    name: "Code Review",
    language: "Java",
    usersOnline: 2,
    lastActive: "15 min ago",
    isLive: true,
    type: "collaboration",
  },

  // ✅ Interview rooms
  {
    id: "11",
    name: "DSA Interview Round",
    language: "JavaScript",
    usersOnline: 1,
    lastActive: "10 min ago",
    isLive: true,
    type: "interview",
  },
  {
    id: "12",
    name: "React Interview Prep",
    language: "JavaScript",
    usersOnline: 0,
    lastActive: "2 hours ago",
    isLive: false,
    type: "interview",
  },
  {
    id: "13",
    name: "System Design Round",
    language: "JavaScript",
    usersOnline: 2,
    lastActive: "30 min ago",
    isLive: true,
    type: "interview",
  },
]

const languages = [
  "All Languages",
  "JavaScript",
  "Python",
  "C++",
  "Java",
  "TypeScript",
  "Go",
]

export function RoomsPage({ onJoinRoom, filterType }) {
  const [statusFilter, setStatusFilter] = useState("all")
  const [languageFilter, setLanguageFilter] = useState("All Languages")

  const isInterviewPage = filterType === "interview"

  const filteredRooms = useMemo(() => {
    return allRooms.filter((room) => {
      // ✅ Type filter
      if (filterType === "collaboration" && room.type !== "collaboration") return false
      if (filterType === "interview" && room.type !== "interview") return false

      // Status filter
      if (statusFilter === "live" && !room.isLive) return false
      if (statusFilter === "saved" && room.isLive) return false

      // Language filter (only for collaboration)
      if (
        !isInterviewPage &&
        languageFilter !== "All Languages" &&
        room.language !== languageFilter
      ) return false

      return true
    })
  }, [statusFilter, languageFilter, filterType])

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

      {/* Rooms Grid */}
      {filteredRooms.length > 0 ? (
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