import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Signup from './pages/Signup'
import App from './App'
const router  = createBrowserRouter([
  {
    path:"/",
    element:"<h1>hello world</h1>"
  },
  {
    path:"/app",
    element:<App/>,
    children:[
      {
        path:"register",
        element:<Signup/>
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
 <RouterProvider router={router}/>
)
