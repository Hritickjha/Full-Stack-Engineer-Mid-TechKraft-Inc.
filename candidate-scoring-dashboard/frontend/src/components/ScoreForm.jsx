import React, { useState } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = ['technical', 'communication', 'problem_solving', 'teamwork', 'leadership']

function ScoreForm({ candidateId, onScoreAdded }) {
  const [category, setCategory] = useState(CATEGORIES[0])
  const [score, setScore] = useState(3)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { user } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')
    
    try {
      await api.post(`/candidates/${candidateId}/scores`, {
        category,
        score,
        note
      })
      setSuccess('Score submitted successfully!')
      setNote('')
      onScoreAdded()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit score')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card">
      <h3>Submit Score</h3>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat.replace('_', ' ').toUpperCase()}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Score (1-5):</label>
          <input
            type="number"
            min="1"
            max="5"
            value={score}
            onChange={(e) => setScore(parseInt(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Note (optional):</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows="3"
          />
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Score'}
        </button>
      </form>
    </div>
  )
}

export default ScoreForm