import React from 'react'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AddUserForm from './components/AddUserForm'
import Home from './pages/Home'
import UserTable from './components/UserTable'

const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/addDetails' element={<AddUserForm/>}/>
      <Route path='/table' element={<UserTable/>}/>
      </Routes>
    </div>
  )
}

export default App
