"use client"

import { 
  FolderKanban, 
  Users, 
  Play, 
  Clock,
  TrendingUp
} from "lucide-react"

interface StatsCardsProps {
  stats: {
    roomsCreated: number
    sessionsSaved: number
    activeCollaborators: number
    executionCount: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: "Rooms Created",
      value: stats.roomsCreated,
      icon: FolderKanban,
      color: "text-primary",
      bgColor: "bg-primary/10",
      trend: "+3 this week"
    },
    {
      label: "Sessions Saved",
      value: stats.sessionsSaved,
      icon: Clock,
      color: "text-cursor-blue",
      bgColor: "bg-cursor-blue/10",
      trend: "+12 this week"
    },
    {
      label: "Active Collaborators",
      value: stats.activeCollaborators,
      icon: Users,
      color: "text-success",
      bgColor: "bg-success/10",
      trend: "2 online now"
    },
    {
      label: "Code Executions",
      value: stats.executionCount,
      icon: Play,
      color: "text-cursor-orange",
      bgColor: "bg-cursor-orange/10",
      trend: "+28 today"
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-lg ${card.bgColor}`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className="flex items-center gap-1 text-xs text-success">
                <TrendingUp className="w-3 h-3" />
                <span>{card.trend}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-foreground">{card.value}</p>
              <p className="text-sm text-muted-foreground">{card.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
