function Select(props) {
  function handleChange(event) {
    props.setValue(event.target.value)
  }
  return (
    <div>
      <select value={props.value} onChange={handleChange}>
        <option value="" disabled>Choose {props.name}</option>
        {props.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select

