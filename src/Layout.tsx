import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { Toaster } from 'sonner'
import { useUsuarioStore } from './context/UsuarioContext.js'

export default function Layout() {
  const { usuario } = useUsuarioStore()
  const navigate = useNavigate()
  const location = useLocation();

  useEffect(() => {
    if (Object.keys(usuario).length === 0) {
      navigate("/", { replace: false })
    }
    if (localStorage.getItem("usuarioKey")) {
      navigate(location.pathname)
    }
  }, [])

  return (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  )
}