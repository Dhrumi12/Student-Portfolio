const BASE_URL = 'http://localhost:5001'

async function request(path, options = {}, protectedRequest = false) {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (protectedRequest && token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${BASE_URL}${path}`, {
    headers,
    ...options,
  })

  const responseText = await response.text()
  let data = {}

  if (responseText) {
    try {
      data = JSON.parse(responseText)
    } catch {
      throw new Error('The server returned an invalid response.')
    }
  }

  if (response.status === 401 && protectedRequest) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.assign('/login?reason=expired')
  }

  if (!response.ok) {
    const details = data.details ? Object.values(data.details).join(' ') : ''
    throw new Error(details || data.error || `Request failed with status ${response.status}`)
  }

  return data
}

export const getTasks = () => request('/tasks', {}, true)

export const createTask = (task) =>
  request('/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  }, true)

export const updateTask = (id, task) =>
  request(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(task),
  }, true)

export const deleteTask = (id) =>
  request(`/tasks/${id}`, {
    method: 'DELETE',
  }, true)

export const registerUser = (credentials) =>
  request('/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })

export const loginUser = (credentials) =>
  request('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })

export const getCurrentUser = () => request('/me', {}, true)