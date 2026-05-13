import React from 'react'
import { useAuth } from '../context/AuthContext'

function ScoresList({ scores, candidateId }) {
  const { user } = useAuth()

  if (!scores || scores.length === 0) {
    return (
      <div className="card">
        <h3>Scores</h3>
        <p>No scores submitted yet.</p>
      </div>
    )
  }

  // Group scores by reviewer for admin view
  const scoresByReviewer = {}
  if (user?.role === 'admin') {
    scores.forEach(score => {
      if (!scoresByReviewer[score.reviewer_id]) {
        scoresByReviewer[score.reviewer_id] = []
      }
      scoresByReviewer[score.reviewer_id].push(score)
    })
  }

  return (
    <div className="card">
      <h3>Scores</h3>
      
      {user?.role === 'admin' ? (
        // Admin view - show all scores grouped by reviewer
        Object.entries(scoresByReviewer).map(([reviewerId, reviewerScores]) => (
          <div key={reviewerId} style={{ marginBottom: '20px', borderLeft: '3px solid #007bff', paddingLeft: '15px' }}>
            <h4>Reviewer #{reviewerId}</h4>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Score</th>
                  <th>Note</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {reviewerScores.map(score => (
                  <tr key={score.id}>
                    <td>{score.category}</td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        background: score.score >= 4 ? '#28a745' : score.score >= 3 ? '#ffc107' : '#dc3545',
                        color: 'white'
                      }}>
                        {score.score}/5
                      </span>
                    </td>
                    <td>{score.note || '-'}</td>
                    <td>{new Date(score.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        // Reviewer view - show only their own scores
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Score</th>
              <th>Note</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map(score => (
              <tr key={score.id}>
                <td>{score.category}</td>
                <td>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    background: score.score >= 4 ? '#28a745' : score.score >= 3 ? '#ffc107' : '#dc3545',
                    color: 'white'
                  }}>
                    {score.score}/5
                  </span>
                </td>
                <td>{score.note || '-'}</td>
                <td>{new Date(score.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ScoresList