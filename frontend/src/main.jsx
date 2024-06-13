import React from 'react'
import ReactDOM from 'react-dom/client'
import {RouterProvider, createBrowserRouter} from "react-router-dom"
import App from "./pages/App"
import Signup from './pages/Signup'
const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>
  },
  {
    path:"/signup",
    element:<Signup/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
 <RouterProvider router={router}/>
 
)
