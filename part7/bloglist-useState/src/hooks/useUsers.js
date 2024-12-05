import { useQuery } from '@tanstack/react-query'
import usersServices from '../services/users'

const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: usersServices.getAll
  })
}

export default useUsers
