"use client"

import { 
  Files, 
  Search, 
  GitBranch, 
  Settings,
  ChevronDown,
  ChevronRight,
  FileCode,
  Folder,
  FolderOpen
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface EditorSidebarProps {
  activeIcon: string
  onIconChange: (icon: string) => void
}

interface FileNode {
  name: string
  type: "file" | "folder"
  children?: FileNode[]
  language?: string
}

const fileTree: FileNode[] = [
  {
    name: "src",
    type: "folder",
    children: [
      { name: "index.js", type: "file", language: "javascript" },
      { name: "App.jsx", type: "file", language: "javascript" },
      { name: "styles.css", type: "file", language: "css" },
      {
        name: "components",
        type: "folder",
        children: [
          { name: "Header.jsx", type: "file", language: "javascript" },
          { name: "Footer.jsx", type: "file", language: "javascript" },
        ],
      },
    ],
  },
  { name: "package.json", type: "file", language: "json" },
  { name: "README.md", type: "file", language: "markdown" },
]

const sidebarIcons = [
  { id: "explorer", icon: Files, label: "Explorer" },
  { id: "search", icon: Search, label: "Search" },
  { id: "git", icon: GitBranch, label: "Git" },
  { id: "settings", icon: Settings, label: "Settings" },
]

function FileTreeItem({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const [isOpen, setIsOpen] = useState(depth === 0)

  return (
    <div>
      <button
        onClick={() => node.type === "folder" && setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-secondary/50 rounded transition-colors",
          "text-muted-foreground hover:text-foreground"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {node.type === "folder" ? (
          <>
            {isOpen ? (
              <ChevronDown className="w-4 h-4 shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 shrink-0" />
            )}
            {isOpen ? (
              <FolderOpen className="w-4 h-4 shrink-0 text-warning" />
            ) : (
              <Folder className="w-4 h-4 shrink-0 text-warning" />
            )}
          </>
        ) : (
          <>
            <span className="w-4" />
            <FileCode className="w-4 h-4 shrink-0 text-cursor-blue" />
          </>
        )}
        <span className="truncate">{node.name}</span>
      </button>
      {node.type === "folder" && isOpen && node.children && (
        <div>
          {node.children.map((child, i) => (
            <FileTreeItem key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function EditorSidebar({ activeIcon, onIconChange }: EditorSidebarProps) {
  return (
    <div className="flex h-full">
      {/* Icon bar */}
      <div className="w-12 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-2 gap-1">
        {sidebarIcons.map((item) => {
          const Icon = item.icon
          const isActive = activeIcon === item.id
          return (
            <button
              key={item.id}
              onClick={() => onIconChange(item.id)}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-lg transition-all relative",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r" />
              )}
            </button>
          )
        })}
      </div>
      
      {/* Explorer panel */}
      {activeIcon === "explorer" && (
        <div className="w-56 bg-sidebar border-r border-sidebar-border">
          <div className="p-3 border-b border-sidebar-border">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Explorer
            </h3>
          </div>
          <div className="p-2">
            {fileTree.map((node, i) => (
              <FileTreeItem key={i} node={node} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
