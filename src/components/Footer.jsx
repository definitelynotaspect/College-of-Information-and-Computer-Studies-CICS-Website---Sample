import { useLocation } from 'react-router-dom'
import cicsLogo from '../assets/cics-logo.png'

export default function Footer() {
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin') || location.pathname.startsWith('/faculty')

  if (isDashboard) return null

  return (
    <footer id="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <img src={cicsLogo} alt="CICS seal" />
          <span>
            College of Information
            <br/>
            and Computer Studies
          </span>
        </div>
        <span>
          Interworld Colleges Foundation, Inc. · Burgos Street,
          Poblacion Norte, Paniqui, Tarlac, 2307
        </span>
        <a href="https://www.facebook.com/share/19DAZfUHJK/">Facebook</a>
      </div>
    </footer>
  )
}
