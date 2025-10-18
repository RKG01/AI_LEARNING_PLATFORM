import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useProgress } from '../contexts/ProgressContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const SummaryView = ({ fileId }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Voice narration states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  const utteranceRef = useRef(null);
  const { updateProgress } = useProgress();

  const fetchSummary = async () => {
    if (!fileId) return;
    
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`${API_BASE_URL}/summary/${fileId}`);
      setSummary(response.data);
      
      // Update progress tracking for summary generation
      try {
        await updateProgress('summary');
      } catch (error) {
        console.error('Error updating summary progress:', error);
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
      setError(err.response?.data?.error || 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      const englishVoices = availableVoices.filter(voice => 
        voice.lang.startsWith('en')
      );
      setVoices(englishVoices);
      
      // Set default voice (prefer female voice for kawaii theme)
      const defaultVoice = englishVoices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('zira') ||
        voice.name.toLowerCase().includes('samantha')
      ) || englishVoices[0];
      
      setSelectedVoice(defaultVoice);
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (fileId) {
      fetchSummary();
    } else {
      setSummary(null);
      setError('');
      stopSpeech(); // Stop speech when changing files
    }
  }, [fileId]);

  // Voice control functions
  const playSummary = () => {
    if (!summary || !selectedVoice) return;
    
    // Stop any existing speech
    speechSynthesis.cancel();
    
    // Prepare text to speak
    let textToSpeak = summary.content || '';
    if (summary.topics && summary.topics.length > 0) {
      textToSpeak += '. Key topics include: ';
      summary.topics.forEach((topic, index) => {
        textToSpeak += `${topic.title}. ${topic.content}. `;
      });
    }
    
    // Create utterance
    utteranceRef.current = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current.voice = selectedVoice;
    utteranceRef.current.rate = speechRate;
    utteranceRef.current.pitch = speechPitch;
    utteranceRef.current.volume = 1;
    
    // Event handlers
    utteranceRef.current.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };
    
    utteranceRef.current.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };
    
    utteranceRef.current.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };
    
    // Start speaking
    speechSynthesis.speak(utteranceRef.current);
  };

  const pauseSpeech = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsPaused(true);
    } else if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stopSpeech = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleVoiceChange = (e) => {
    const voiceName = e.target.value;
    const voice = voices.find(v => v.name === voiceName);
    setSelectedVoice(voice);
  };

  if (!fileId) {
    return (
      <div className="card">
        <h2>👩‍🏫 Summary</h2>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <p>Please select a file from the Upload tab to view its summary</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card">
        <h2>👩‍🏫 Summary</h2>
        <div className="loading">
          <div className="spinner"></div>
          <p>Generating summary with AI...</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2>👩‍🏫 Summary</h2>
        <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>
          <p>❌ {error}</p>
          <button onClick={fetchSummary} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="card">
        <h2>👩‍🏫 Summary</h2>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <p>No summary available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="summary-container">
      <div className="card">
        <h2>👩‍🏫 Summary</h2>
        
        {/* Voice Narration Controls */}
        <div className="voice-controls">
          <div className="voice-controls-header">
            <h3>🎤 Voice Narration</h3>
            <div className={`sound-wave ${isPlaying ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          
          <div className="voice-settings">
            <div className="voice-select">
              <label>👩‍🎤 Voice:</label>
              <select 
                value={selectedVoice?.name || ''} 
                onChange={handleVoiceChange}
                className="voice-dropdown"
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.gender || 'Unknown'})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="voice-controls-buttons">
              <button
                onClick={playSummary}
                disabled={!summary || isPlaying}
                className={`btn voice-btn ${isPlaying ? 'btn-speaking' : 'btn-primary'}`}
              >
                {isPlaying ? '🎙️ Speaking...' : '▶️ Play Summary'}
              </button>
              
              <button
                onClick={pauseSpeech}
                disabled={!isPlaying}
                className="btn btn-secondary voice-btn"
              >
                {isPaused ? '▶️ Resume' : '⏸️ Pause'}
              </button>
              
              <button
                onClick={stopSpeech}
                disabled={!isPlaying && !isPaused}
                className="btn btn-secondary voice-btn"
              >
                ⏹️ Stop
              </button>
            </div>
          </div>
          
          <div className="voice-sliders">
            <div className="slider-group">
              <label>🏃‍♀️ Speed: {speechRate.toFixed(1)}x</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="voice-slider"
              />
            </div>
            
            <div className="slider-group">
              <label>🎵 Pitch: {speechPitch.toFixed(1)}</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speechPitch}
                onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                className="voice-slider"
              />
            </div>
          </div>
        </div>
        
        {summary.content && (
          <div className="summary-content">
            <h3>Overview</h3>
            <p>{summary.content}</p>
          </div>
        )}
        
        {summary.topics && summary.topics.length > 0 && (
          <div className="topics-section">
            <h3>Key Topics</h3>
            {summary.topics.map((topic, index) => (
              <div key={index} className="topic-item">
                <div className="topic-title">{topic.title}</div>
                <div className="topic-content">{topic.content}</div>
              </div>
            ))}
          </div>
        )}
        
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '4px',
          fontSize: '0.9rem',
          color: '#666'
        }}>
          <p>💡 <strong>Tip:</strong> Use voice narration while reviewing flashcards for better learning!</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryView;