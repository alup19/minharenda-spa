import { useState } from 'react'
import './tailwind.css'
import { Link, useNavigate } from 'react-router-dom'
import { useUsuarioStore } from './context/UsuarioContext.js'


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
    <section className='flex flex-row'>
      <button onClick={usuarioSair} className='absolute text-center top-12 right-[6rem] w-[11.62rem] px-8 py-3 bg-[#E8F5EA] text-[#407B6A] font-roboto text-[1.125rem] font-medium rounded-[4.3125rem] hover:bg-[#C8E6C9] transition-colors'>
        Deslogar
      </button>
      <h1>Oi</h1>
    </section>
  )
}