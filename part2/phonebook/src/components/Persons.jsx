const Persons = ({ personToShow, handleDeletePerson }) => {
  return (
    <>
      {personToShow.map((person) => (
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={() => handleDeletePerson(person)}>delete</button>
        </p>
      ))}
    </>
  );
};

export default Persons;
