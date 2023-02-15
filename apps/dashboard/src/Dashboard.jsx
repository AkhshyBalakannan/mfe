import React from "react"

function Dashboard (props) {
  const { dispatch } = props
  return (
    <div className="dashboard">
      <p>Increase Counter from Dashboard App</p>
      <button
        onClick={() => {
          dispatch({
            type: "increment",
          })
        }}
      >
        Increment
      </button>
    </div>
  )
}

export default Dashboard
