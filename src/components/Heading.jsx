import React from 'react'

function Heading({name, w}) {
  return (
    <div className={`${w} flex-grow font-bold text-lg text-blue-500`}>
      {name}
    </div>
  )
}

export default Heading
