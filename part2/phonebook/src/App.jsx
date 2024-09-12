import { useState } from 'react'

const Filter = ({ onChange, filter }) => {
  return (
    <>
      <div>
        filter shown with <input onChange={onChange} value={filter} />
      </div>
    </>
  )
}

const PersonForm = ({ handleFormSubmit , handleNameInputChange, handlePhoneInputChange, number, newName }) => {
  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div>
          name: <input onChange={handleNameInputChange} value={newName} />
          <br />
          number: <input onChange={handlePhoneInputChange} value={number} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  )
}

const Persons = ({ personToShow }) => {
  return (
    <>
      {personToShow.map((person) => (<p key={person.id}>{person.name} {person.number}</p>))}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [number, setNumber] = useState('')
  const [filter, setFilter] = useState('')

  const handleFormSubmit = (e) => {
    e.preventDefault()
    persons.some(person => person.name.toLowerCase() === newName.toLowerCase()) ?  
      alert(`${newName} is already added to phonebook`)
      :
      setPersons(persons.concat({ name: newName, number: number, id: persons.length + 1}))
      setNewName('')
      setNumber('')
  }

  const handleNameInputChange = (e) => {
    setNewName(e.target.value)
  }
  const handlePhoneInputChange = (e) => {
    setNumber(e.target.value)
  }
  const handleFilterInputChange = (e) => {
    setFilter(e.target.value)
  }

  const personToShow = filter ?
    persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    :
    persons

  return (
    <>
      <h2>Phonebook</h2>
      
      <Filter onChange={handleFilterInputChange} filter={filter}/>

      <h3>Add new</h3>

      <PersonForm 
        handleFormSubmit={handleFormSubmit} 
        handleNameInputChange={handleNameInputChange} 
        handlePhoneInputChange={handlePhoneInputChange} 
        number={number} 
        newName={newName} 
      />

      <h3>Numbers</h3>
      <Persons personToShow={personToShow}/>
    </>
  )
}

export default App