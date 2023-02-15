import React, { Suspense } from "react"
import ReactDOM from "react-dom"
import { StoreProvider } from "store/store"
import Home from "./components/home"
import "./assets/index.css"

ReactDOM.render(
  <Suspense fallback={<div>Loading...</div>}>
    <StoreProvider>
      <Home />
    </StoreProvider>
  </Suspense>,
  document.getElementById("app")
)
