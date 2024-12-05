import { useQuery, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'

export const useBlogs = () => {
  return useQuery({ queryKey: ['blogs'], queryFn: blogService.getAll })
}

export const useBlog = (id) => {
  const queryClient = useQueryClient()

  // Получаем данные из кэша
  const cacheBlogs = queryClient.getQueryData(['blogs'])
  const cacheBlog = cacheBlogs?.find((b) => b.id === id)

  return useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogService.getSpecificBlog(id), // Запрос к серверу
    enabled: !cacheBlog, // Выполнять запрос только если данных нет в кэше
    initialData: cacheBlog // Использовать кэшированные данные, если они есть
  })
}
