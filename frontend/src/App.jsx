import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/main'
import Dashboard from './pages/root'
import Expenses from './pages/expenses'
import Budgets from './pages/budgets'
import Profile from './pages/profile'

import './App.css'
import Login from './components/Login'
import Signup from './components/Signup'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes for authenticated users */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="budgets" element={<Budgets />} />
          <Route path="profile" element={<Profile />} />
          {/* Add more routes here */}
        </Route>

        {/* Routes for login/signup pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
