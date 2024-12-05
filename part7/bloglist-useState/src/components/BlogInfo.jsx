import { useParams } from 'react-router-dom'
import { useBlog } from '../hooks/useBlogs'

const BlogInfo = () => {
  const { id } = useParams()
  const { data: blog } = useBlog(id)
  console.log(blog)

  return <div></div>
}

export default BlogInfo
