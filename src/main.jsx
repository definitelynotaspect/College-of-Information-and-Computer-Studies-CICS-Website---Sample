import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import { ContentProvider } from './context/ContentContext'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <ContentProvider>
          <App />
        </ContentProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
