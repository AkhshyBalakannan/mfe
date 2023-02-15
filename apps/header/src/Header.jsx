import React from "react"

const Header = ({ count = 0 }) => (
  <header>
    <p className="header-title">Showing Counter Value from Header App</p>
    <p className="header-body">Count: {count}</p>
  </header>
)

export default Header
