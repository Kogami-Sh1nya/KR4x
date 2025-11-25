import Poll from './Poll'

function PollList({ polls, onVote }) {
  if (polls.length === 0) {
    return (
      <div className="no-polls">
        <p>Опросы не найдены. Создайте первый опрос!</p>
      </div>
    )
  }

  return (
    <div className="poll-list">
      {polls.map(poll => (
        <Poll 
          key={poll.id} 
          poll={poll} 
          onVote={onVote}
        />
      ))}
    </div>
  )
}

export default PollList