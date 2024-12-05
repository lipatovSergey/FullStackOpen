import { useState } from 'react'
import useUsers from '../hooks/useUsers'

const User = ({ user, onBack }) => {
  return (
    <div>
      <button onClick={onBack}>Back</button>
      <h3>{user.name}</h3>
      <strong>added blogs</strong>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

const Users = () => {
  const { data: users, isLoading, isError, error } = useUsers()
  const [selectedUser, setSelectedUser] = useState(null)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (selectedUser) {
    return <User user={selectedUser} onBack={() => setSelectedUser(null)} />
  }

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Blogs Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedUser(user)
                  }}
                >
                  {user.name}
                </a>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users
