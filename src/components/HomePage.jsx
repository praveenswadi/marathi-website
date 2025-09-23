import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllCollections } from '../data/index'
import { hasManuscripts } from '../utils/manuscriptUtils'
import './HomePage.css'

const HomePage = () => {
  const collections = getAllCollections()
  const [manuscriptAvailability, setManuscriptAvailability] = useState({})

  useEffect(() => {
    const checkManuscripts = async () => {
      const availability = {}
      for (const collection of collections) {
        availability[collection.id] = await hasManuscripts(collection.id)
      }
      setManuscriptAvailability(availability)
    }
    checkManuscripts()
  }, [collections])

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Sanskrit Verses Collection</h1>
        <p className="home-subtitle">Explore traditional Sanskrit verses with Marathi translations</p>
      </div>
      
      <div className="collections-grid">
        {collections.filter(collection => collection.category === 'sanskrit').map((collection) => (
          <Link 
            key={collection.id} 
            to={`/verse/${collection.id}`}
            className="collection-card"
          >
            <div className="collection-content">
              <h3 className="collection-title">{collection.title}</h3>
              <p className="collection-description">{collection.description}</p>
              <div className="collection-arrow">→</div>
              {manuscriptAvailability[collection.id] && (
                <div className="manuscript-link-inline">
                  <Link 
                    to={`/manuscripts/${collection.id}`}
                    className="manuscript-link-simple"
                    title="View original manuscript"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Manuscript
                  </Link>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="administration-section">
        <h2 className="administration-title">मराठी आरत्या आणि स्तोत्रे</h2>
        <div className="administration-grid">
          {collections
            .filter(collection => collection.category === 'marathi')
            .map((collection) => (
              <Link 
                key={collection.id} 
                to={`/verse/${collection.id}`}
                className="collection-card"
              >
                <div className="collection-content">
                  <h3 className="collection-title">{collection.title}</h3>
                  <p className="collection-description">{collection.description}</p>
                  <div className="collection-arrow">→</div>
                  {manuscriptAvailability[collection.id] && (
                    <div className="manuscript-link-inline">
                      <Link 
                        to={`/manuscripts/${collection.id}`}
                        className="manuscript-link-simple"
                        title="View original manuscript"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Manuscript
                      </Link>
                    </div>
                  )}
                </div>
              </Link>
            ))}
        </div>
      </div>
      
      <div className="administration-section">
        <h2 className="administration-title">Administration</h2>
        <div className="administration-grid">
          <Link 
            to="/timing-editor"
            className="collection-card timing-editor-card"
          >
            <div className="collection-content">
              <h3 className="collection-title">🎵 Audio Timing Editor</h3>
              <p className="collection-description">Create precise timing for audio verses</p>
              <div className="collection-arrow">→</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
