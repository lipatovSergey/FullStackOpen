const Persons = ({ personsToShow, handleDeletePerson }) => {
  return (
    <>
      {personsToShow.map((person) => (
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={() => handleDeletePerson(person)}>delete</button>
        </p>
      ))}
    </>
  )
}

export default Persons
