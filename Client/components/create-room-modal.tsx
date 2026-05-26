"use client"

import { useState } from "react"
import { X, Globe, Lock, Play, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface CreateRoomModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (roomData: { name: string; language: string; isPublic: boolean; allowExecution: boolean }) => void
}

const languages = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "Go",
  "Rust",
  "Ruby",
  "PHP",
  "C#",
]

export function CreateRoomModal({ isOpen, onClose, onCreate }: CreateRoomModalProps) {
  const [roomName, setRoomName] = useState("")
  const [language, setLanguage] = useState("JavaScript")
  const [isPublic, setIsPublic] = useState(true)
  const [allowExecution, setAllowExecution] = useState(true)
  const [inviteEmail, setInviteEmail] = useState("")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreate({ name: roomName, language, isPublic, allowExecution })
    setRoomName("")
    setLanguage("JavaScript")
    setIsPublic(true)
    setAllowExecution(true)
    setInviteEmail("")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 glass rounded-2xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Create New Room</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Room Name */}
          <div className="space-y-2">
            <Label htmlFor="roomName" className="text-foreground">Room Name</Label>
            <Input
              id="roomName"
              placeholder="e.g., Algorithm Practice"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="bg-secondary border-border focus:border-primary"
              required
            />
          </div>
          
          {/* Language */}
          <div className="space-y-2">
            <Label className="text-foreground">Programming Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="bg-secondary border-border focus:border-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Visibility Toggle */}
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div className="flex items-center gap-3">
              {isPublic ? (
                <Globe className="w-5 h-5 text-primary" />
              ) : (
                <Lock className="w-5 h-5 text-warning" />
              )}
              <div>
                <p className="font-medium text-foreground">
                  {isPublic ? "Public Room" : "Private Room"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isPublic ? "Anyone with link can join" : "Invite only access"}
                </p>
              </div>
            </div>
            <Switch
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>
          
          {/* Code Execution Toggle */}
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div className="flex items-center gap-3">
              <Play className={`w-5 h-5 ${allowExecution ? "text-success" : "text-muted-foreground"}`} />
              <div>
                <p className="font-medium text-foreground">Code Execution</p>
                <p className="text-sm text-muted-foreground">
                  Allow running code with Judge0 API
                </p>
              </div>
            </div>
            <Switch
              checked={allowExecution}
              onCheckedChange={setAllowExecution}
            />
          </div>
          
          {/* Invite Members */}
          <div className="space-y-2">
            <Label htmlFor="invite" className="text-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Invite Members (optional)
            </Label>
            <Input
              id="invite"
              type="email"
              placeholder="Enter email addresses"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="bg-secondary border-border focus:border-primary"
            />
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border hover:bg-secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
            >
              Create Room
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
