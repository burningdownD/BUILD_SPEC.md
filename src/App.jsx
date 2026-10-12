import { NavLink, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CoursePage from './pages/CoursePage'
import EnterScorePage from './pages/EnterScorePage'
import AdminPage from './pages/AdminPage'

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container nav-wrap">
          <div className="brand">Indoor-Golfliga</div>
          <nav className="main-nav">
            <NavLink to="/">Start</NavLink>
            <NavLink to="/18-loch">18-Loch</NavLink>
            <NavLink to="/par3">Par3</NavLink>
            <NavLink to="/ergebnis-eingeben">Ergebnis</NavLink>
            <NavLink to="/admin">Admin</NavLink>
          </nav>
        </div>
      </header>

      <main className="container page-shell">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/18-loch" element={<HomePage type="18-hole" />} />
          <Route path="/par3" element={<HomePage type="short/par3" />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
          <Route path="/ergebnis-eingeben" element={<EnterScorePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  )
}
