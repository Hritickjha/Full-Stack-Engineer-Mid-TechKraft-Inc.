import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import ScoreForm from './ScoreForm'
import ScoresList from './ScoresList'
import AISummary from './AISummary'
import InternalNotes from './InternalNotes'

function CandidateDetail() {
  const { id } = useParams()
  const [candidate, setCandidate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCandidate()
  }, [id])

  const fetchCandidate = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/candidates/${id}`)
      setCandidate(response.data)
    } catch (err) {
      setError('Failed to fetch candidate details')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleScoreAdded = () => {
    fetchCandidate() // Refresh to show new score
  }

  const handleUpdateStatus = async (newStatus) => {
    if (!user || user.role !== 'admin') {
      alert('Only admins can update status')
      return
    }
    
    setUpdating(true)
    try {
      await api.put(`/candidates/${id}`, { status: newStatus })
      await fetchCandidate()
    } catch (err) {
      setError('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!user || user.role !== 'admin') {
      alert('Only admins can delete candidates')
      return
    }
    
    if (window.confirm('Are you sure you want to archive this candidate?')) {
      setUpdating(true)
      try {
        await api.delete(`/candidates/${id}`)
        navigate('/')
      } catch (err) {
        setError('Failed to archive candidate')
      } finally {
        setUpdating(false)
      }
    }
  }

  if (loading) return <div className="container"><div className="loading">Loading...</div></div>
  if (error) return <div className="container"><div className="error">{error}</div></div>
  if (!candidate) return <div className="container"><div className="error">Candidate not found</div></div>

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h2>{candidate.name}</h2>
            <p><strong>Email:</strong> {candidate.email}</p>
            <p><strong>Role Applied:</strong> {candidate.role_applied}</p>
            <p><strong>Skills:</strong> {candidate.skills?.join(', ')}</p>
            <p><strong>Status:</strong> 
              <select 
                value={candidate.status}
                onChange={(e) => handleUpdateStatus(e.target.value)}
                disabled={user?.role !== 'admin' || updating}
                style={{ marginLeft: '10px', width: 'auto' }}
              >
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </p>
            <p><strong>Created:</strong> {new Date(candidate.created_at).toLocaleDateString()}</p>
          </div>
          {user?.role === 'admin' && (
            <button onClick={handleDelete} disabled={updating} style={{ background: '#dc3545' }}>
              Archive Candidate
            </button>
          )}
        </div>
      </div>

      <ScoreForm candidateId={id} onScoreAdded={handleScoreAdded} />
      
      <ScoresList scores={candidate.scores} candidateId={id} />
      
      <AISummary candidateId={id} candidateName={candidate.name} />
      
      {user?.role === 'admin' && (
        <InternalNotes 
          candidateId={id} 
          notes={candidate.internal_notes || ''}
          onNotesUpdated={fetchCandidate}
        />
      )}
    </div>
  )
}

export default CandidateDetail