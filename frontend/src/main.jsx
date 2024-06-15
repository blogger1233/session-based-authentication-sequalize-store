import React from 'react'
import ReactDOM from 'react-dom/client'
import {RouterProvider, createBrowserRouter} from "react-router-dom"
import App from "./pages/App"
import Signup from './pages/Signup'
import Email from './pages/Email'
const router = createBrowserRouter([
  {
    path:"/",
    element:<Signup/>
  },
  {
    path:"/signup",
    element:<Signup/>,
   
  },
  {
    path:"/email",
    element:<Email/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
 <RouterProvider router={router}/>
 
)
