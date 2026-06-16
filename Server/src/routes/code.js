const express = require("express")
const axios = require("axios")
const authMiddleware = require("../middleware/auth")

const router = express.Router()

// Language mapping for Piston API
const languageMap = {
  JavaScript: { language: "javascript", version: "18.15.0" },
  Python: { language: "python", version: "3.10.0" },
  Java: { language: "java", version: "15.0.2" },
  "C++": { language: "cpp", version: "10.2.0" },
  TypeScript: { language: "typescript", version: "5.0.3" },
  Go: { language: "go", version: "1.16.2" },
  Rust: { language: "rust", version: "1.50.0" },
}

// ===== EXECUTE CODE =====
router.post("/execute", authMiddleware, async (req, res) => {
  try {
    const { code, language, stdin } = req.body

    if (!code || !language) {
      return res.status(400).json({ message: "Code and language are required" })
    }

    const langConfig = languageMap[language]
    if (!langConfig) {
      return res.status(400).json({ message: "Language not supported" })
    }

    const response = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      {
        language: langConfig.language,
        version: langConfig.version,
        files: [{ content: code }],
        stdin: stdin || "",
      }
    )

    const result = response.data.run

    res.json({
      output: result.stdout || "",
      error: result.stderr || "",
      exitCode: result.code,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Code execution failed" })
  }
})

module.exports = router