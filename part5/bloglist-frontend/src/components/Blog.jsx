import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, showDeleteButton, handleBlogDelete, handleBlogLike }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)
  const showWhenVisible = { display: detailsVisible ? '' : 'none' }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setDetailsVisible(!detailsVisible)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>
          {detailsVisible ? 'hide' : 'view'}
        </button>
        {showDeleteButton && (
          <button
            onClick={() => {
              handleBlogDelete(blog.id)
            }}
          >
            delete
          </button>
        )}
      </div>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>
          {blog.likes}
          <button
            onClick={() => {
              handleBlogLike(blog.id)
            }}
          >
            like
          </button>
        </div>
        <div>{blog.user.username}</div>
      </div>
    </div>
  )
}

export default Blog
