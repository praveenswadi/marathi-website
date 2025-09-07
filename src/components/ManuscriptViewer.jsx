import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCollectionById } from '../data/index'
import './ManuscriptViewer.css'

const ManuscriptViewer = () => {
  const { collectionId } = useParams()
  const [manifest, setManifest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [error, setError] = useState(null)

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
    }
  }

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const goToImage = (index) => {
    setCurrentIndex(index)
  }

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
