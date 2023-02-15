import React, { useContext, useEffect } from "react"

const initialState = JSON.parse(localStorage.getItem('store')) || { count: 0 }

function reducer(state, action) {
  let currentState = { count: state.count }
  switch (action.type) {
    case "increment":
      currentState.count = state.count + 1 
      localStorage.setItem('store', JSON.stringify(currentState))
      return currentState
    case "decrement":
      currentState.count = state.count - 1
      localStorage.setItem('store', JSON.stringify(currentState))
      return currentState
    default:
      throw new Error()
  }
}

export const AppContext = React.createContext()

export const StoreProvider = ({ children }) => {
  const value = React.useReducer(reducer, initialState)

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useStore = () => {
  return useContext(AppContext)
}
