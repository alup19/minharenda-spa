import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Login from './Login.jsx'
import Registro from './Registro.jsx'
import App from './App.jsx'

const rotas = createBrowserRouter([
  {
    path: '/',
    children: [
      { index: true, element: <App /> },
      { path: 'login', element: <Login /> },
      { path: 'registro', element: <Registro /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>,
)
