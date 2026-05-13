import React, { useState } from 'react'
import api from '../services/api'

function InternalNotes({ candidateId, notes, onNotesUpdated }) {
  const [currentNotes, setCurrentNotes] = useState(notes || '')
  const [editing, setEditing] = useState(false)
  const [tempNotes, setTempNotes] = useState(notes || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await api.put(`/candidates/${candidateId}`, { internal_notes: tempNotes })
      setCurrentNotes(tempNotes)
      setEditing(false)
      onNotesUpdated()
    } catch (err) {
      setError('Failed to save notes')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setTempNotes(currentNotes)
    setEditing(false)
    setError('')
  }

  return (
    <div className="card" style={{ background: '#fff3cd' }}>
      <h3>📝 Internal Notes (Admin Only)</h3>
      
      {error && <div className="error">{error}</div>}
      
      {editing ? (
        <div>
          <textarea
            value={tempNotes}
            onChange={(e) => setTempNotes(e.target.value)}
            rows="4"
            style={{ width: '100%', marginBottom: '10px' }}
            placeholder="Add internal notes about this candidate..."
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Notes'}
            </button>
            <button onClick={handleCancel} style={{ background: '#6c757d' }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{
            background: 'white',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '10px',
            minHeight: '80px',
            whiteSpace: 'pre-wrap'
          }}>
            {currentNotes || <span style={{ color: '#999' }}>No internal notes yet.</span>}
          </div>
          <button onClick={() => setEditing(true)} style={{ background: '#6c757d' }}>
            Edit Notes
          </button>
        </div>
      )}
    </div>
  )
}

export default InternalNotes