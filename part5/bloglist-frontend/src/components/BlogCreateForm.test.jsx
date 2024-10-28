import { getByRole, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogCreateForm from './BlogCreateForm'
import { beforeEach, describe, expect } from 'vitest'

test('new blog form calls onSubmit with the right blog data', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogCreateForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')
  const submitBtn = screen.getByRole('button', { name: /create blog/i })

  await user.type(inputs[0], 'test title')
  await user.type(inputs[1], 'test author')
  await user.type(inputs[2], 'test url')
  await user.click(submitBtn)

  expect(createBlog).toHaveBeenCalledOnce()
  expect(createBlog.mock.calls[0][0]).toStrictEqual({
    title: 'test title',
    author: 'test author',
    url: 'test url'
  })
})
