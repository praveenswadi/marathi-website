import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import DynamicVersePage from './components/DynamicVersePage'
import TimingEditor from './components/TimingEditor'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/verse/:collectionId" element={<DynamicVersePage />} />
          <Route path="/timing-editor" element={<TimingEditor />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

