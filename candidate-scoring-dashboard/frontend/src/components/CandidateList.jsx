import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

function CandidateList() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    role_applied: '',
    skill: '',
    keyword: ''
  })
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0
  })
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    fetchCandidates()
  }, [filters, pagination.page])

  const fetchCandidates = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.page,
        page_size: pagination.pageSize,
        ...filters
      }
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key]
      })
      
      const response = await api.get('/candidates', { params })
      setCandidates(response.data.candidates)
      setPagination(prev => ({ ...prev, total: response.data.total }))
    } catch (err) {
      setError('Failed to fetch candidates')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const totalPages = Math.ceil(pagination.total / pagination.pageSize)

  return (
    <div className="container">
      <div className="card">
        <h2>Candidates</h2>
        
        {/* Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search by name or email"
            value={filters.keyword}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
          />
          <input
            type="text"
            placeholder="Role applied"
            value={filters.role_applied}
            onChange={(e) => handleFilterChange('role_applied', e.target.value)}
          />
          <input
            type="text"
            placeholder="Skill"
            value={filters.skill}
            onChange={(e) => handleFilterChange('skill', e.target.value)}
          />
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
          <button onClick={fetchCandidates}>Apply Filters</button>
        </div>

        {error && <div className="error">{error}</div>}
        
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role Applied</th>
                  <th>Status</th>
                  <th>Skills</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map(candidate => (
                  <tr key={candidate.id}>
                    <td>{candidate.name}</td>
                    <td>{candidate.email}</td>
                    <td>{candidate.role_applied}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: candidate.status === 'new' ? '#ffc107' :
                                   candidate.status === 'reviewed' ? '#17a2b8' :
                                   candidate.status === 'hired' ? '#28a745' : '#dc3545',
                        color: 'white'
                      }}>
                        {candidate.status}
                      </span>
                    </td>
                    <td>{candidate.skills?.join(', ')}</td>
                    <td>
                      <button onClick={() => navigate(`/candidate/${candidate.id}`)}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </button>
                <span style={{ padding: '10px' }}>
                  Page {pagination.page} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CandidateList