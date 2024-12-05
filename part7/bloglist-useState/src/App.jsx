import { useEffect, useState } from 'react'
import loginService from './services/login'
import BlogsList from './components/BlogsList'
import LoginForm from './components/LoginForm'
import BlogInfo from './components/BlogInfo'
import Notification from './components/Notification'
import { useUser } from './contexts/UserContext'
import Users from './components/Users'
import CurrentUser from './components/CurrentUser'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Blog from './components/Blog'
const App = () => {
  const { user, dispatch } = useUser()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch({ type: 'LOGIN', payload: user })
      loginService.setToken(user.token)
    }
  }, [])
  return (
    <Router>
      <Notification />
      {user === null ? (
        <LoginForm />
      ) : (
        <>
          <h2>blogs</h2>
          <CurrentUser />
          <nav>
            <Link to="/">Blogs</Link> | <Link to="/users">Users</Link>
          </nav>
          <Routes>
            <Route path="/" element={<BlogsList user={user} />} />
            <Route path="/users" element={<Users />} />
            <Route path="/blogs/:id" element={<Blog />} />
          </Routes>
        </>
      )}
    </Router>
  )
}

export default App
