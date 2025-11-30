import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Login from './Login.js'
import Registro from './Registro.js'
import App from './App.js'
import Layout from './Layout.js'
import Receitas from './Receitas.js'
import Despesas from './Despesas.js'
import Clientes from './Clientes.js'
import Estoques from './Estoques.js'
import Insumos from './Insumos.js'
import Relatorio from './Relatorio.js'
import UsuarioArea from './UsuarioArea.js'

const rotas = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: 'login', element: <Login /> },
      { path: 'registro', element: <Registro /> },
      { path: 'despesas', element: <Despesas /> },
      { path: 'clientes', element: <Clientes /> },
      { path: 'insumos', element: <Insumos /> },
      { path: 'estoques', element: <Estoques /> },
      { path: 'relatorios', element: <Relatorio /> },
      { path: 'receitas', element: <Receitas /> },
      { path: 'dashboard', element: <UsuarioArea /> }
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>,
)
