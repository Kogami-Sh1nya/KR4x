function PollResults({ options, totalVotes }) {
  return (
    <div className="poll-results">
      <h4>Результаты голосования:</h4>
      {options.map((option, index) => {
        const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0
        return (
          <div key={index} className="result-item">
            <div className="result-header">
              <span className="option-text">{option.text}</span>
              <span className="vote-count">
                {option.votes} голосов ({percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        )
      })}
      <div className="total-votes">
        Всего голосов: {totalVotes}
      </div>
    </div>
  )
}

export default PollResults