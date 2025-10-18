import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useProgress } from '../contexts/ProgressContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const QuizView = ({ fileId }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [numQuestions, setNumQuestions] = useState(20);
  const { updateProgress } = useProgress();

  const fetchQuiz = async (questionCount = numQuestions) => {
    if (!fileId) return;
    
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`${API_BASE_URL}/quiz/${fileId}?questions=${questionCount}`);
      setQuiz(response.data);
      setAnswers({});
      setShowResults(false);
      setScore(0);
    } catch (err) {
      console.error('Error fetching quiz:', err);
      setError(err.response?.data?.error || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fileId) {
      fetchQuiz();
    } else {
      setQuiz(null);
      setError('');
    }
  }, [fileId]);

  const handleAnswerChange = (questionIndex, answerIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: answerIndex
    });
  };

  const submitQuiz = async () => {
    if (!quiz || !quiz.questions) return;
    
    let correctCount = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    const scorePercentage = (correctCount / quiz.questions.length) * 100;
    setScore(correctCount);
    setShowResults(true);
    
    // Update progress tracking for quiz completion
    try {
      await updateProgress('quiz', { score: scorePercentage });
    } catch (error) {
      console.error('Error updating quiz progress:', error);
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const getScoreColor = () => {
    const percentage = (score / quiz.questions.length) * 100;
    if (percentage >= 80) return '#28a745';
    if (percentage >= 60) return '#ffc107';
    return '#dc3545';
  };

  if (!fileId) {
    return (
      <div className="card">
        <h2>👩‍🎓 Quiz</h2>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <p>Please select a file from the Upload tab to take a quiz</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card">
        <h2>👩‍🎓 Quiz</h2>
        <div className="loading">
          <div className="spinner"></div>
          <p>Generating quiz with AI...</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2>👩‍🎓 Quiz</h2>
        <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>
          <p>❌ {error}</p>
          <button onClick={fetchQuiz} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="card">
        <h2>👩‍🎓 Quiz</h2>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <p>No quiz questions available</p>
        </div>
      </div>
    );
  }

  const allQuestionsAnswered = quiz.questions.every((_, index) => 
    answers.hasOwnProperty(index)
  );

  return (
    <div className="quiz-container">
      <div className="card">
        <h2>👩‍🎓 Quiz</h2>
        
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Number of questions:</span>
            <select 
              value={numQuestions} 
              onChange={(e) => setNumQuestions(parseInt(e.target.value))}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
              <option value={20}>20 Questions</option>
              <option value={25}>25 Questions</option>
            </select>
          </label>
          
          <button 
            onClick={() => fetchQuiz(numQuestions)}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate New Quiz'}
          </button>
        </div>
        
        {quiz && (
          <p style={{ marginBottom: '2rem', color: '#666' }}>
            Answer all {quiz.questions.length} questions and click submit to see your results.
          </p>
        )}
        
        {!showResults ? (
          <div>
            {quiz.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="question-card card">
                <div className="question-title">
                  {questionIndex + 1}. {question.question}
                </div>
                
                <ul className="options-list">
                  {question.options.map((option, optionIndex) => (
                    <li key={optionIndex} className="option-item">
                      <label 
                        className={`option-label ${
                          answers[questionIndex] === optionIndex ? 'selected' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${questionIndex}`}
                          value={optionIndex}
                          checked={answers[questionIndex] === optionIndex}
                          onChange={() => handleAnswerChange(questionIndex, optionIndex)}
                          className="option-input"
                        />
                        {option}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button 
                onClick={submitQuiz}
                disabled={!allQuestionsAnswered}
                className="btn btn-success"
                style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
              >
                {allQuestionsAnswered ? 'Submit Quiz' : `Answer ${quiz.questions.length - Object.keys(answers).length} more questions`}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="quiz-results">
              <h3>Quiz Results</h3>
              <div className="score" style={{ color: getScoreColor() }}>
                {score} / {quiz.questions.length}
              </div>
              <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                {((score / quiz.questions.length) * 100).toFixed(0)}% Correct
              </p>
              
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ marginBottom: '1rem' }}>Review:</h4>
                {quiz.questions.map((question, questionIndex) => {
                  const userAnswer = answers[questionIndex];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div key={questionIndex} style={{ 
                      marginBottom: '1.5rem', 
                      padding: '1rem',
                      border: `2px solid ${isCorrect ? '#28a745' : '#dc3545'}`,
                      borderRadius: '4px'
                    }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        {questionIndex + 1}. {question.question}
                      </div>
                      
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong>Your answer:</strong> {question.options[userAnswer]} 
                        {isCorrect ? ' ✅' : ' ❌'}
                      </div>
                      
                      {!isCorrect && (
                        <div style={{ color: '#28a745' }}>
                          <strong>Correct answer:</strong> {question.options[question.correctAnswer]}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button onClick={resetQuiz} className="btn btn-primary">
                  Take Quiz Again
                </button>
                <button onClick={fetchQuiz} className="btn btn-secondary">
                  Generate New Quiz
                </button>
              </div>
            </div>
          </div>
        )}
        
        {!showResults && (
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '4px',
            fontSize: '0.9rem',
            color: '#666',
            textAlign: 'center'
          }}>
            <p>💡 <strong>Study Tip:</strong> Review the summary and flashcards before taking the quiz!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;