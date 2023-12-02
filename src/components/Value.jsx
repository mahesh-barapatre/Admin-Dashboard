import React from 'react'

function Value({name, w}) {
  return (
    <div className={`${w} flex-grow font-semibold text-gray-500`}>
      {name}
    </div>
  )
}

export default Value
