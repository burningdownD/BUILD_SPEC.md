import React from 'react'
import HomePage from './pages/HomePage'
import CoursePage from './pages/CoursePage'
import EnterScorePage from './pages/EnterScorePage'
import AdminPage from './pages/AdminPage'

export default function App(){
  return (
    <div>
      <header style={{padding:20,background:'#0b3d27',color:'white'}}>
        <h1>Indoor-Golfliga</h1>
      </header>
      <main style={{padding:20}}>
        <HomePage />
        <hr />
        <EnterScorePage />
        <hr />
        <AdminPage />
      </main>
    </div>
  )
}
