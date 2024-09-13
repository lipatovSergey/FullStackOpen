import { useState, useEffect } from 'react';

import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import server from './server';

const App = () => {
  useEffect(() => {
    server.getAll().then((persons) => setPersons(persons));
  }, []);

  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [number, setNumber] = useState('');
  const [filter, setFilter] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newPerson = { name: newName.trim(), number: number.trim() };
    const existingPerson = persons.find((person) => person.name.toLowerCase() === newPerson.name.toLowerCase());
    console.log(existingPerson);

    if (
      existingPerson !== undefined &&
      window.confirm(`${existingPerson.name} is already added to phonebook, replace old number with a new one?`)
    ) {
      const personToUpdate = { ...existingPerson, number: newPerson.number };
      updatePersonNumber(personToUpdate);
    } else {
      server
        .addPerson(newPerson)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
        })
        .catch((error) => alert(`Error adding person ${error.message}`));
    }
    setNewName('');
    setNumber('');
  };

  const updatePersonNumber = (personToUpdate) => {
    server
      .updateNumber(personToUpdate.id, personToUpdate)
      .then((updatedPerson) => {
        console.log(updatedPerson);
        setPersons(persons.map((person) => (person.id === updatedPerson.id ? updatedPerson : person)));
      })
      .catch((error) => alert(`Error updating person ${error.message}`));
  };

  const handleDeletePerson = (personToDelete) => {
    if (window.confirm(`Delete ${personToDelete.name} ?`)) {
      server
        .deletePerson(personToDelete.id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== personToDelete.id));
        })
        .catch((error) => alert(`Error deleting person ${error.message}`));
    }
  };

  const handleNameInputChange = (e) => {
    setNewName(e.target.value);
  };
  const handlePhoneInputChange = (e) => {
    setNumber(e.target.value);
  };
  const handleFilterInputChange = (e) => {
    setFilter(e.target.value);
  };

  const personToShow = filter
    ? persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons;

  return (
    <>
      <h2>Phonebook</h2>

      <Filter onChange={handleFilterInputChange} filter={filter} />

      <h3>Add new</h3>

      <PersonForm
        handleFormSubmit={handleFormSubmit}
        handleNameInputChange={handleNameInputChange}
        handlePhoneInputChange={handlePhoneInputChange}
        number={number}
        newName={newName}
      />

      <h3>Numbers</h3>
      <Persons personToShow={personToShow} handleDeletePerson={handleDeletePerson} />
    </>
  );
};

export default App;
