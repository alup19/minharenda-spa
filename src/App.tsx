import { useState } from 'react'
import './tailwind.css'
import { Link, useNavigate } from 'react-router-dom'
import { useUsuarioStore } from './context/UsuarioContext.js'
import Titulo from './componentes/Titulo.js'

export default function App() {
  const { usuario, deslogaUsuario } = useUsuarioStore()
  const navigate = useNavigate()

  function usuarioSair() {
    if(confirm("Confirma saída do sistema?")){deslogaUsuario()
    if (localStorage.getItem("usuarioKey")) {
      localStorage.removeItem("usuarioKey")
    }
    navigate("/login")}
  }

  return (
    <>
    <Titulo/>
    <section>
      <h1>Em desenvolvimento</h1>
    </section>
    </>
  )
}