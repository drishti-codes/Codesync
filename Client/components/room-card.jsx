"use client"

import { Users, Clock, ArrowRight, Code2 } from "lucide-react"

import { Button } from "@/components/ui/button"

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
    languageColors[room.language.toLowerCase()] ||
    "bg-muted text-muted-foreground"

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <Code2 className="w-5 h-5 text-primary" />
          </div>

          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {room.name}
            </h3>

            <span
              className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${langColor}`}
            >
              {room.language}
            </span>
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
        onClick={() => onJoin(room.id)}
        variant="outline"
        className="w-full border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all group/btn"
      >
        Join Room

        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
      </Button>
    </div>
  )
}

export function RecentRooms({
  rooms,
  onJoinRoom,
  onViewAll,
}) {
  // Limit to 6 rooms for dashboard
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedRooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onJoin={onJoinRoom}
          />
        ))}
      </div>
    </div>
  )
}