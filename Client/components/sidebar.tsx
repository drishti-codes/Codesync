"use client"

import { 
  LayoutDashboard, 
  FolderKanban, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "rooms", label: "Rooms", icon: FolderKanban },
]

export function Sidebar({ activeTab, onTabChange, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={cn(
      "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-primary-foreground">{"</>"}</span>
          </div>
          {!collapsed && (
            <span className="text-xl font-bold text-sidebar-foreground">CodeSync</span>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-primary" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5 shrink-0", isActive && "text-primary")} />
              {!collapsed && <span className="font-medium">{item.label}</span>}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse-live" />
              )}
            </button>
          )
        })}
      </nav>
      
      {/* Collapse toggle */}
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center text-muted-foreground hover:text-foreground"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>
      
      {/* Logout */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={onLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
