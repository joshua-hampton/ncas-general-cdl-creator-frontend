function Checkbox(props) {
  function handleChange(event) {
    props.onChange(!props.checked)
  }
  return (
    <div>
      <input type="checkbox" checked={props.checked} onChange={handleChange} id={props.id}/>
      <label htmlFor={props.id}>  View compliance information</label>
    </div>
  )
}

export default Checkbox


