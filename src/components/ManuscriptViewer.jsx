import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCollectionById } from '../data/index'
import { useDeviceDetection } from '../utils/useDeviceDetection'
import './ManuscriptViewer.css'

const ManuscriptViewer = () => {
  const { collectionId } = useParams()
  const [manifest, setManifest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [error, setError] = useState(null)
  const [showOverlay, setShowOverlay] = useState(true)
  const [showHint, setShowHint] = useState(true)
  const [zoomMode, setZoomMode] = useState('fit-screen') // 'fit-screen' or 'fit-width'
  const [showZoomIndicator, setShowZoomIndicator] = useState(false)
  
  // Device detection
  const isMobile = useDeviceDetection()

  useEffect(() => {
    const loadManifest = async () => {
      try {
        const collection = getCollectionById(collectionId)
        if (!collection) {
          throw new Error('Collection not found')
        }

        // Try to load the manifest file
        const response = await fetch(`/manuscripts/${collectionId}/manifest.json`)
        if (!response.ok) {
          throw new Error('Manifest not found')
        }
        
        const manifestData = await response.json()
        setManifest(manifestData)
      } catch (err) {
        console.error('Error loading manifest:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadManifest()
  }, [collectionId])

  const nextImage = () => {
    if (manifest && currentIndex < manifest.images.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowOverlay(true) // Show overlay briefly when navigating
    }
  }

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowOverlay(true) // Show overlay briefly when navigating
    }
  }

  // Preload adjacent images for smooth swiping
  useEffect(() => {
    if (manifest && manifest.images) {
      // Preload next image
      if (currentIndex < manifest.images.length - 1) {
        const nextImg = new Image()
        nextImg.src = manifest.images[currentIndex + 1].url
      }
      // Preload previous image
      if (currentIndex > 0) {
        const prevImg = new Image()
        prevImg.src = manifest.images[currentIndex - 1].url
      }
    }
  }, [currentIndex, manifest])

  const goToImage = (index) => {
    setCurrentIndex(index)
  }

  // Touch gesture handling
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [lastTap, setLastTap] = useState(0)

  const minSwipeDistance = 50
  const doubleTapDelay = 300 // milliseconds

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextImage()
      hideHint()
    } else if (isRightSwipe) {
      prevImage()
      hideHint()
    }
  }

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay)
  }

  const hideHint = () => {
    setShowHint(false)
  }

  const toggleZoomMode = () => {
    setZoomMode(prev => prev === 'fit-screen' ? 'fit-width' : 'fit-screen')
    setShowZoomIndicator(true)
    hideHint()
    
    // Hide zoom indicator after 2 seconds
    setTimeout(() => {
      setShowZoomIndicator(false)
    }, 2000)
  }

  const handleImageClick = (e) => {
    const now = Date.now()
    const timeSinceLastTap = now - lastTap
    
    if (timeSinceLastTap < doubleTapDelay && timeSinceLastTap > 0) {
      // Double tap detected
      e.preventDefault()
      toggleZoomMode()
    } else {
      // Single tap - toggle overlay
      toggleOverlay()
    }
    
    setLastTap(now)
  }

  // Auto-hide overlay after 3 seconds
  useEffect(() => {
    if (showOverlay) {
      const timer = setTimeout(() => {
        setShowOverlay(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showOverlay, currentIndex])

  // Hide hint after first interaction
  useEffect(() => {
    if (showHint) {
      const timer = setTimeout(() => {
        setShowHint(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showHint])

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        prevImage()
        break
      case 'ArrowRight':
        nextImage()
        break
      case 'Escape':
        window.close()
        break
      default:
        break
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex])

  if (loading) {
    return (
      <div className="manuscript-loading">
        <div className="loading-spinner"></div>
        <p>Loading manuscript...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="manuscript-error">
        <h2>Manuscript Not Available</h2>
        <p>{error}</p>
        <Link to="/" className="back-button">← Back to Home</Link>
      </div>
    )
  }

  if (!manifest || manifest.images.length === 0) {
    return (
      <div className="manuscript-error">
        <h2>No Manuscript Available</h2>
        <p>No manuscript images found for this collection.</p>
        <Link to="/" className="back-button">← Back to Home</Link>
      </div>
    )
  }

  const currentImage = manifest.images[currentIndex]

  // Render mobile version
  if (isMobile) {
    return (
      <div className="mobile-manuscript-viewer">
        <div 
          className={`mobile-manuscript-container ${zoomMode}`}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <img
            src={currentImage.url}
            alt={currentImage.title}
            className={`mobile-manuscript-image ${zoomMode}`}
            onClick={handleImageClick}
            onError={(e) => {
              console.error('Failed to load image:', currentImage.filename)
            }}
          />

          {/* Minimal Overlay */}
          <div className={`mobile-overlay ${showOverlay ? '' : 'hidden'}`}>
            <Link to="/" className="mobile-back-button">
              ← Back
            </Link>
            <div className="mobile-page-counter">
              {currentIndex + 1} / {manifest.images.length}
            </div>
          </div>

          {/* Touch Areas for Tap Navigation */}
          <div 
            className="mobile-touch-area left"
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
              hideHint()
            }}
          />
          <div 
            className="mobile-touch-area right"
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
              hideHint()
            }}
          />

          {/* Zoom Indicator */}
          <div className={`mobile-zoom-indicator ${showZoomIndicator ? 'show' : ''}`}>
            {zoomMode === 'fit-width' ? '📖 Reading Mode' : '🔍 Overview Mode'}
          </div>

          {/* Swipe Hint */}
          {showHint && (
            <div className="mobile-swipe-hint">
              Swipe left/right to navigate<br />
              Double-tap to zoom • Tap to show/hide controls
            </div>
          )}
        </div>
      </div>
    )
  }

  // Render desktop version
  return (
    <div className="manuscript-viewer">
      <div className="manuscript-header">
        <Link to="/" className="back-link">← Back to Collections</Link>
        <h1 className="manuscript-title">{manifest.title}</h1>
        <div className="manuscript-info">
          <span className="page-counter">
            {currentIndex + 1} of {manifest.images.length}
          </span>
        </div>
      </div>

      <div className="manuscript-container">
        <div className="manuscript-controls">
          <button 
            className="nav-button prev-button" 
            onClick={prevImage}
            disabled={currentIndex === 0}
            title="Previous page (←)"
          >
            ←
          </button>
          
          <div className="image-title-section">
            <h3 className="image-title">{currentImage.title}</h3>
            <p className="image-description">{currentImage.description}</p>
            <p className="image-filename">{currentImage.filename}</p>
          </div>
          
          <div className="image-container">
            <img
              src={currentImage.url}
              alt={currentImage.title}
              className="manuscript-image"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'block'
              }}
            />
            <div className="image-error" style={{ display: 'none' }}>
              <p>Image could not be loaded</p>
              <p>{currentImage.filename}</p>
            </div>
          </div>
          
          <button 
            className="nav-button next-button" 
            onClick={nextImage}
            disabled={currentIndex === manifest.images.length - 1}
            title="Next page (→)"
          >
            →
          </button>
        </div>

        <div className="manuscript-thumbnails">
          {manifest.images.map((image, index) => (
            <button
              key={image.id}
              className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToImage(index)}
              title={`Go to page ${index + 1}`}
            >
              <img
                src={image.url}
                alt={image.title}
                className="thumbnail-image"
              />
              <span className="thumbnail-number">{index + 1}</span>
            </button>
          ))}
        </div>

      </div>

      <div className="manuscript-footer">
        <div className="keyboard-shortcuts">
          <p>Keyboard shortcuts: ← → (navigate), Esc (close)</p>
        </div>
      </div>
    </div>
  )
}

export default ManuscriptViewer
