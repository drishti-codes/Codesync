"use client"

import { useState } from "react"
import { X, Globe, Lock, Play, Users, Code2, Trophy } from "lucide-react"
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
import { cn } from "@/lib/utils"

// ✅ Backend ke languageMap se match karte hue 12 languages
const languages = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C",
  "Go",
  "Rust",
  "Ruby",
  "PHP",
  "C#",
  "Kotlin",
]

export function CreateRoomModal({ isOpen, onClose, onCreate }) {
  const [roomName, setRoomName] = useState("")
  const [roomType, setRoomType] = useState("collaboration")
  const [language, setLanguage] = useState("JavaScript")
  const [isPublic, setIsPublic] = useState(true)
  const [allowExecution, setAllowExecution] = useState(true)
  const [inviteEmail, setInviteEmail] = useState("")

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()

    onCreate({
      name: roomName,
      type: roomType,
      language,
      isPublic,
      allowExecution,
    })

    setRoomName("")
    setRoomType("collaboration")
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
          <h2 className="text-xl font-bold text-foreground">
            Create New Room
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Room Type Toggle */}
          <div className="space-y-2">
            <Label className="text-foreground">Room Type</Label>
            <div className="grid grid-cols-2 gap-3">
              {/* Collaboration Option */}
              <button
                type="button"
                onClick={() => setRoomType("collaboration")}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                  roomType === "collaboration"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary text-muted-foreground hover:border-primary/50"
                )}
              >
                <Code2 className="w-6 h-6" />
                <span className="text-sm font-medium">Collaboration</span>
                <span className="text-xs text-center opacity-70">
                  Code together as a team
                </span>
              </button>

              {/* Interview Option */}
              <button
                type="button"
                onClick={() => setRoomType("interview")}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                  roomType === "interview"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary text-muted-foreground hover:border-primary/50"
                )}
              >
                <Trophy className="w-6 h-6" />
                <span className="text-sm font-medium">Mock Interview</span>
                <span className="text-xs text-center opacity-70">
                  Practice with a friend
                </span>
              </button>
            </div>
          </div>

          {/* Room Name */}
          <div className="space-y-2">
            <Label htmlFor="roomName" className="text-foreground">
              Room Name
            </Label>
            <Input
              id="roomName"
              placeholder={
                roomType === "collaboration"
                  ? "e.g., Algorithm Practice"
                  : "e.g., DSA Interview Round"
              }
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="bg-secondary border-border focus:border-primary"
              required
            />
          </div>

          {/* Language — only for Collaboration */}
          {roomType === "collaboration" && (
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
          )}

          {/* Interview info box */}
          {roomType === "interview" && (
            <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg text-sm text-primary space-y-1">
              <p className="font-medium">How it works:</p>
              <ul className="text-xs space-y-1 text-primary/80 list-disc list-inside">
                <li>You become the Interviewer</li>
                <li>Share link with your friend (Candidate)</li>
                <li>Choose a problem and start timer</li>
                <li>Give feedback at the end</li>
              </ul>
            </div>
          )}

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
                  {isPublic
                    ? "Anyone with link can join"
                    : "Invite only access"}
                </p>
              </div>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>

          {/* Code Execution Toggle — only for Collaboration */}
          {roomType === "collaboration" && (
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div className="flex items-center gap-3">
                <Play
                  className={`w-5 h-5 ${
                    allowExecution ? "text-success" : "text-muted-foreground"
                  }`}
                />
                <div>
                  <p className="font-medium text-foreground">Code Execution</p>
                  <p className="text-sm text-muted-foreground">
                    Allow running code with Glot.io API
                  </p>
                </div>
              </div>
              <Switch
                checked={allowExecution}
                onCheckedChange={setAllowExecution}
              />
            </div>
          )}

          {/* Invite Members */}
          <div className="space-y-2">
            <Label
              htmlFor="invite"
              className="text-foreground flex items-center gap-2"
            >
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
              {roomType === "interview" ? "Start Interview Room" : "Create Room"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}