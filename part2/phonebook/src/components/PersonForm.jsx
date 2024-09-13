const PersonForm = ({ handleFormSubmit, handleNameInputChange, handlePhoneInputChange, number, newName }) => {
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
  );
};

export default PersonForm;
