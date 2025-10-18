import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useProgress } from '../contexts/ProgressContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const FlashcardView = ({ fileId }) => {
  const [flashcards, setFlashcards] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { updateProgress } = useProgress();

  const fetchFlashcards = async () => {
    if (!fileId) return;
    
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`${API_BASE_URL}/flashcards/${fileId}`);
      setFlashcards(response.data);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    } catch (err) {
      console.error('Error fetching flashcards:', err);
      setError(err.response?.data?.error || 'Failed to generate flashcards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fileId) {
      fetchFlashcards();
    } else {
      setFlashcards(null);
      setError('');
    }
  }, [fileId]);

  const handleCardClick = async () => {
    setIsFlipped(!isFlipped);
    
    // Track flashcard review when flipping to answer
    if (!isFlipped) {
      try {
        await updateProgress('flashcard', { count: 1 });
      } catch (error) {
        console.error('Error updating flashcard progress:', error);
      }
    }
  };

  const nextCard = () => {
    if (flashcards && currentCardIndex < flashcards.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const resetCards = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  if (!fileId) {
    return (
      <div className="card">
        <h2>👧 Flashcards</h2>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <p>Please select a file from the Upload tab to view flashcards</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card">
        <h2>👧 Flashcards</h2>
        <div className="loading">
          <div className="spinner"></div>
          <p>Generating flashcards with AI...</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2>👧 Flashcards</h2>
        <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>
          <p>❌ {error}</p>
          <button onClick={fetchFlashcards} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!flashcards || !flashcards.cards || flashcards.cards.length === 0) {
    return (
      <div className="card">
        <h2>👧 Flashcards</h2>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <p>No flashcards available</p>
        </div>
      </div>
    );
  }

  const currentCard = flashcards.cards[currentCardIndex];

  return (
    <div className="card">
      <h2>👧 Flashcards</h2>
      
      <div className="flashcard-container">
        <div className="flashcard">
          <div 
            className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}
            onClick={handleCardClick}
          >
            <div className="flashcard-front">
              <div>
                <h3 style={{ marginBottom: '1rem' }}>Question</h3>
                <p style={{ fontSize: '1.1rem' }}>{currentCard.question}</p>
                <p style={{ marginTop: '2rem', fontSize: '0.9rem', opacity: 0.8 }}>
                  Click to reveal answer
                </p>
              </div>
            </div>
            
            <div className="flashcard-back">
              <div>
                <h3 style={{ marginBottom: '1rem' }}>Answer</h3>
                <p style={{ fontSize: '1.1rem' }}>{currentCard.answer}</p>
                <p style={{ marginTop: '2rem', fontSize: '0.9rem', opacity: 0.8 }}>
                  Click to see question
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flashcard-controls">
          <button 
            onClick={prevCard}
            disabled={currentCardIndex === 0}
            className="btn btn-secondary"
          >
            ← Previous
          </button>
          
          <div className="flashcard-counter">
            {currentCardIndex + 1} / {flashcards.cards.length}
          </div>
          
          <button 
            onClick={nextCard}
            disabled={currentCardIndex === flashcards.cards.length - 1}
            className="btn btn-secondary"
          >
            Next →
          </button>
          
          <button 
            onClick={resetCards}
            className="btn btn-primary"
          >
            🔄 Reset
          </button>
        </div>
        
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '4px',
          fontSize: '0.9rem',
          color: '#666',
          textAlign: 'center'
        }}>
          <p>💡 <strong>Study Tip:</strong> Try to answer each question before flipping the card!</p>
        </div>
      </div>
    </div>
  );
};

export default FlashcardView;