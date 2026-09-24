import { useState } from 'react'

function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [showHelp, setShowHelp] = useState(true)
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus('')

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      const responseText = await response.text()
      let result = {}

      if (responseText) {
        try {
          result = JSON.parse(responseText)
        } catch {
          throw new Error('The server returned an invalid response.')
        }
      }

      if (!response.ok) {
        throw new Error(result.details ? Object.values(result.details).join(' ') : result.error || 'Unable to save your message.')
      }

      setStatus('Your message was saved successfully.')
      setName('')
      setEmail('')
      setMessage('')
    } catch (error) {
      setStatus(error.message || 'Unable to save your message.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="section-card contact-section">
      <h2>Contact</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name" className="contact-label">
          Name
        </label>
        <input
          id="name"
          className="contact-input"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          required
        />

        <label htmlFor="email" className="contact-label contact-label-spaced">
          Email
        </label>
        <input
          id="email"
          className="contact-input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />

        <label htmlFor="message" className="contact-label contact-label-spaced">
          Message
        </label>
        <textarea
          id="message"
          className="contact-input contact-textarea"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Write your message here..."
          rows="5"
          required
        />

        <div className="contact-actions">
          <button type="submit" className="toggle-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Send message'}
          </button>
        </div>
      </form>

      <div className="contact-actions">
        <button type="button" className="toggle-btn" onClick={() => setShowHelp((value) => !value)}>
          {showHelp ? 'Hide help' : 'Show help'}
        </button>
      </div>

      {showHelp && (
        <p className="help-box">I usually reply within 24 to 48 hours. Please include a short project summary.</p>
      )}

      <p className="char-count">Characters: {message.length}</p>
      <p className="live-preview">{message || 'Your message preview will appear here.'}</p>
      {status && <p className="status-box">{status}</p>}
    </section>
  )
}

export default Contact
