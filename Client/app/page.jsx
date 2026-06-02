"use client"

import { useState, useCallback } from "react"
import { AuthPage } from "@/components/auth-page"
import { Sidebar } from "@/components/sidebar"
import { TopNavbar } from "@/components/top-navbar"
import { DashboardContent } from "@/components/dashboard-content"
import { CreateRoomModal } from "@/components/create-room-modal"
import { EditorPage } from "@/components/editor/editor-page"
import { InterviewEditorPage } from "@/components/editor/interview-editor-page"
import { ProfilePage } from "@/components/profile-page"
import { SettingsPage } from "@/components/settings-page"
import { RoomsPage } from "@/components/rooms-page"

export default function Home() {
  const [view, setView] = useState("auth")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [currentRoom, setCurrentRoom] = useState(null)

  const userName = "Arjun"

  const handleLogin = useCallback(() => {
    setView("dashboard")
  }, [])

  const handleLogout = useCallback(() => {
    setView("auth")
    setActiveTab("dashboard")
    setCurrentRoom(null)
  }, [])

  const handleJoinRoom = useCallback((roomId) => {
    setCurrentRoom({
      id: roomId,
      name: "Algorithm Practice",
      language: "JavaScript",
      type: "collaboration", // default
    })
    setView("editor")
  }, [])

  const handleCreateRoom = useCallback((roomData) => {
    const newRoom = {
      id: Date.now().toString(),
      name: roomData.name,
      language: roomData.language || "JavaScript",
      type: roomData.type, // "collaboration" ya "interview"
    }

    setCurrentRoom(newRoom)
    setShowCreateModal(false)

    // ✅ Type ke hisaab se alag view
    if (roomData.type === "interview") {
      setView("interview")
    } else {
      setView("editor")
    }
  }, [])

  const handleLeaveRoom = useCallback(() => {
    setCurrentRoom(null)
    setView("dashboard")
  }, [])

  // Auth view
  if (view === "auth") {
    return <AuthPage onLogin={handleLogin} />
  }

  // Collaborative Editor view
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

  // ✅ Interview Editor view
  if (view === "interview" && currentRoom) {
    return (
      <InterviewEditorPage
        roomId={currentRoom.id}
        roomName={currentRoom.name}
        role="interviewer"
        onEnd={handleLeaveRoom}
      />
    )
  }

  // Dashboard view
  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
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