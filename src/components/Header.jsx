import React from 'react'

import { bg_blue, white, h0 } from '../styles/common.css'

// Put a blank face picture where the 'H' is !!
const Header = () => {
  return (
    <div className={'p1 fixed top-0 right-0 left-0 ' + [bg_blue, white, h0].join(' ')} >
      <div className='inline-block'>
        Trip Planner
      </div>
      <div className='inline-block right'>
        H
      </div>
    </div>
  )
}

export default Header
