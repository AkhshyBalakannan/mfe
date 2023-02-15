import React from "react"
import { useStore } from "store/store"
import RemoteHeader from "header/Header"
import RemoteDashboard from "dashboard/Dashboard"

const App = () => {
  const [store, dispatch] = useStore()

  const note = (
    <>
        <h4>This Application has the following integrations</h4>
        <ol>
            <li>
                Three React Applications bundled inside one host react MFE
            </li>
            <li>
                Single point of connect to React State for host, header, dashboard.
            </li>
            <li>
                Store application is hosted separately and is exposed via webpack
            </li>
        </ol>
        <p>Following Applications are running @</p>
        <ul>
            <li>
                Header : <a href="http://localhost:3001/">localhost:3001</a>
            </li>
            <li>
                Dashboard : <a href="http://localhost:3002/">localhost:3002</a>
            </li>
            <li>
                Store : <a href="http://localhost:3003/">localhost:3003</a>
            </li>
        </ul>
    </>
  )

  return (
    <div>
      <p className="host-title">React Host Container App</p>
      <div className="host-body">
        {note}
      </div>
      <div className="container">
        <RemoteHeader count={store.count} />
        <RemoteDashboard dispatch={dispatch} />
      </div>
      <footer>
        <button onClick={() => {dispatch({type: "decrement"})}}>
          Decrement
        </button>
      </footer>
    </div>
  )
}

export default App
