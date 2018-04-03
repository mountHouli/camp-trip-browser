import React from 'react'

// Put a blank face picture where the 'H' is !!
const Header = () => {
  return (
    <div className={'fixed top-0 right-0 left-0 bg-blue white h0'} >
      <div className='p1 inline-block'>
        H
      </div>
      <div className='p1 inline-block'>
        Trip Planner
      </div>
      <div className='p1 inline-block right'>
        H
      </div>
    </div>
  )
}

export default Header
