import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import BlogsList from './components/BlogsList'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import BlogCreateForm from './components/BlogCreateForm'
import Togglable from './components/Toggable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState({ text: null, type: null })
  const [user, setUser] = useState(null)

  const blogCreateFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (text, type) => {
    setNotification({
      text: text,
      type: type
    })

    setTimeout(() => {
      setNotification({ text: null, type: null })
    }, 5000)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    if (window.localStorage.getItem('loggedBlogUser') === null) {
      window.location.reload()
    } else {
      console.error('Fail')
    }
  }

  const createBlog = async (newBlog) => {
    try {
      const returnedBlog = await blogService.create(newBlog)
      console.log(returnedBlog)
      setBlogs(blogs.concat(returnedBlog))
      blogCreateFormRef.current.toggleVisibility()
      showNotification(`A new blog ${returnedBlog.title} added`, 'success')
    } catch (error) {
      console.log(error)
    }
  }

  const handleBlogDelete = async (id) => {
    const blogToDelete = blogs.find((blog) => blog.id === id)
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter((blog) => blog.id !== id))
        showNotification(`A blog ${blogToDelete.title} deleted`, 'success')
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleBlogLike = async (id) => {
    const likedBlog = blogs.find((blog) => blog.id === id)
    const updatedBlog = {
      ...likedBlog,
      likes: likedBlog.likes + 1
    }

    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      setBlogs(blogs.map((blog) => (blog.id === id ? returnedBlog : blog)))
    } catch (error) {
      console.error('Error updating likes', error)
    }
  }

  return (
    <>
      <Notification notification={notification} />
      {user === null ? (
        <LoginForm setUser={setUser} showNotification={showNotification} />
      ) : (
        <>
          <BlogsList
            blogs={blogs}
            user={user}
            handleLogout={handleLogout}
            handleBlogDelete={handleBlogDelete}
            handleBlogLike={handleBlogLike}
          />
          <Togglable buttonLabel="new blog" ref={blogCreateFormRef}>
            <BlogCreateForm createBlog={createBlog} />
          </Togglable>
        </>
      )}
    </>
  )
}

export default App
