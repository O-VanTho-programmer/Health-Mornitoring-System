import React from 'react'

function Avatar({ img_url }) {
  return (
    <div className={`w-full h-full relative rounded-full`}>
      <img src={img_url} className='object-cover absolute w-full h-full' />
    </div>
  )
}

export default Avatar