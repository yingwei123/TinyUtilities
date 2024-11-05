import { useState } from 'react'
import './App.css'
import './style/home.css'
import HomePage from './js/HomePage.jsx'

function App() {
  const [activeContent, setActiveContent] = useState('tinyurl')

  const handleContentChange = (content) => {
    setActiveContent(content)
  }

  return (
    <div className="app-container">
      <HomePage activeContent={activeContent} onContentChange={handleContentChange} />
    </div>
  )
}

export default App
