import React, { useState } from 'react'
import api from '../services/api'

function AISummary({ candidateId, candidateName }) {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateSummary = async () => {
    setLoading(true)
    setError('')
    setSummary(null)
    
    try {
      const response = await api.post(`/candidates/${candidateId}/summary`)
      setSummary(response.data.summary)
    } catch (err) {
      setError('Failed to generate AI summary')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3>AI-Generated Summary</h3>
        <button onClick={generateSummary} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Summary'}
        </button>
      </div>
      
      {loading && (
        <div className="loading">
          <p>🤖 AI is analyzing candidate data...</p>
          <p style={{ fontSize: '12px', color: '#666' }}>This may take a few seconds...</p>
        </div>
      )}
      
      {error && <div className="error">{error}</div>}
      
      {summary && !loading && (
        <div style={{
          background: '#f8f9fa',
          padding: '15px',
          borderRadius: '4px',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          {summary}
        </div>
      )}
      
      {!summary && !loading && !error && (
        <p style={{ color: '#666' }}>Click the button to generate an AI-powered candidate summary.</p>
      )}
    </div>
  )
}

export default AISummary