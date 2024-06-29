import React from 'react'
import ReactDOM from 'react-dom/client'
import {RouterProvider, createBrowserRouter} from "react-router-dom"
import Signup from './pages/Signup'
import Email from './pages/Email'
import Login from './pages/Login'
import Home from './pages/Home'
const router = createBrowserRouter([
  {
    path:"/",
    element:<Login/>
  },
  {
    path:"/signup",
    element:<Signup/>,
   
  },
  {
    path:"/email",
    element:<Email/>
  },
  {
    path:"/home",
    element:<Home/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
 <RouterProvider router={router}/>
 
)
