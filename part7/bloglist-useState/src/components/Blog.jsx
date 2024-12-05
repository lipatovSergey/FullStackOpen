import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import blogService from '../services/blogs'
import { useBlog } from '../hooks/useBlogs'
import { useNotification } from '../contexts/NotificationContext'

const Blog = ({ showDeleteButton }) => {
  const { id } = useParams()
  const { data: blog } = useBlog(id)
  const queryClient = useQueryClient()
  const { showNotification } = useNotification()
  console.log(blog)

  // Убедитесь, что все хуки вызываются
  const deleteBlogMutation = useMutation({
    mutationFn: () => blogService.remove(blog?.id),
    onSuccess: () => {
      queryClient.setQueryData(['blogs'], (oldBlogs) =>
        oldBlogs.filter((b) => b.id !== blog.id)
      )
      showNotification(`Blog "${blog.title}" deleted successfully`, 'success')
    },
    onError: (error) => {
      console.error('Error deleting blog', error)
      showNotification(`Failed to delete "${blog?.title}" blog`)
    }
  })

  const updateBlogMutation = useMutation({
    mutationFn: (updatedBlog) => blogService.update(blog?.id, updatedBlog),
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(['blogs'], (oldBlogs) =>
        oldBlogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b))
      )
      showNotification(
        `Blog ${updatedBlog.title} liked successfully`,
        'success'
      )
    },
    onError: (error) => {
      console.error('Error liking blog:', error)
      showNotification('Failed to like blog', 'error')
    }
  })

  const [detailsVisible, setDetailsVisible] = useState(false)

  // Если данные отсутствуют
  if (!blog) {
    return <p>Blog not found</p>
  }

  const handleBlogDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      deleteBlogMutation.mutate()
    }
  }

  const handleBlogLike = () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    updateBlogMutation.mutate(updatedBlog)
  }

  return (
    <div>
      <h1>{blog.title}</h1>
      <p>{blog.author}</p>
      <p>{blog.url}</p>
      <p>
        Likes: {blog.likes}
        <button onClick={handleBlogLike}>Like</button>
      </p>
      {showDeleteButton && <button onClick={handleBlogDelete}>Delete</button>}
    </div>
  )
}

export default Blog
