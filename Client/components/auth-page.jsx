"use client"

import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Github, Chrome, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signup, login } from "@/lib/api"

export function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      let data

      if (isLogin) {
        data = await login(email, password)
      } else {
        data = await signup(name, email, password)
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      onLogin(data.user)
    } catch (err) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0d0f14]">
        {/* Animated gradient blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cursor-blue/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cursor-pink/10 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full py-12 px-12 xl:px-20">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center glow-primary">
                <span className="text-2xl font-bold text-primary-foreground">{"</>"}</span>
              </div>
              <span className="text-3xl font-bold text-foreground">CodeSync</span>
            </div>

            {/* Tagline */}
            <h1 className="text-5xl xl:text-6xl font-bold text-foreground leading-tight mb-6">
              Collaborate.
              <br />
              <span className="gradient-text">Code.</span>
              <br />
              Execute.
            </h1>

            <p className="text-lg text-muted-foreground max-w-md mb-8">
              Practice DSA and ace your coding interviews with real-time collaboration. Solve problems, run code, and prepare with your team — anywhere in the world.
            </p>

            {/* Feature highlights */}
            <div className="space-y-4">
              {[
                "Real-time multi-cursor collaboration",
                "Support for 12+ programming languages",
                "Curated DSA problem bank with interview mode",
                "Built-in chat and version history",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse-live" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Code snippet decoration */}
          <div className="glass rounded-xl p-4 font-mono text-sm mt-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <div className="w-3 h-3 rounded-full bg-warning" />
              <div className="w-3 h-3 rounded-full bg-success" />
            </div>

            <pre className="text-muted-foreground">
              <code>
                <span className="text-cursor-pink">const</span>{" "}
                <span className="text-cursor-blue">team</span> ={" "}
                <span className="text-warning">[</span>
                <span className="text-success">&quot;you&quot;</span>,{" "}
                <span className="text-success">&quot;me&quot;</span>
                <span className="text-warning">]</span>;
                {"\n"}
                <span className="text-cursor-pink">await</span>{" "}
                <span className="text-cursor-blue">collaborate</span>(team);
              </code>
            </pre>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">{"</>"}</span>
            </div>
            <span className="text-2xl font-bold text-foreground">CodeSync</span>
          </div>

          <div className="glass rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {isLogin ? "Welcome back" : "Create account"}
              </h2>

              <p className="text-muted-foreground">
                {isLogin
                  ? "Enter your credentials to access your workspace"
                  : "Start collaborating with your team today"}
              </p>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button
                variant="outline"
                type="button"
                className="bg-secondary border-border hover:bg-muted hover:border-primary/50 transition-all"
              >
                <Chrome className="w-4 h-4 mr-2" />
                Google
              </Button>

              <Button
                variant="outline"
                type="button"
                className="bg-secondary border-border hover:bg-muted hover:border-primary/50 transition-all"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>

              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">
                  or continue with email
                </span>
              </div>
            </div>

            {/* ✅ Error message */}
            {error && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Full Name
                  </Label>

                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-secondary border-border focus:border-primary focus:ring-primary"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-secondary border-border focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground">
                    Password
                  </Label>

                  {isLogin && (
                    <button
                      type="button"
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-secondary border-border focus:border-primary focus:ring-primary"
                    required
                    minLength={6}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-primary transition-all group"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}{" "}

              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError("")
                }}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}