import { useEffect, useState } from 'react'
import { createTask, deleteTask, getTasks, updateTask } from '../api.js'

const emptyForm = { title: '', description: '', priority: 'medium' }

function Projects() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [toast, setToast] = useState(null)

  const fetchTasks = async () => {
    setLoading(true)
    setError(null)

    try {
      setTasks(await getTasks())
    } catch (err) {
      setError(err.message || 'Something went wrong while loading tasks.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timeoutId = window.setTimeout(() => setToast(null), 3500)
    return () => window.clearTimeout(timeoutId)
  }, [toast])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function startEditing(task) {
    setEditingId(task._id)
    setForm({ title: task.title, description: task.description || '', priority: task.priority })
  }

  function resetForm() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    const isEditing = Boolean(editingId)
    const optimisticId = `optimistic-${Date.now()}`
    const optimisticTask = {
      ...form,
      _id: optimisticId,
      completed: false,
      createdAt: new Date().toISOString(),
      optimistic: true,
    }

    if (!isEditing) {
      setTasks((current) => [optimisticTask, ...current])
    }

    try {
      const savedTask = isEditing
        ? await updateTask(editingId, form)
        : await createTask(form)

      setTasks((current) =>
        isEditing
          ? current.map((task) => (task._id === savedTask._id ? savedTask : task))
          : current.map((task) => (task._id === optimisticId ? savedTask : task)),
      )
      setToast({ type: 'success', message: isEditing ? 'Task updated successfully.' : 'Task created successfully.' })
      resetForm()
    } catch (err) {
      if (!isEditing) {
        setTasks((current) => current.filter((task) => task._id !== optimisticId))
      }
      setToast({ type: 'error', message: err.message || 'Unable to save the task.' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(task) {
    if (!window.confirm(`Delete "${task.title}"?`)) return
    setDeletingId(task._id)

    try {
      await deleteTask(task._id)
      setTasks((current) => current.filter((item) => item._id !== task._id))
      setToast({ type: 'success', message: 'Task deleted successfully.' })
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Unable to delete the task.' })
    } finally {
      setDeletingId(null)
    }
  }

  async function handleToggle(task) {
    setUpdatingId(task._id)

    try {
      const updatedTask = await updateTask(task._id, { completed: !task.completed })
      setTasks((current) => current.map((item) => (item._id === updatedTask._id ? updatedTask : item)))
      setToast({ type: 'success', message: updatedTask.completed ? 'Task completed.' : 'Task reopened.' })
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Unable to update the task.' })
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <section className="section-card projects-section">
      <h1 className="task-manager-title">Task Manager</h1>
      <p className="section-intro">Tasks are loaded and saved through your Express and MongoDB backend.</p>

      <form className="task-form" onSubmit={handleSubmit}>
        <input id="task-title" className="contact-input" name="title" value={form.title} onChange={handleChange} placeholder="Task title" required />
        <input id="task-description" className="contact-input" name="description" value={form.description} onChange={handleChange} placeholder="Description" />
        <select id="task-priority" className="contact-input" name="priority" value={form.priority} onChange={handleChange} aria-label="Task priority">
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
        <div className="contact-actions task-actions">
          <button type="submit" className="toggle-btn" disabled={saving}>{saving ? editingId ? 'Updating...' : 'Creating...' : editingId ? 'Update Task' : 'Add Task'}</button>
          {editingId && <button type="button" className="secondary-btn" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      {loading && (
        <div className="status-box loading-box">
          <div className="spinner" aria-label="Loading" />
          <p>Loading tasks...</p>
        </div>
      )}

      {!loading && error && (
        <div className="status-box error-box">
          <p>{error}</p>
            <button type="button" className="retry-btn" onClick={fetchTasks}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && tasks.length === 0 && (
        <div className="status-box empty-box">
          <p>No tasks yet. Add your first task above.</p>
        </div>
      )}

      {!loading && !error && tasks.length > 0 && (
        <div className="task-list">
          {tasks.map((task) => (
            <article key={task._id} className={`task-card ${task.completed ? 'task-complete' : ''}`}>
              <div className="task-card-content">
                <div className="task-heading">
                  <h3>{task.title}</h3>
                  <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
                </div>
                <p>{task.description || 'No description added.'}</p>
                <small className="task-status">{task.completed ? 'Completed' : 'In progress'}</small>
              </div>
              <div className="task-card-actions">
                <button type="button" className="secondary-btn" onClick={() => handleToggle(task)} disabled={updatingId === task._id || deletingId === task._id}>{updatingId === task._id ? 'Updating...' : task.completed ? 'Reopen' : 'Complete'}</button>
                <button type="button" className="secondary-btn" onClick={() => startEditing(task)} disabled={updatingId === task._id || deletingId === task._id}>Edit</button>
                <button type="button" className="danger-btn" onClick={() => handleDelete(task)} disabled={deletingId === task._id}>{deletingId === task._id ? 'Deleting...' : 'Delete'}</button>
              </div>
            </article>
          ))}
        </div>
      )}
      {toast && <div className={`toast toast-${toast.type}`} role="status">{toast.message}</div>}
    </section>
  )
}

export default Projects
