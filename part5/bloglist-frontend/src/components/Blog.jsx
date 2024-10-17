import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, showDeleteButton, handleBlogDelete }) => {
  console.log(showDeleteButton)
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)
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

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: likes + 1
    }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setLikes(returnedBlog.likes)
    } catch (error) {
      console.error('Error updating likes', error)
    }
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
          {likes}
          <button onClick={handleLike}>like</button>
        </div>
        <div>{blog.user.username}</div>
      </div>
    </div>
  )
}

export default Blog
