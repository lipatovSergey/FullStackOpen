import { useUser } from '../contexts/UserContext'
import { useEffect } from 'react'
import loginService from '../services/login'

const CurrentUser = () => {
  const { user, dispatch } = useUser()

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    if (window.localStorage.getItem('loggedBlogUser') === null) {
      dispatch({ type: 'LOGOUT' })
    } else {
      console.error('Fail')
    }
  }

  return (
    <>
      <p>{`${user.name} logged in`}</p>
      <button onClick={handleLogout}>logout</button>
    </>
  )
}

export default CurrentUser
