import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'

function App() {
  const [ count, setCount ] = useState(0)
  const [ code, setCode ] = useState(` function sum() {
  return 1 + 1
}`)

  const [ review, setReview ] = useState(``)

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    try {
      if (!code || code.trim() === '') {
        setReview('**Error:** Please enter some code to review')
        return
      }
      
      setReview('Loading review...')
      const defaultApiUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:3000/ai/get-review'
        : 'https://vercel-backend-five-red.vercel.app/ai/get-review'
      const apiUrl = import.meta.env.VITE_API_URL || defaultApiUrl
      const response = await axios.post(apiUrl, {
        code: code.trim()
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      setReview(response.data)
    } catch (error) {
      console.error('Error reviewing code:', error)
      
      let errorMessage = 'Failed to get review'
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.error || error.response.data || `Server error: ${error.response.status}`
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please try again later.'
      } else {
        // Error in setting up the request
        errorMessage = error.message || 'Failed to send request'
      }
      
      setReview(`**Error:** ${errorMessage}`)
    }
  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={20}
              style={{
                fontFamily: '"Fira Code", "Fira Mono", "Courier New", monospace',
                fontSize: 14,
                lineHeight: 1.6,
                height: "100%",
                width: "100%",
                backgroundColor: "#0c0c0c",
                color: "#f8f8f2",
                outline: "none",
                border: "none"
              }}
            />
          </div>
          <div
            onClick={reviewCode}
            className="review">Review</div>
        </div>
        <div className="right">
          <Markdown

            rehypePlugins={[ rehypeHighlight ]}

          >{review}</Markdown>
        </div>
      </main>
    </>
  )
}



export default App