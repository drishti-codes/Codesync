"use client"

import { StatsCards } from "./stats-cards"
import { RecentRooms } from "./room-card"

const mockRooms = [
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
]

const mockStats = {
  roomsCreated: 12,
  sessionsSaved: 48,
  activeCollaborators: 7,
  executionCount: 156,
}

function getGreeting() {
  const hour = new Date().getHours()

  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"

  return "Good evening"
}

export function DashboardContent({
  userName,
  onJoinRoom,
  onViewAllRooms,
}) {
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
      <StatsCards stats={mockStats} />

      {/* Recent Rooms */}
      <RecentRooms
        rooms={mockRooms}
        onJoinRoom={onJoinRoom}
        onViewAll={onViewAllRooms}
      />
    </div>
  )
}