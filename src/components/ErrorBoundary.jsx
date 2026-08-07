import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false, errorMessage: '' }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || 'Unknown application error.' }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, textAlign: 'center' }}>
          <div>
            <p className="kicker">SOMETHING WENT WRONG</p>
            <h1>We couldn’t load this page.</h1>
            <p style={{ color: '#526075' }}>Please refresh the page. Your saved content has not been deleted.</p>
            {import.meta.env.DEV && <p style={{ maxWidth: 620, margin: '16px auto', color: '#b91c1c', fontSize: 13 }}>{this.state.errorMessage}</p>}
            <button className="primary" type="button" onClick={() => window.location.reload()}>Refresh page</button>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}
