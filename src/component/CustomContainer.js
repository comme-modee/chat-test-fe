import React from 'react';
import '../style/customContainer.style.css';

const CustomContainer = ({ children }) => {
  return (
    <div className='custom-container'>{children}</div>
  )
}

export default CustomContainer