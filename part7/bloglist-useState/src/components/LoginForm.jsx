import { useState } from 'react'
import loginService from '../services/login'
import { useNotification } from '../contexts/NotificationContext'
import { useUser } from '../contexts/UserContext'

const LoginForm = () => {
  const { showNotification } = useNotification()
  const { dispatch } = useUser()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      dispatch({ type: 'LOGIN', payload: user })
      loginService.setToken(user.token)
      showNotification(`Logged in ${user.name}`, 'success')
      setUsername('')
      setPassword('')
    } catch (error) {
      let errorMessage = 'Something went wrong. Please try again.' // Default message
      if (error.response && error.response.status === 401) {
        errorMessage = 'Wrong username or password.'
      }
      showNotification(errorMessage, 'error')
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm
