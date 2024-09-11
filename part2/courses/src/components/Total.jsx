const Total = ({ parts }) => {
    const result = parts.reduce((sum, current) => sum + current.exercises, 0)
    return (<strong>Total of  {result}exercises</strong>)
}

export default Total 