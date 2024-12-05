import { useState, useMemo, useRef } from 'react'
import Blog from './Blog'
import { useBlogs } from '../hooks/useBlogs'
import Togglable from './Toggable'
import BlogCreateForm from './BlogCreateForm'
import { Link } from 'react-router-dom'

const BlogsList = ({ user, handleLogout }) => {
  const blogCreateFormRef = useRef()
  const { data: blogs } = useBlogs()
  const [isDescending, setIsDescending] = useState(true)

  const sortedBlogs = useMemo(() => {
    if (!blogs) return []
    return [...blogs].sort((a, b) =>
      isDescending ? b.likes - a.likes : a.likes - b.likes
    )
  }, [blogs, isDescending])

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div>
      <button onClick={() => setIsDescending(!isDescending)}>
        sort by likes
      </button>
      {sortedBlogs.length > 0 ? (
        sortedBlogs.map((blog) => (
          <div style={blogStyle} key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
          </div>
        ))
      ) : (
        <p>No blogs available</p>
      )}
      <Togglable buttonLabel="new blog" ref={blogCreateFormRef}>
        <BlogCreateForm
          toggleVisibility={() => blogCreateFormRef.current.toggleVisibility()}
        />
      </Togglable>
    </div>
  )
}

export default BlogsList
