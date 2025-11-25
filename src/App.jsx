import { useState, useEffect } from 'react'
import PollList from './components/PollList'
import { useLocalStorage } from './hooks/useLocalStorage'

function App() {
  const [polls, setPolls] = useLocalStorage('votingAppPolls', [])
  const [newPollQuestion, setNewPollQuestion] = useState('')
  const [newOptions, setNewOptions] = useState(['', ''])

  // Автоматическая генерация случайных голосов при загрузке
  useEffect(() => {
    if (polls.length === 0) {
      // Если нет опросов, создаем демо-опросы со случайными голосами
      const initialPolls = [
        {
          id: 1,
          question: "Какой ваш любимый язык программирования?",
          options: [
            { text: "JavaScript", votes: 0 },
            { text: "Python", votes: 0 },
            { text: "Java", votes: 0 },
            { text: "C++", votes: 0 }
          ]
        },
        {
          id: 2,
          question: "Какой фреймворк вы предпочитаете для React?",
          options: [
            { text: "Next.js", votes: 0 },
            { text: "Create React App", votes: 0 },
            { text: "Vite", votes: 0 },
            { text: "Gatsby", votes: 0 }
          ]
        }
      ]
      setPolls(generateRandomVotesForPolls(initialPolls))
    } else {
      // Если опросы уже есть, обновляем голоса при каждой загрузке
      setPolls(generateRandomVotesForPolls(polls))
    }
  }, [])

  // Функция для генерации случайных голосов для всех опросов
  const generateRandomVotesForPolls = (pollsArray) => {
    return pollsArray.map(poll => ({
      ...poll,
      options: poll.options.map(option => ({
        ...option,
        votes: Math.floor(Math.random() * 101) // Случайное число от 0 до 100
      }))
    }))
  }

  // Функция для перегенерации всех голосов
  const regenerateAllVotes = () => {
    setPolls(generateRandomVotesForPolls(polls))
  }

  const handleVote = (pollId, optionIndex) => {
    setPolls(prevPolls => 
      prevPolls.map(poll => 
        poll.id === pollId 
          ? {
              ...poll,
              options: poll.options.map((option, index) =>
                index === optionIndex
                  ? { ...option, votes: option.votes + 1 }
                  : option
              )
            }
          : poll
      )
    )
  }

  const addOption = () => {
    setNewOptions([...newOptions, ''])
  }

  const updateOption = (index, value) => {
    const updatedOptions = [...newOptions]
    updatedOptions[index] = value
    setNewOptions(updatedOptions)
  }

  const removeOption = (index) => {
    if (newOptions.length > 2) {
      const updatedOptions = newOptions.filter((_, i) => i !== index)
      setNewOptions(updatedOptions)
    }
  }

  const createPoll = () => {
    if (newPollQuestion.trim() && newOptions.every(opt => opt.trim())) {
      const newPoll = {
        id: Date.now(),
        question: newPollQuestion.trim(),
        options: newOptions.map(opt => ({ 
          text: opt.trim(), 
          votes: Math.floor(Math.random() * 51) // Новые опросы тоже получают случайные голоса
        }))
      }
      
      setPolls([...polls, newPoll])
      setNewPollQuestion('')
      setNewOptions(['', ''])
    }
  }

  const resetPolls = () => {
    setPolls(polls.map(poll => ({
      ...poll,
      options: poll.options.map(option => ({ ...option, votes: 0 }))
    })))
  }

  const getTotalVotes = () => {
    return polls.reduce((total, poll) => {
      return total + poll.options.reduce((sum, option) => sum + option.votes, 0)
    }, 0)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Система голосования</h1>
        <p>Выберите вариант и посмотрите результаты в реальном времени</p>
        <div className="stats">
          <div className="stat-item">
            <span className="stat-number">{polls.length}</span>
            <span className="stat-label">опросов</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{getTotalVotes()}</span>
            <span className="stat-label">всего голосов</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="random-votes-section">
          <h2>Управление голосами</h2>
          <div className="random-controls">
            <button onClick={regenerateAllVotes} className="random-btn">
              🔄 Обновить все голоса (случайно)
            </button>
            <button onClick={resetPolls} className="reset-btn">
              🗑️ Обнулить все голоса
            </button>
          </div>
          <p className="info-text">
            Голоса автоматически генерируются случайным образом при загрузке страницы
          </p>
        </section>

        <section className="create-poll">
          <h2>Создать новый опрос</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder="Введите вопрос опроса"
              value={newPollQuestion}
              onChange={(e) => setNewPollQuestion(e.target.value)}
              className="question-input"
            />
          </div>
          
          <div className="options-list">
            <h4>Варианты ответов:</h4>
            {newOptions.map((option, index) => (
              <div key={index} className="option-input-group">
                <input
                  type="text"
                  placeholder={`Вариант ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className="option-input"
                />
                {newOptions.length > 2 && (
                  <button 
                    type="button" 
                    onClick={() => removeOption(index)}
                    className="remove-option"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <div className="form-actions">
            <button onClick={addOption} className="add-option-btn">
              + Добавить вариант
            </button>
            <button 
              onClick={createPoll} 
              disabled={!newPollQuestion.trim() || newOptions.some(opt => !opt.trim())}
              className="create-poll-btn"
            >
              Создать опрос
            </button>
          </div>
        </section>

        <section className="polls-section">
          <div className="section-header">
            <h2>Доступные опросы</h2>
            <p className="refresh-info">
              🔄 Голоса обновляются при перезагрузке страницы
            </p>
          </div>
          <PollList polls={polls} onVote={handleVote} />
        </section>
      </main>
    </div>
  )
}

export default App