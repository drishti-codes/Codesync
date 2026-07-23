"use client"

import { useState, useRef, useEffect } from "react"
import { Send, MoreVertical, Crown, UserMinus, Clock, LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function CollabPanel({ users, currentUserId, messages = [], onSendMessage }) {
  const [activeTab, setActiveTab] = useState("chat")
  const [message, setMessage] = useState("")
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!message.trim()) return
    onSendMessage?.(message)
    setMessage("")
  }

  const tabs = [
    { id: "chat", label: "Chat" },
    { id: "users", label: `Users (${users.length})` },
    { id: "activity", label: "Activity" },
  ]

  // ✅ Activity — messages mein se system messages filter karo
  const activityMessages = messages.filter(m => m.system)

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

        {/* ✅ Chat Tab — real messages */}
        {activeTab === "chat" && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <p className="text-xs text-muted-foreground text-center mt-4">
                  No messages yet. Start the conversation!
                </p>
              )}
              {messages.map((msg) => {
                if (msg.system) {
                  return (
                    <div key={msg.id} className="flex items-center justify-center">
                      <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                        {msg.text}
                      </span>
                    </div>
                  )
                }

                const isOwnMessage = msg.userId === currentUserId
                const bubbleColor = msg.userColor || "#60a5fa"

                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-2 max-w-[85%]",
                      isOwnMessage ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    {/* Avatar */}
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-primary-foreground shrink-0"
                      style={{ backgroundColor: bubbleColor }}
                    >
                      {msg.userName?.charAt(0).toUpperCase()}
                    </div>

                    {/* Bubble */}
                    <div className={cn("min-w-0", isOwnMessage ? "items-end" : "items-start", "flex flex-col")}>
                      <div
                        className={cn(
                          "flex items-baseline gap-2",
                          isOwnMessage && "flex-row-reverse"
                        )}
                      >
                        <span className="font-medium text-foreground text-xs">
                          {isOwnMessage ? "You" : msg.userName}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {msg.timestamp}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "mt-1 px-3 py-1.5 rounded-2xl text-sm break-words",
                          isOwnMessage
                            ? "rounded-tr-sm text-white"
                            : "rounded-tl-sm text-foreground bg-secondary"
                        )}
                        style={isOwnMessage ? { backgroundColor: bubbleColor } : undefined}
                      >
                        {msg.content}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={chatEndRef} />
            </div>

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

        {/* ✅ Users Tab — real users */}
        {activeTab === "users" && (
          <div className="p-4 space-y-2">
            {users.length === 0 && (
              <p className="text-xs text-muted-foreground text-center mt-4">
                No users in room yet
              </p>
            )}
            {users.map((user) => (
              <div
                key={user.id || user._id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium text-primary-foreground"
                      style={{ backgroundColor: user.color || "#60a5fa" }}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground text-sm">
                        {user.name}
                      </span>
                      {(user.id === currentUserId || user._id === currentUserId) && (
                        <span className="text-xs text-primary">(you)</span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">Online</span>
                  </div>
                </div>
                {user.id !== currentUserId && user._id !== currentUserId && (
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

        {/* ✅ Activity Tab — real join/leave events */}
        {activeTab === "activity" && (
          <div className="p-4 space-y-3">
            {activityMessages.length === 0 && (
              <p className="text-xs text-muted-foreground text-center mt-4">
                No activity yet
              </p>
            )}
            {activityMessages.map((activity) => {
              const isJoin = activity.text?.includes("joined")
              const Icon = isJoin ? LogIn : LogOut

              return (
                <div key={activity.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary/10">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">{activity.text}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {activity.time}
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