import React, { useState, useRef, useEffect } from 'react'
import './TimingEditor.css'

const TimingEditor = () => {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [timings, setTimings] = useState({})
  const [selectedVerse, setSelectedVerse] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [availableCollections, setAvailableCollections] = useState([])
  const [selectedCollection, setSelectedCollection] = useState(null)
  const [collectionData, setCollectionData] = useState(null)
  const [audioFile, setAudioFile] = useState(null)
  const [clickTimeout, setClickTimeout] = useState(null)
  const [autoscroll, setAutoscroll] = useState(true)
  const [currentVerseId, setCurrentVerseId] = useState(null)

  // Load available collections on component mount
  useEffect(() => {
    const loadAvailableCollections = async () => {
      try {
        // Get list of JSON files from the data directory
        const jsonFiles = [
          'atharvashirsha.json',
          'atharvashirsha-phalashruti.json', 
          'gayatri.json',
          'mahamrityunjaya.json'
        ]
        
        const collections = []
        
        for (const jsonFile of jsonFiles) {
          try {
            const response = await fetch(`/src/data/${jsonFile}`)
            if (response.ok) {
              const data = await response.json()
              const baseName = jsonFile.replace('.json', '')
              
              // Check for corresponding audio files
              const audioExtensions = ['mp3', 'm4a', 'wav', 'ogg', 'aac']
              let audioFile = null
              
              for (const ext of audioExtensions) {
                try {
                  const audioResponse = await fetch(`/src/data/${baseName}.${ext}`, { method: 'HEAD' })
                  if (audioResponse.ok) {
                    audioFile = `${baseName}.${ext}`
                    break
                  }
                } catch (e) {
                  // Continue to next extension
                }
              }
              
              if (audioFile) {
                collections.push({
                  id: baseName,
                  title: data.title || baseName,
                  jsonFile: jsonFile,
                  audioFile: audioFile,
                  verseCount: data.verses ? data.verses.length : 0
                })
              }
            }
          } catch (error) {
            console.log(`Could not load ${jsonFile}:`, error)
          }
        }
        
        setAvailableCollections(collections)
        
        // Auto-select first collection if available
        if (collections.length > 0) {
          setSelectedCollection(collections[0].id)
        }
      } catch (error) {
        console.error('Error loading collections:', error)
      }
    }
    
    loadAvailableCollections()
  }, [])

  // Load collection data when selection changes
  useEffect(() => {
    if (selectedCollection) {
      const collection = availableCollections.find(c => c.id === selectedCollection)
      if (collection) {
        loadCollectionData(collection)
      }
    }
  }, [selectedCollection, availableCollections])

  const loadCollectionData = async (collection) => {
    try {
      const response = await fetch(`/src/data/${collection.jsonFile}`)
      if (response.ok) {
        const data = await response.json()
        setCollectionData(data)
        setAudioFile(collection.audioFile)
        
        // Load existing timings for this collection
        loadExistingTimings(collection.id)
      }
    } catch (error) {
      console.error('Error loading collection data:', error)
    }
  }

  const loadExistingTimings = async (collectionId) => {
    try {
      const response = await fetch(`/timing-${collectionId}.json`)
      if (response.ok) {
        const data = await response.json()
        const timingsMap = {}
        data.verses.forEach(verse => {
          timingsMap[verse.id] = {
            start_time: verse.start_time,
            end_time: verse.end_time
          }
        })
        setTimings(timingsMap)
      } else {
        setTimings({})
      }
    } catch (error) {
      console.log(`No existing timing file found for ${collectionId}, starting fresh`)
      setTimings({})
    }
  }

  // Update current time while playing
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      const time = audio.currentTime
      setCurrentTime(time)
      
      // Find current verse based on timing
      if (collectionData && collectionData.verses) {
        const currentVerse = collectionData.verses.find(verse => {
          const timing = timings[verse.id]
          return timing && time >= timing.start_time && time <= timing.end_time
        })
        
        if (currentVerse && currentVerse.id !== currentVerseId) {
          setCurrentVerseId(currentVerse.id)
          
          // Autoscroll to current verse
          if (autoscroll) {
            const verseElement = document.getElementById(`verse-${currentVerse.id}`)
            if (verseElement) {
              const container = verseElement.closest('.verses-list')
              if (container) {
                const containerRect = container.getBoundingClientRect()
                const elementRect = verseElement.getBoundingClientRect()
                const elementTop = elementRect.top - containerRect.top + container.scrollTop
                const elementHeight = elementRect.height
                const containerHeight = containerRect.height
                
                // Calculate scroll position to center the element with one before and after visible
                const scrollPosition = elementTop - (containerHeight / 2) + (elementHeight / 2)
                
                // Check if we're near the end of the list
                const maxScroll = container.scrollHeight - containerHeight
                const finalScrollPosition = Math.min(Math.max(0, scrollPosition), maxScroll)
                
                container.scrollTo({
                  top: finalScrollPosition,
                  behavior: 'smooth'
                })
              }
            }
          }
        }
      }
    }
    
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', () => setIsPlaying(false))

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', () => setIsPlaying(false))
    }
  }, [collectionData, timings, autoscroll, currentVerseId])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeout) {
        clearTimeout(clickTimeout)
      }
    }
  }, [clickTimeout])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const seekTo = (time) => {
    const audio = audioRef.current
    audio.currentTime = time
    setCurrentTime(time)
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleVerseClick = (verseId) => {
    if (!isRecording) return

    const time = currentTime
    
    setTimings(prev => {
      const newTimings = { ...prev }
      if (!newTimings[verseId]) {
        newTimings[verseId] = { start_time: 0, end_time: 0 }
      }
      
      if (selectedVerse === verseId) {
        // Set end time for the same verse
        newTimings[verseId].end_time = time
        setSelectedVerse(null)
      } else {
        // If there was a previously selected verse, end it at the current time
        if (selectedVerse && newTimings[selectedVerse]) {
          newTimings[selectedVerse].end_time = time
        }
        
        // Set start time for new verse
        newTimings[verseId].start_time = time
        setSelectedVerse(verseId)
      }
      
      return newTimings
    })
  }

  const handleVerseDoubleClick = (verseId) => {
    // Clear the single click timeout
    if (clickTimeout) {
      clearTimeout(clickTimeout)
      setClickTimeout(null)
    }

    const time = currentTime
    
    setTimings(prev => {
      const newTimings = { ...prev }
      
      // If there was a previously selected verse, end it at the current time
      if (selectedVerse && newTimings[selectedVerse]) {
        newTimings[selectedVerse].end_time = time
      }
      
      // Set timing for double-clicked verse
      newTimings[verseId] = {
        start_time: time,
        end_time: time + 5 // Default 5 second duration
      }
      
      return newTimings
    })
    setSelectedVerse(null)
  }

  const clearTiming = (verseId) => {
    setTimings(prev => {
      const newTimings = { ...prev }
      delete newTimings[verseId]
      return newTimings
    })
  }

  const exportTimings = () => {
    if (!collectionData || !collectionData.verses) return
    
    const verses = collectionData.verses.map(verse => ({
      id: verse.id,
      start_time: timings[verse.id]?.start_time || 0,
      end_time: timings[verse.id]?.end_time || 0,
      sanskrit: verse.sanskrit
    }))

    const dataStr = JSON.stringify({ verses }, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `timing-${selectedCollection}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getVerseStatus = (verseId) => {
    const timing = timings[verseId]
    if (!timing) return 'not-set'
    if (timing.start_time > 0 && timing.end_time > 0) return 'complete'
    if (timing.start_time > 0) return 'partial'
    return 'not-set'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete': return '#4CAF50'
      case 'partial': return '#FF9800'
      default: return '#E0E0E0'
    }
  }

  if (!availableCollections.length) {
    return (
      <div className="timing-editor">
        <div className="timing-header">
          <h1>Audio Timing Editor</h1>
          <p>Loading available collections...</p>
        </div>
      </div>
    )
  }

  if (!collectionData) {
    return (
      <div className="timing-editor">
        <div className="timing-header">
          <h1>Audio Timing Editor</h1>
          <p>Loading collection data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="timing-editor">
      <audio
        ref={audioRef}
        src={`/src/data/${audioFile}`}
        preload="metadata"
      />
      
      {/* Full-width timeline */}
      <div className="timeline-container">
        <div className="timeline">
          <div className="timeline-track">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={(e) => seekTo(parseFloat(e.target.value))}
              className="timeline-slider"
            />
            <div className="timeline-progress" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}></div>
          </div>
          <div className="timeline-labels">
            <span className="timeline-start">{formatTime(currentTime)}</span>
            <span className="timeline-end">{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Tape recorder controls */}
      <div className="tape-controls">
        <div className="control-group">
          <button 
            className={`tape-button play ${isPlaying ? 'active' : ''}`}
            onClick={togglePlayPause}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          
          <button 
            className={`tape-button record ${isRecording ? 'active' : ''}`}
            onClick={() => setIsRecording(!isRecording)}
            title={isRecording ? 'Stop Recording' : 'Start Recording'}
          >
            {isRecording ? '⏹' : '⏺'}
          </button>
          
          <button 
            className="tape-button stop"
            onClick={() => {
              const audio = audioRef.current
              if (audio) {
                audio.pause()
                audio.currentTime = 0
                setIsPlaying(false)
              }
            }}
            title="Stop"
          >
            ⏹
          </button>
        </div>
        
        <div className="control-group">
          <label className="autoscroll-toggle">
            <input
              type="checkbox"
              checked={autoscroll}
              onChange={(e) => setAutoscroll(e.target.checked)}
            />
            <span className="autoscroll-label">Autoscroll ↓</span>
          </label>
          
          <select
            value={selectedCollection || ''}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="collection-select"
          >
            {availableCollections.map(collection => (
              <option key={collection.id} value={collection.id}>
                {collection.title}
              </option>
            ))}
          </select>
        </div>
        
        <div className="control-group">
          <button
            className="export-button"
            onClick={exportTimings}
            disabled={Object.keys(timings).length === 0}
            title="Export timing.json"
          >
            📥 Export
          </button>
        </div>
      </div>

      {/* Verses list */}
      <div className="verses-container">
        <div className="verses-list">
          {collectionData.verses.map((verse) => {
            const status = getVerseStatus(verse.id)
            const timing = timings[verse.id]
            const isSelected = selectedVerse === verse.id
            const isCurrent = currentVerseId === verse.id
            
            return (
              <div
                key={verse.id}
                id={`verse-${verse.id}`}
                className={`verse-item ${status} ${isSelected ? 'selected' : ''} ${isCurrent ? 'current' : ''}`}
                onClick={() => handleVerseClick(verse.id)}
                onDoubleClick={() => handleVerseDoubleClick(verse.id)}
              >
                <div className="verse-number">#{verse.id}</div>
                <div className="verse-content">
                  <div className="verse-text">
                    <div className="sanskrit-text">{verse.sanskrit}</div>
                    <div className="marathi-text">{verse.marathi}</div>
                  </div>
                  <div className="verse-timing">
                    {timing ? (
                      <span className="timing-display">
                        {formatTime(timing.start_time)} - {formatTime(timing.end_time)}
                      </span>
                    ) : (
                      <span className="timing-placeholder">
                        {isRecording ? (isSelected ? 'Click again for end' : 'Click for start') : 'Not timed'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TimingEditor
