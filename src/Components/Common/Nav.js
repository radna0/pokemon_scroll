import React from 'react'
import "./Nav.css"
import { Link } from 'react-router-dom'

function Nav() {
  return (
    <div className="navbar_container">
      <div className="navbar_links">
        <Link to="pokemon_scroll">Pokemon Scroll</Link>
      </div>
      <div className="navbar_links">
        <Link to="pokemon_pagination">Pokemon Pagination</Link>
      </div>
    </div>
  )
}

export default Nav