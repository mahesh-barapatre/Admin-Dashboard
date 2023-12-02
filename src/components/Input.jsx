import React from 'react'

function Input({placeholder, value, setValue}) {
  return (
    <div className='w-3/12 border border-solid'>
      <input 
      type="text" 
      value={value} 
      onChange={(e)=>setValue(e.target.value)}
      placeholder={placeholder}/>
    </div>
  )
}

export default Input
