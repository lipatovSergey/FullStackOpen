import axios from 'axios'
<<<<<<< HEAD
const baseUrl = '/api/persons'
=======
const baseUrl = 'http://localhost:3001/persons'
>>>>>>> 6bbe869108405fe3203443d439e7613cceebf51a

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const addPerson = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then((response) => response.data)
}

const deletePerson = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then((response) => response.data)
}

const updateNumber = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then((response) => response.data)
}

export default { getAll, addPerson, deletePerson, updateNumber }
