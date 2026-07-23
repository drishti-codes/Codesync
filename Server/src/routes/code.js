const express = require("express")
const axios = require("axios")
const authMiddleware = require("../middleware/auth")

const router = express.Router()

// ✅ 12 languages — "10+ programming languages" ko sach banane ke liye
const languageMap = {
  JavaScript: "javascript",
  TypeScript: "typescript",
  Python: "python",
  Java: "java",
  "C++": "cpp",
  "C": "c",
  Go: "go",
  Rust: "rust",
  Ruby: "ruby",
  PHP: "php",
  "C#": "csharp",
  Kotlin: "kotlin",
}

const fileNames = {
  javascript: "main.js",
  typescript: "main.ts",
  python: "main.py",
  java: "Main.java",
  cpp: "main.cpp",
  c: "main.c",
  go: "main.go",
  rust: "main.rs",
  ruby: "main.rb",
  php: "main.php",
  csharp: "main.cs",
  kotlin: "main.kt",
}

router.post("/execute", authMiddleware, async (req, res) => {
  try {
    const { code, language, stdin } = req.body

    if (!code || !language) {
      return res.status(400).json({ message: "Code and language are required" })
    }

    const lang = languageMap[language]
    if (!lang) {
      return res.status(400).json({ message: "Language not supported" })
    }

    const response = await axios.post(
      `https://glot.io/api/run/${lang}/latest`,
      {
        files: [
          {
            name: fileNames[lang],
            content: code,
          },
        ],
        stdin: stdin || "",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${process.env.GLOT_TOKEN}`,
        },
      }
    )

    const result = response.data

    res.json({
      output: result.stdout || "",
      error: result.stderr || result.error || "",
      exitCode: 0,
    })
  } catch (error) {
    console.error(error?.response?.data || error.message)
    res.status(500).json({ message: "Code execution failed" })
  }
})

module.exports = router