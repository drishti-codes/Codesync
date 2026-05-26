"use client"

import { useState } from "react"
import { 
  Camera, 
  Save, 
  Code2, 
  Trophy, 
  Clock, 
  Users,
  Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ProfilePageProps {
  userName: string
}

const languages = ["JavaScript", "Python", "TypeScript", "Java", "C++", "Go", "Rust"]
const achievements = [
  { id: "1", name: "First Collaboration", description: "Joined your first room", icon: Users, earned: true },
  { id: "2", name: "Code Runner", description: "Executed 100+ code snippets", icon: Code2, earned: true },
  { id: "3", name: "Night Owl", description: "Coded for 5+ hours straight", icon: Clock, earned: true },
  { id: "4", name: "Star Contributor", description: "Made 500+ edits", icon: Star, earned: false },
  { id: "5", name: "Champion", description: "Won a coding competition", icon: Trophy, earned: false },
]

const recentSessions = [
  { id: "1", name: "Algorithm Practice", language: "Python", duration: "2h 15m", date: "Today" },
  { id: "2", name: "React Project", language: "TypeScript", duration: "1h 30m", date: "Yesterday" },
  { id: "3", name: "Data Structures", language: "Java", duration: "45m", date: "2 days ago" },
  { id: "4", name: "System Design", language: "JavaScript", duration: "3h 00m", date: "3 days ago" },
]

export function ProfilePage({ userName }: ProfilePageProps) {
  const [name, setName] = useState(userName)
  const [bio, setBio] = useState("Full-stack developer passionate about clean code and collaboration.")
  const [selectedLanguages, setSelectedLanguages] = useState(["JavaScript", "Python", "TypeScript"])

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages(prev => 
      prev.includes(lang) 
        ? prev.filter(l => l !== lang)
        : [...prev, lang]
    )
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        
        {/* Avatar and basic info */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-cursor-blue flex items-center justify-center text-3xl font-bold text-primary-foreground">
                {name.charAt(0).toUpperCase()}
              </div>
              <button className="absolute inset-0 rounded-2xl bg-background/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="w-6 h-6 text-foreground" />
              </button>
            </div>
            
            {/* Info form */}
            <div className="flex-1 space-y-4 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Display Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-secondary border-border focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="arjun@example.com"
                    className="bg-secondary border-border focus:border-primary"
                    disabled
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-foreground">Bio</Label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Preferred Languages */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Preferred Languages</h2>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => toggleLanguage(lang)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedLanguages.includes(lang)
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
        
        {/* Achievements */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Achievements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon
              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-xl border transition-all ${
                    achievement.earned
                      ? "bg-secondary border-primary/30"
                      : "bg-card border-border opacity-50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                    achievement.earned ? "bg-primary/20" : "bg-muted"
                  }`}>
                    <Icon className={`w-5 h-5 ${achievement.earned ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <h3 className="font-medium text-foreground">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Session History */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Sessions</h2>
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{session.name}</h3>
                    <p className="text-sm text-muted-foreground">{session.language}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{session.duration}</p>
                  <p className="text-xs text-muted-foreground">{session.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
