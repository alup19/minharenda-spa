import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom"
import { toast } from 'sonner'
import { useUsuarioStore } from '../context/UsuarioContext.js'

export default function Titulo() {
    const { usuario, deslogaUsuario } = useUsuarioStore()
    const navigate = useNavigate()

    function usuarioSair() {
        if (confirm("Confirma saída do sistema?")) {
            deslogaUsuario()
            if (localStorage.getItem("usuarioKey")) {
                localStorage.removeItem("usuarioKey")
            }
            navigate("/login")
        }
    }

    return (
        <section className='flex flex-row items-center justify-center h-[7.375rem] gap-[11.75rem]'>
            <img src="/logo.png" className="w-[15.8125rem]" alt="" />
            <div className='flex flex-row gap-[3.12rem] font-inter text-[1.0625rem] font-normal text-[#2A2A2A]'>
                <Link to={"/"}>visão geral</Link>
                <Link to={"/estoque"}>estoque</Link>
                <a>insumos</a>
                <Link to={"/despesas"}>despesas</Link>
                <Link to={"/receitas"}>receitas</Link>
                <a>relatórios</a>
                <Link to={"/clientes"}>clientes</Link>
            </div>
            <button onClick={usuarioSair} className='flex flex-row gap-[1.69rem] px-[1.4625rem] py-[0.875rem] border-[1.5px] border-[#2A2A2A] rounded-[0.9375rem]'>
                <p className='font-inter text-[1rem] text-[#2A2A2A]'>Maiquel P.</p>
                <img src="/arrow_b.svg" className='w-[0.94794rem]' alt="" />
            </button>
        </section>
    )
}