import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { Toaster } from 'sonner'
import { useUsuarioStore } from './context/UsuarioContext.js'

export default function Layout() {
  const { usuario } = useUsuarioStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (Object.keys(usuario).length === 0) {
      navigate("/login", { replace: true })
    }
    if (localStorage.getItem("usuarioKey")) {
      navigate("/")
    }
  }, [])

  return (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  )
}