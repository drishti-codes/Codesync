"use client"

import { useState, useMemo } from "react"
import { ChevronDown } from "lucide-react"
import { RoomCard, Room } from "./room-card"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface RoomsPageProps {
  onJoinRoom: (roomId: string) => void
}

const allRooms: Room[] = [
  {
    id: "1",
    name: "Algorithm Practice",
    language: "Python",
    usersOnline: 3,
    lastActive: "2 min ago",
    isLive: true,
  },
  {
    id: "2",
    name: "React Project",
    language: "TypeScript",
    usersOnline: 5,
    lastActive: "5 min ago",
    isLive: true,
  },
  {
    id: "3",
    name: "Data Structures",
    language: "Java",
    usersOnline: 0,
    lastActive: "2 hours ago",
    isLive: false,
  },
  {
    id: "4",
    name: "System Design",
    language: "JavaScript",
    usersOnline: 2,
    lastActive: "1 hour ago",
    isLive: true,
  },
  {
    id: "5",
    name: "Competitive Coding",
    language: "C++",
    usersOnline: 0,
    lastActive: "1 day ago",
    isLive: false,
  },
  {
    id: "6",
    name: "Backend API",
    language: "Go",
    usersOnline: 1,
    lastActive: "30 min ago",
    isLive: true,
  },
  {
    id: "7",
    name: "Machine Learning",
    language: "Python",
    usersOnline: 0,
    lastActive: "3 days ago",
    isLive: false,
  },
  {
    id: "8",
    name: "Frontend Workshop",
    language: "TypeScript",
    usersOnline: 4,
    lastActive: "10 min ago",
    isLive: true,
  },
  {
    id: "9",
    name: "Database Design",
    language: "JavaScript",
    usersOnline: 0,
    lastActive: "1 week ago",
    isLive: false,
  },
  {
    id: "10",
    name: "Code Review",
    language: "Java",
    usersOnline: 2,
    lastActive: "15 min ago",
    isLive: true,
  },
]

type StatusFilter = "all" | "live" | "saved"

const languages = ["All Languages", "JavaScript", "Python", "C++", "Java", "TypeScript", "Go"]

export function RoomsPage({ onJoinRoom }: RoomsPageProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [languageFilter, setLanguageFilter] = useState("All Languages")

  const filteredRooms = useMemo(() => {
    return allRooms.filter((room) => {
      // Status filter
      if (statusFilter === "live" && !room.isLive) return false
      if (statusFilter === "saved" && room.isLive) return false

      // Language filter
      if (languageFilter !== "All Languages" && room.language !== languageFilter) return false

      return true
    })
  }, [statusFilter, languageFilter])

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">All Rooms</h1>
        <p className="text-muted-foreground mt-1">
          Browse and join all your coding rooms
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
          {(["all", "live", "saved"] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                statusFilter === status
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              )}
            >
              {status === "all" ? "All" : status === "live" ? "Live" : "Saved"}
            </button>
          ))}
        </div>

        {/* Language Dropdown */}
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

        {/* Results count */}
        <span className="text-sm text-muted-foreground">
          {filteredRooms.length} room{filteredRooms.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} onJoin={onJoinRoom} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No rooms found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters to find more rooms
          </p>
        </div>
      )}
    </div>
  )
}
