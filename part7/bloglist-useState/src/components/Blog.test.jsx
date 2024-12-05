import { getByRole, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { beforeEach, describe, expect } from 'vitest'

describe('<Blog />', () => {
  const blog = {
    title: 'Testing in React',
    author: 'John Doe',
    url: 'http://test.com',
    likes: 10,
    user: { username: 'johndoe' }
  }

  const handleBlogLike = vi.fn()

  beforeEach(() => {
    render(<Blog blog={blog} handleBlogLike={handleBlogLike} />)
  })

  test('renders blog with title and author, URL and likes are hidden', () => {
    const renderedFields = screen.getByText('Testing in React John Doe')

    expect(renderedFields).toBeDefined()
    expect(screen.getByText('http://test.com')).not.toBeVisible()
    expect(screen.getByText('10')).not.toBeVisible()
  })

  test('URL and number of likes are shown when the button controlling the shown details has been clicked', async () => {
    const user = userEvent.setup()
    const toggleVisibilityBtn = screen.getByRole('button', { name: /view/i })
    await user.click(toggleVisibilityBtn)

    expect(screen.getByText('http://test.com')).toBeVisible()
    expect(screen.getByText('10')).toBeVisible()
  })

  test('like button is clicked twice, the event handler the component received as props is called twice', async () => {
    const user = userEvent.setup()
    const toggleVisibilityBtn = screen.getByRole('button', { name: /view/i })
    await user.click(toggleVisibilityBtn)
    const likeBtn = screen.getByRole('button', { name: /like/i })

    await user.click(likeBtn)
    await user.click(likeBtn)

    expect(handleBlogLike).toHaveBeenCalledTimes(2)
  })
})
