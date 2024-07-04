import React from 'react'
import '../style/errorCard.style.css'


const ErrorCard = ({ errorMessage }) => {
  return (
    <div className='error-card'>{errorMessage}</div>
  )
}

export default ErrorCard