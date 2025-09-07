import React from 'react'
import { Link } from 'react-router-dom'
import { getAllCollections } from '../data/index'
import './HomePage.css'

const HomePage = () => {
  const collections = getAllCollections()

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Sanskrit Verses Collection</h1>
        <p className="home-subtitle">Explore traditional Sanskrit verses with Marathi translations</p>
      </div>
      
      <div className="collections-grid">
        {collections.map((collection) => (
          <Link 
            key={collection.id} 
            to={`/verse/${collection.id}`}
            className="collection-card"
          >
            <div className="collection-content">
              <h3 className="collection-title">{collection.title}</h3>
              <p className="collection-description">{collection.description}</p>
              <div className="collection-arrow">→</div>
            </div>
          </Link>
        ))}
        
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
  )
}

export default HomePage
