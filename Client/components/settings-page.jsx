"use client"

import { useState } from "react"
import { 
  Moon, 
  Sun, 
  Monitor,
  Type,
  Keyboard,
  Bell,
  Link2,
  Save,
  Github,
  Chrome
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SettingsPage() {
  const [theme, setTheme] = useState("dark")
  const [fontSize, setFontSize] = useState("14")
  const [keybindings, setKeybindings] = useState("vscode")
  
  const [notifications, setNotifications] = useState({
    email: true,
    roomInvites: true,
    mentions: true,
  })

  const connectedAccounts = [
    { 
      id: "google", 
      name: "Google", 
      icon: Chrome, 
      connected: true, 
      email: "arjun@gmail.com" 
    },
    { 
      id: "github", 
      name: "GitHub", 
      icon: Github, 
      connected: true, 
      username: "@arjun-dev" 
    },
  ]

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        
        {/* Appearance */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Monitor className="w-5 h-5 text-primary" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Appearance
              </h2>

              <p className="text-sm text-muted-foreground">
                Customize the look and feel
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Theme */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Theme</Label>

                <p className="text-sm text-muted-foreground">
                  Select your preferred theme
                </p>
              </div>

              <div className="flex gap-2">
                {[
                  { id: "dark", icon: Moon, label: "Dark" },
                  { id: "light", icon: Sun, label: "Light" },
                  { id: "system", icon: Monitor, label: "System" },
                ].map((option) => {
                  const Icon = option.icon

                  return (
                    <button
                      key={option.id}
                      onClick={() => setTheme(option.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        theme === option.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />

                      <span className="text-sm font-medium">
                        {option.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Editor Settings */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Type className="w-5 h-5 text-primary" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Editor
              </h2>

              <p className="text-sm text-muted-foreground">
                Configure your coding experience
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Font Size */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Font Size</Label>

                <p className="text-sm text-muted-foreground">
                  Editor font size in pixels
                </p>
              </div>

              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger className="w-32 bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="bg-card border-border">
                  {["12", "14", "16", "18", "20"].map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}px
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Keybindings */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground flex items-center gap-2">
                  <Keyboard className="w-4 h-4" />
                  Keybindings
                </Label>

                <p className="text-sm text-muted-foreground">
                  Choose your preferred shortcuts
                </p>
              </div>

              <Select value={keybindings} onValueChange={setKeybindings}>
                <SelectTrigger className="w-32 bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="bg-card border-border">
                  <SelectItem value="vscode">VS Code</SelectItem>
                  <SelectItem value="vim">Vim</SelectItem>
                  <SelectItem value="emacs">Emacs</SelectItem>
                  <SelectItem value="sublime">Sublime</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Notifications */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Notifications
              </h2>

              <p className="text-sm text-muted-foreground">
                Manage your notification preferences
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              {
                id: "email",
                label: "Email Notifications",
                description: "Receive updates via email",
              },
              {
                id: "roomInvites",
                label: "Room Invites",
                description: "Get notified of room invitations",
              },
              {
                id: "mentions",
                label: "Mentions",
                description: "Notify when someone mentions you",
              },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <Label className="text-foreground">
                    {item.label}
                  </Label>

                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                <Switch
                  checked={notifications[item.id]}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({
                      ...prev,
                      [item.id]: checked,
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Connected Accounts */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-primary" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Connected Accounts
              </h2>

              <p className="text-sm text-muted-foreground">
                Manage linked accounts
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            {connectedAccounts.map((account) => {
              const Icon = account.icon

              return (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center">
                      <Icon className="w-5 h-5 text-foreground" />
                    </div>

                    <div>
                      <h3 className="font-medium text-foreground">
                        {account.name}
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        {account.email || account.username}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className={
                      account.connected
                        ? "border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    }
                  >
                    {account.connected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}