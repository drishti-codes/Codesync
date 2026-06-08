"use client"

import { useState, useMemo } from "react"
import { X, Search, Tag, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const problems = [
  // Easy
  { id: 1, title: "Two Sum", difficulty: "Easy", topics: ["Array", "Hash Table"], description: "Given an array of integers, return indices of two numbers that add up to target." },
  { id: 2, title: "Valid Parentheses", difficulty: "Easy", topics: ["Stack", "String"], description: "Given a string containing brackets, determine if the input string is valid." },
  { id: 3, title: "Reverse String", difficulty: "Easy", topics: ["String", "Two Pointers"], description: "Write a function that reverses a string in-place." },
  { id: 4, title: "Binary Search", difficulty: "Easy", topics: ["Array", "Binary Search"], description: "Given a sorted array, return the index of the target value." },
  { id: 5, title: "Fibonacci Number", difficulty: "Easy", topics: ["Math", "Recursion"], description: "Calculate the nth Fibonacci number." },
  { id: 6, title: "Palindrome Check", difficulty: "Easy", topics: ["String", "Two Pointers"], description: "Determine whether a string is a palindrome." },
  { id: 7, title: "Maximum Subarray", difficulty: "Easy", topics: ["Array", "Dynamic Programming"], description: "Find the contiguous subarray with the largest sum." },

  // Medium
  { id: 8, title: "Longest Substring Without Repeating", difficulty: "Medium", topics: ["String", "Sliding Window"], description: "Find the length of the longest substring without repeating characters." },
  { id: 9, title: "3Sum", difficulty: "Medium", topics: ["Array", "Two Pointers"], description: "Find all unique triplets in the array which gives the sum of zero." },
  { id: 10, title: "Merge Intervals", difficulty: "Medium", topics: ["Array", "Sorting"], description: "Merge all overlapping intervals and return non-overlapping intervals." },
  { id: 11, title: "Word Search", difficulty: "Medium", topics: ["Array", "Backtracking"], description: "Given a 2D board, find if the word exists in the grid." },
  { id: 12, title: "Coin Change", difficulty: "Medium", topics: ["Dynamic Programming"], description: "Find the fewest number of coins needed to make up the amount." },
  { id: 13, title: "Number of Islands", difficulty: "Medium", topics: ["Array", "Graph", "BFS"], description: "Count the number of islands in a 2D binary grid." },
  { id: 14, title: "LRU Cache", difficulty: "Medium", topics: ["Hash Table", "Linked List"], description: "Design a data structure that follows LRU cache constraints." },
  { id: 15, title: "Sort Colors", difficulty: "Medium", topics: ["Array", "Two Pointers"], description: "Sort an array with only 0s, 1s, and 2s in-place." },

  // Hard
  { id: 16, title: "Median of Two Sorted Arrays", difficulty: "Hard", topics: ["Array", "Binary Search"], description: "Find the median of two sorted arrays in O(log(m+n)) time." },
  { id: 17, title: "Trapping Rain Water", difficulty: "Hard", topics: ["Array", "Two Pointers", "Stack"], description: "Calculate how much water can be trapped between bars." },
  { id: 18, title: "Word Ladder", difficulty: "Hard", topics: ["String", "BFS", "Graph"], description: "Find the shortest transformation sequence from beginWord to endWord." },
  { id: 19, title: "N-Queens", difficulty: "Hard", topics: ["Array", "Backtracking"], description: "Place N queens on an N×N chessboard so no two queens attack each other." },
  { id: 20, title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", topics: ["Tree", "BFS", "DFS"], description: "Design an algorithm to serialize and deserialize a binary tree." },
]

const allTopics = [
  "All Topics", "Array", "String", "Tree", "Graph",
  "Dynamic Programming", "Hash Table", "Stack",
  "Two Pointers", "Binary Search", "BFS", "Backtracking",
]

const difficultyConfig = {
  Easy: "text-green-400 bg-green-400/10 border-green-400/30",
  Medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  Hard: "text-red-400 bg-red-400/10 border-red-400/30",
}

export function ProblemSelectModal({ isOpen, onClose, onSelect, currentProblemId }) {
  const [difficultyFilter, setDifficultyFilter] = useState("All")
  const [topicFilter, setTopicFilter] = useState("All Topics")
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState(currentProblemId || null)

  if (!isOpen) return null

  const filteredProblems = problems.filter(p => {
    if (difficultyFilter !== "All" && p.difficulty !== difficultyFilter) return false
    if (topicFilter !== "All Topics" && !p.topics.includes(topicFilter)) return false
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleSelect = () => {
    const problem = problems.find(p => p.id === selectedId)
    if (problem) {
      onSelect(problem)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl mx-4 bg-card rounded-2xl border border-border shadow-2xl flex flex-col max-h-[80vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="text-base font-bold text-foreground">Select Problem</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filters */}
        <div className="px-5 py-3 border-b border-border space-y-3 shrink-0">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search problems..."
              className="w-full bg-secondary rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground shrink-0">Difficulty:</span>
            <div className="flex gap-1.5">
              {["All", "Easy", "Medium", "Hard"].map(d => (
                <button
                  key={d}
                  onClick={() => setDifficultyFilter(d)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                    difficultyFilter === d
                      ? d === "All"
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : difficultyConfig[d]
                      : "border-border text-muted-foreground hover:border-primary/30"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground shrink-0">Topic:</span>
            <div className="flex gap-1.5 flex-wrap">
              {allTopics.slice(0, 7).map(topic => (
                <button
                  key={topic}
                  onClick={() => setTopicFilter(topic)}
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs border transition-all",
                    topicFilter === topic
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  )}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {filteredProblems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Search className="w-8 h-8 opacity-30 mb-2" />
              <p className="text-sm">No problems found</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredProblems.map(problem => (
                <button
                  key={problem.id}
                  onClick={() => setSelectedId(problem.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all border",
                    selectedId === problem.id
                      ? "bg-primary/10 border-primary/30"
                      : "border-transparent hover:bg-secondary hover:border-border"
                  )}
                >
                  {/* Problem number */}
                  <span className="text-xs text-muted-foreground w-6 shrink-0 text-right">
                    {problem.id}.
                  </span>

                  {/* Title + description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={cn(
                        "text-sm font-medium",
                        selectedId === problem.id ? "text-primary" : "text-foreground"
                      )}>
                        {problem.title}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {problem.description}
                    </p>
                  </div>

                  {/* Difficulty badge */}
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full border shrink-0",
                    difficultyConfig[problem.difficulty]
                  )}>
                    {problem.difficulty}
                  </span>

                  {/* Topics */}
                  <div className="hidden sm:flex gap-1 shrink-0">
                    {problem.topics.slice(0, 2).map(topic => (
                      <span
                        key={topic}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground flex items-center gap-0.5"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Selected indicator */}
                  {selectedId === problem.id && (
                    <ChevronRight className="w-4 h-4 text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border flex items-center justify-between shrink-0">
          <span className="text-xs text-muted-foreground">
            {filteredProblems.length} problem{filteredProblems.length !== 1 ? "s" : ""} found
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSelect}
              disabled={!selectedId}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                selectedId
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "bg-secondary text-muted-foreground cursor-not-allowed"
              )}
            >
              Select Problem
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}