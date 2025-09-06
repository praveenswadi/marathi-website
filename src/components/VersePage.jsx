import React, { useState } from 'react'
import AudioPlayer from './AudioPlayer'

const VersePage = ({ data }) => {
  const [playingVerse, setPlayingVerse] = useState(null)

  const handlePlay = (verseId) => {
    setPlayingVerse(playingVerse === verseId ? null : verseId)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">← {data.title} →</h1>
        <p className="page-subtitle">Sanskrit Verses with Marathi Translations</p>
      </div>
      
      <div className="verses-container">
        {data.verses.map((verse) => (
          <div key={verse.id} className="verse-item">
            <div className="verse-column">
              <h3 className="column-header">श्लोक</h3>
              <div className="sanskrit-text">
                {verse.sanskrit}
              </div>
              {verse.explanation && (
                <div className="explanation-text">
                  {verse.explanation}
                </div>
              )}
              <AudioPlayer 
                verseId={verse.id}
                isPlaying={playingVerse === verse.id}
                onPlay={() => handlePlay(verse.id)}
              />
            </div>
            
            <div className="verse-column">
              <h3 className="column-header">श्लोकार्थ</h3>
              <div className="marathi-text">
                {verse.marathi}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VersePage

