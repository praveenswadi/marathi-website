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
        {/* Sticky Column Headers */}
        <div className="sticky-headers">
          <div className="sticky-header-left">श्लोक</div>
          <div className="sticky-header-center">{data.title}</div>
          <div className="sticky-header-right">श्लोकार्थ</div>
        </div>
        
        {data.verses.map((verse) => (
          <div key={verse.id} className="verse-item">
            <div className="verse-column">
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

