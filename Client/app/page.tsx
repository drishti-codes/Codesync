"use client"

import { useState, useCallback } from "react"
import { AuthPage } from "@/components/auth-page"
import { Sidebar } from "@/components/sidebar"
import { TopNavbar } from "@/components/top-navbar"
import { DashboardContent } from "@/components/dashboard-content"
import { CreateRoomModal } from "@/components/create-room-modal"
import { EditorPage } from "@/components/editor/editor-page"
import { ProfilePage } from "@/components/profile-page"
import { SettingsPage } from "@/components/settings-page"
import { RoomsPage } from "@/components/rooms-page"

type View = "auth" | "dashboard" | "editor"
type Tab = "dashboard" | "rooms" | "history" | "settings" | "profile"

interface RoomData {
  id: string
  name: string
  language: string
}

export default function Home() {
  const [view, setView] = useState<View>("auth")
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [currentRoom, setCurrentRoom] = useState<RoomData | null>(null)
  const userName = "Arjun"

  const handleLogin = useCallback(() => {
    setView("dashboard")
  }, [])

  const handleLogout = useCallback(() => {
    setView("auth")
    setActiveTab("dashboard")
    setCurrentRoom(null)
  }, [])

  const handleJoinRoom = useCallback((roomId: string) => {
    // Mock room data - in real app, this would come from API
    setCurrentRoom({
      id: roomId,
      name: "Algorithm Practice",
      language: "JavaScript",
    })
    setView("editor")
  }, [])

  const handleCreateRoom = useCallback((roomData: { name: string; language: string }) => {
    const newRoom = {
      id: Date.now().toString(),
      name: roomData.name,
      language: roomData.language,
    }
    setCurrentRoom(newRoom)
    setShowCreateModal(false)
    setView("editor")
  }, [])

  const handleLeaveRoom = useCallback(() => {
    setCurrentRoom(null)
    setView("dashboard")
  }, [])

  // Auth view
  if (view === "auth") {
    return <AuthPage onLogin={handleLogin} />
  }

  // Editor view
  if (view === "editor" && currentRoom) {
    return (
      <EditorPage
        roomId={currentRoom.id}
        roomName={currentRoom.name}
        language={currentRoom.language}
        onLeave={handleLeaveRoom}
      />
    )
  }

  // Dashboard view with sidebar
  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as Tab)}
        onLogout={handleLogout}
      />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <TopNavbar
          userName={userName}
          showJoinRoom={activeTab === "dashboard"}
          onCreateRoom={() => setShowCreateModal(true)}
          onProfileClick={() => setActiveTab("profile")}
          onSettingsClick={() => setActiveTab("settings")}
          onJoinRoom={handleJoinRoom}
        />
        
        {/* Page content */}
        {activeTab === "dashboard" ? (
          <DashboardContent
            userName={userName}
            onJoinRoom={handleJoinRoom}
            onViewAllRooms={() => setActiveTab("rooms")}
          />
        ) : activeTab === "rooms" ? (
          <RoomsPage onJoinRoom={handleJoinRoom} />
        ) : activeTab === "history" ? (
          <RoomsPage onJoinRoom={handleJoinRoom} />
        ) : activeTab === "profile" ? (
          <ProfilePage userName={userName} />
        ) : activeTab === "settings" ? (
          <SettingsPage />
        ) : null}
      </div>
      
      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateRoom}
      />
    </div>
  )
}
