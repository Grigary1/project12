import React from 'react'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AddUserForm from './components/AddUserForm'
import Home from './pages/Home'
import UserTable from './components/UserTable'
import Stats from './pages/Stats'

const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
      <Route path='/' element={<Stats/>}/>
      <Route path='/addDetails' element={<AddUserForm/>}/>
      <Route path='/table' element={<UserTable/>}/>
      </Routes>
    </div>
  )
}

export default App
