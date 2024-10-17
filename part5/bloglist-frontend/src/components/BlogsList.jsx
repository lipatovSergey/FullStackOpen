import { useState, useEffect } from 'react'
import Blog from './Blog'

const BlogsList = ({ blogs, user, handleLogout, handleBlogDelete }) => {
  const [displayedBlogs, setDisplayedBlogs] = useState([])
  const [isDescending, setIsDescending] = useState(true)

  // Use effect to update the displayedBlogs state when blogs prop changes
  useEffect(() => {
    if (blogs) {
      setDisplayedBlogs(blogs)
    }
  }, [blogs])

  const handleSort = () => {
    let sorted
    if (isDescending) {
      sorted = [...displayedBlogs].sort((a, b) => b.likes - a.likes)
    } else {
      sorted = [...displayedBlogs].sort((a, b) => a.likes - b.likes)
    }
    setDisplayedBlogs(sorted)
    setIsDescending(!isDescending)
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{`${user.name} logged in`}</p>
      <button onClick={handleLogout}>logout</button>
      <button onClick={handleSort}>sort by likes</button>
      {displayedBlogs.length > 0 ? (
        displayedBlogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            showDeleteButton={blog.user.username === user.username}
            handleBlogDelete={handleBlogDelete}
          />
        ))
      ) : (
        <p>No blogs available</p>
      )}
    </div>
  )
}

export default BlogsList
