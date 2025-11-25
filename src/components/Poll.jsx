import { useState } from 'react'
import PollResults from './PollResults'

function Poll({ poll, onVote }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)

  const handleVote = () => {
    if (selectedOption !== null) {
      onVote(poll.id, selectedOption)
      setHasVoted(true)
    }
  }

  const handleOptionChange = (optionIndex) => {
    setSelectedOption(optionIndex)
  }

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0)

  return (
    <div className="poll">
      <div className="poll-header">
        <h3>{poll.question}</h3>
        <span className="total-badge">{totalVotes} голосов</span>
      </div>
      
      {!hasVoted ? (
        <div className="poll-voting">
          {poll.options.map((option, index) => (
            <div key={index} className="option">
              <label>
                <input
                  type="radio"
                  name={`poll-${poll.id}`}
                  value={index}
                  checked={selectedOption === index}
                  onChange={() => handleOptionChange(index)}
                />
                <span className="option-text">{option.text}</span>
              </label>
            </div>
          ))}
          <button 
            onClick={handleVote} 
            disabled={selectedOption === null}
            className="vote-button"
          >
            ✅ Голосовать
          </button>
        </div>
      ) : (
        <PollResults options={poll.options} totalVotes={totalVotes} />
      )}
    </div>
  )
}

export default Poll