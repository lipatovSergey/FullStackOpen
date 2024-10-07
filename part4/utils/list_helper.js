const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const { title, author, likes } = blogs.reduce((max, blog) => {
    return blog.likes > max.likes ? blog : max
  }, blogs[0])

  return { title, author, likes }
}

module.exports = { totalLikes, favoriteBlog }
