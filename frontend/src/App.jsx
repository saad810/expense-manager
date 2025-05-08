import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/main'
import Dashboard from './pages/root'
import Expenses from './pages/expenses'
import Budgets from './pages/budgets'
import Profile from './pages/profile'

import './App.css'
import Login from './components/Login'
import Signup from './components/Signup'
import Home from './pages/home'

import PrivateRoute from './components/PrivateRoute'
import News from './pages/news'

const App = () => {
  return (
    <Routes>
      <Route index element={<Home />} />

      {/* Private Route wrapper for all /app routes */}
      <Route path="app" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="budgets" element={<Budgets />} />
        <Route path="profile" element={<Profile />} />
        <Route path="news" element={<News />} />
      </Route>

      {/* Routes for login/signup pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>

  )
}

export default App
