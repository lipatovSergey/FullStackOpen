import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useNotification } from '../contexts/NotificationContext'

const BlogCreateForm = ({ toggleVisibility }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const queryClient = useQueryClient()
  const { showNotification } = useNotification()

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (returnedBlog) => {
      queryClient.setQueryData(['blogs'], (oldBlogs) => {
        return [...(oldBlogs || []), returnedBlog]
      })
      toggleVisibility()
      showNotification(`A new blog "${returnedBlog.title}" added`, 'success')
    },
    onError: (error) => {
      console.error('Error creating blog:', error)
      showNotification('Failed to add blog', 'error')
    }
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlogMutation.mutate({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        title
        <input
          type="text"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author
        <input
          type="text"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url
        <input
          type="text"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create blog</button>
    </form>
  )
}

export default BlogCreateForm
