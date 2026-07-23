const API_URL = "http://localhost:5000/api"

export async function signup(name, email, password) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

// ===== Helper: Auth headers =====
function getAuthHeaders() {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

// ===== CREATE ROOM =====
export async function createRoom(roomData) {
  const res = await fetch(`${API_URL}/rooms`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(roomData),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

// ===== GET ALL ROOMS =====
export async function getRooms() {
  const res = await fetch(`${API_URL}/rooms`, {
    headers: getAuthHeaders(),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

// ===== GET SINGLE ROOM =====
export async function getRoom(roomId) {
  const res = await fetch(`${API_URL}/rooms/${roomId}`, {
    headers: getAuthHeaders(),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

// ===== JOIN ROOM (registers current user as participant/candidate) =====
export async function joinRoom(roomId) {
  const res = await fetch(`${API_URL}/rooms/${roomId}/join`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

// ===== UPDATE ROOM CODE =====
export async function updateRoomCode(roomId, code) {
  const res = await fetch(`${API_URL}/rooms/${roomId}/code`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ code }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

// ===== EXECUTE CODE =====
export async function executeCode(code, language, stdin) {
  const res = await fetch(`${API_URL}/code/execute`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ code, language, stdin }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}