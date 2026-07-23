"use client"

import { useState, useCallback, useEffect } from "react"
import { AuthPage } from "@/components/auth-page"
import { Sidebar } from "@/components/sidebar"
import { TopNavbar } from "@/components/top-navbar"
import { DashboardContent } from "@/components/dashboard-content"
import { CreateRoomModal } from "@/components/create-room-modal"
import { EditorPage } from "@/components/editor/editor-page"
import { InterviewEditorPage } from "@/components/editor/interview-editor-page"
import { FeedbackPage } from "@/components/feedback/feedback-page"
import { ProfilePage } from "@/components/profile-page"
import { SettingsPage } from "@/components/settings-page"
import { RoomsPage } from "@/components/rooms-page"
import { createRoom, getRoom, joinRoom } from "@/lib/api"

export default function Home() {
  const [view, setView] = useState("auth")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [currentRoom, setCurrentRoom] = useState(null)
  const [user, setUser] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")

    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
      setView("dashboard")
    }
    setCheckingAuth(false)
  }, [])

  const userName = user?.name || "Arjun"

  const handleLogin = useCallback((userData) => {
    setUser(userData)
    setView("dashboard")
  }, [])

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setView("auth")
    setActiveTab("dashboard")
    setCurrentRoom(null)
  }, [])

  // ✅ FIXED: sirf roomId (string) milne par backend se real room fetch karta hai
  // aur backend mein participant ke roop mein register bhi karta hai
  const handleJoinRoom = useCallback(async (room) => {
    if (typeof room === "object") {
      setCurrentRoom(room)
      if (room.type === "interview") {
        setView("interview")
      } else {
        setView("editor")
      }
      return
    }

    // room yahan sirf ek roomId string hai (link se join kiya gaya)
    try {
      const { room: roomData } = await getRoom(room)

      // ✅ Backend mein user ko participant/candidate ke roop mein register karo
      await joinRoom(room)

      const mappedRoom = {
        id: roomData._id,
        name: roomData.name,
        language: roomData.language,
        type: roomData.type,
      }
      setCurrentRoom(mappedRoom)

      if (mappedRoom.type === "interview") {
        setView("interview")
      } else {
        setView("editor")
      }
    } catch (error) {
      console.error("Failed to join room:", error)
      alert("Failed to join room: " + error.message)
    }
  }, [])

  const handleCreateRoom = useCallback(async (roomData) => {
  try {
    const { room } = await createRoom({
      name: roomData.name,
      type: roomData.type,
      language: roomData.language || "JavaScript",
      isPublic: roomData.isPublic,
      allowExecution: roomData.allowExecution,
    })

    setCurrentRoom({
      id: room._id,
      name: room.name,
      language: room.language,
      type: room.type,
    })
    setShowCreateModal(false)

    if (room.type === "interview") {
      setView("interview")
    } else {
      setView("editor")
    }
  } catch (error) {
    console.error("Room creation failed:", error)
    alert("Failed to create room: " + error.message)
  }
}, [])

  const handleLeaveRoom = useCallback(() => {
    if (currentRoom?.type === "interview") {
      setView("feedback")
    } else {
      setCurrentRoom(null)
      setView("dashboard")
    }
  }, [currentRoom])

  const handleFeedbackBack = useCallback(() => {
    setCurrentRoom(null)
    setView("dashboard")
  }, [])

  if (checkingAuth) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (view === "auth") {
    return <AuthPage onLogin={handleLogin} />
  }

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

  if (view === "feedback" && currentRoom) {
    return (
      <FeedbackPage
        roomId={currentRoom.id}
        roomName={currentRoom.name}
        role="interviewer"
        onBack={handleFeedbackBack}
      />
    )
  }

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
          onLogout={handleLogout}
        />

        {/* Page content */}
        {activeTab === "dashboard" ? (
          <DashboardContent
            userName={userName}
            onJoinRoom={handleJoinRoom}
            onViewAllRooms={() => setActiveTab("rooms")}
            onCreateRoom={() => setShowCreateModal(true)}
          />
        ) : activeTab === "rooms" ? (
          <RoomsPage
            onJoinRoom={handleJoinRoom}
            filterType="collaboration"
          />
        ) : activeTab === "interviews" ? (
          <RoomsPage
            onJoinRoom={handleJoinRoom}
            filterType="interview"
          />
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