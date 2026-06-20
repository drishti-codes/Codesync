"use client"

import { useState, useEffect } from "react"
import { StatsCards } from "./stats-cards"
import { RecentRooms } from "./room-card"
import { getRooms } from "@/lib/api"

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

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

export function DashboardContent({
  userName,
  onJoinRoom,
  onViewAllRooms,
  onCreateRoom,
}) {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRooms() {
      try {
        const { rooms } = await getRooms()
        setRooms(rooms.map(formatRoom))
      } catch (error) {
        console.error("Failed to fetch rooms:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  // ✅ Real stats calculate karo rooms se
  const stats = {
    roomsCreated: rooms.length,
    sessionsSaved: rooms.filter(r => r.type === "collaboration").length,
    activeCollaborators: rooms.reduce((sum, r) => sum + r.usersOnline, 0),
    executionCount: 0, // baad mein backend se aayega
  }

  return (
    <div className="flex-1 overflow-auto p-6 space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {getGreeting()}, {userName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your coding sessions
        </p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 rounded-xl bg-card border border-border animate-pulse" />
          ))}
        </div>
      ) : (
        <StatsCards stats={stats} />
      )}

      {/* Recent Rooms */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <RecentRooms
          rooms={rooms}
          onJoinRoom={onJoinRoom}
          onViewAll={onViewAllRooms}
          onCreateRoom={onCreateRoom}
        />
      )}
    </div>
  )
}