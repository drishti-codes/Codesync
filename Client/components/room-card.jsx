"use client"

import { Users, Clock, ArrowRight, Code2, Trophy, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const languageColors = {
  javascript: "bg-warning/20 text-warning",
  python: "bg-cursor-blue/20 text-cursor-blue",
  java: "bg-cursor-orange/20 text-cursor-orange",
  cpp: "bg-primary/20 text-primary",
  typescript: "bg-cursor-blue/20 text-cursor-blue",
  rust: "bg-cursor-orange/20 text-cursor-orange",
  go: "bg-cursor-blue/20 text-cursor-blue",
}

export function RoomCard({ room, onJoin }) {
  const langColor =
    languageColors[room.language?.toLowerCase()] ||
    "bg-muted text-muted-foreground"

  const isInterview = room.type === "interview"

  return (
    <div className={cn(
      "bg-card border rounded-xl p-5 hover:border-primary/30 transition-all group",
      isInterview
        ? "border-blue-500/20 hover:border-blue-500/40"
        : "border-border"
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            isInterview ? "bg-blue-500/10" : "bg-secondary"
          )}>
            {isInterview
              ? <Trophy className="w-5 h-5 text-blue-400" />
              : <Code2 className="w-5 h-5 text-primary" />
            }
          </div>

          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {room.name}
            </h3>

            <div className="flex items-center gap-1.5 mt-0.5">
              {!isInterview && room.language && (
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${langColor}`}>
                  {room.language}
                </span>
              )}
              {isInterview && (
                <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400">
                  Mock Interview
                </span>
              )}
            </div>
          </div>
        </div>

        {room.isLive ? (
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-live" />
            Live
          </span>
        ) : (
          <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
            Saved
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          <span>{room.usersOnline} online</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{room.lastActive}</span>
        </div>
      </div>

      <Button
        onClick={() => onJoin(room)}
        variant="outline"
        className={cn(
          "w-full border-border transition-all group/btn",
          isInterview
            ? "hover:bg-blue-500 hover:text-white hover:border-blue-500"
            : "hover:bg-primary hover:text-primary-foreground hover:border-primary"
        )}
      >
        {isInterview ? "Start Interview" : "Join Room"}
        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
      </Button>
    </div>
  )
}

export function RecentRooms({ rooms, onJoinRoom, onViewAll, onCreateRoom }) {
  const displayedRooms = rooms.slice(0, 6)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Recent Rooms
        </h2>
        <button
          onClick={onViewAll}
          className="text-sm text-primary hover:underline"
        >
          View all
        </button>
      </div>

      {/* ✅ Empty state */}
      {displayedRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-xl">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Code2 className="w-8 h-8 text-muted-foreground/30" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No rooms yet
          </h3>
          <p className="text-sm text-muted-foreground mb-5">
            Create a room to start collaborating with your team
          </p>
          <button
            onClick={onCreateRoom}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Your First Room
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onJoin={onJoinRoom}
            />
          ))}
        </div>
      )}
    </div>
  )
}