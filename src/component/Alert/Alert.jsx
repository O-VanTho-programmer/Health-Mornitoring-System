import React from 'react'
import './alert.css'

function Alert({ message, type }) {
  return (
    <div className={`alert ${type}`}>
      {message}
    </div>
  )
}

export default Alert