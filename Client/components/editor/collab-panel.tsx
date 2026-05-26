"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Smile, MoreVertical, Crown, UserMinus, Clock, FileCode, LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface User {
  id: string
  name: string
  color: string
  isAdmin?: boolean
  isOnline?: boolean
}

interface Message {
  id: string
  userId: string
  userName: string
  userColor: string
  content: string
  timestamp: string
}

interface Activity {
  id: string
  type: "edit" | "join" | "leave" | "file"
  userName: string
  userColor: string
  content: string
  timestamp: string
}

interface CollabPanelProps {
  users: User[]
  currentUserId: string
}

const mockMessages: Message[] = [
  {
    id: "1",
    userId: "1",
    userName: "Arjun",
    userColor: "#e85d75",
    content: "Hey team, I just pushed the fix for the sorting algorithm",
    timestamp: "2:34 PM",
  },
  {
    id: "2",
    userId: "2",
    userName: "Sarah",
    userColor: "#60a5fa",
    content: "Great! Let me test it out",
    timestamp: "2:35 PM",
  },
  {
    id: "3",
    userId: "3",
    userName: "Mike",
    userColor: "#34d399",
    content: "The edge case on line 45 still needs work",
    timestamp: "2:36 PM",
  },
  {
    id: "4",
    userId: "1",
    userName: "Arjun",
    userColor: "#e85d75",
    content: "On it!",
    timestamp: "2:37 PM",
  },
]

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "edit",
    userName: "Arjun",
    userColor: "#e85d75",
    content: "Modified line 23-45 in index.js",
    timestamp: "2 min ago",
  },
  {
    id: "2",
    type: "join",
    userName: "Sarah",
    userColor: "#60a5fa",
    content: "Joined the room",
    timestamp: "5 min ago",
  },
  {
    id: "3",
    type: "file",
    userName: "Mike",
    userColor: "#34d399",
    content: "Created components/Header.jsx",
    timestamp: "10 min ago",
  },
  {
    id: "4",
    type: "leave",
    userName: "John",
    userColor: "#f59e0b",
    content: "Left the room",
    timestamp: "15 min ago",
  },
  {
    id: "5",
    type: "edit",
    userName: "Sarah",
    userColor: "#60a5fa",
    content: "Modified App.jsx",
    timestamp: "20 min ago",
  },
]

export function CollabPanel({ users, currentUserId }: CollabPanelProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "users" | "activity">("chat")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState(mockMessages)
  const [typingUsers, setTypingUsers] = useState<string[]>(["Sarah"])
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    
    const currentUser = users.find(u => u.id === currentUserId)
    if (!currentUser) return
    
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        userId: currentUserId,
        userName: currentUser.name,
        userColor: currentUser.color,
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ])
    setMessage("")
  }

  const tabs = [
    { id: "chat", label: "Chat" },
    { id: "users", label: `Users (${users.length})` },
    { id: "activity", label: "Activity" },
  ]

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-medium transition-colors relative",
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === "chat" && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-primary-foreground shrink-0"
                    style={{ backgroundColor: msg.userColor }}
                  >
                    {msg.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-foreground text-sm">
                        {msg.userName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {msg.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/90 mt-0.5 break-words">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            
            {/* Typing indicator */}
            {typingUsers.length > 0 && (
              <div className="px-4 py-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <span className="flex gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                  {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
                </span>
              </div>
            )}
            
            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-secondary border-border focus:border-primary"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Smile className="w-4 h-4" />
                </Button>
                <Button
                  type="submit"
                  size="icon"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </>
        )}
        
        {activeTab === "users" && (
          <div className="p-4 space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium text-primary-foreground"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    {user.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground text-sm">
                        {user.name}
                      </span>
                      {user.isAdmin && (
                        <Crown className="w-3.5 h-3.5 text-warning" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {user.isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
                {user.id !== currentUserId && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 rounded hover:bg-secondary text-muted-foreground">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuItem className="cursor-pointer text-destructive">
                        <UserMinus className="w-4 h-4 mr-2" />
                        Remove from room
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        )}
        
        {activeTab === "activity" && (
          <div className="p-4 space-y-3">
            {mockActivities.map((activity) => {
              const Icon = activity.type === "edit" 
                ? FileCode 
                : activity.type === "join"
                ? LogIn
                : activity.type === "leave"
                ? LogOut
                : FileCode

              return (
                <div key={activity.id} className="flex gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${activity.userColor}20` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: activity.userColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium text-foreground">{activity.userName}</span>{" "}
                      <span className="text-muted-foreground">{activity.content}</span>
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {activity.timestamp}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
