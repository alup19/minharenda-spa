// import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom"
import { useUsuarioStore } from '../context/UsuarioContext'
import { useEffect } from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"

const apiUrl = import.meta.env.VITE_API_URL;

export default function Titulo() {
    const { usuario, logaUsuario, deslogaUsuario } = useUsuarioStore()
    const navigate = useNavigate()

    useEffect(() => {
        async function buscaUsuario(id: string) {
            const response = await fetch(`${apiUrl}/usuarios/${id}`)
            const dados = await response.json()
            logaUsuario(dados)
        }

        if (localStorage.getItem("usuarioKey")) {
            const idUsuario = localStorage.getItem("usuarioKey")
            buscaUsuario(idUsuario as string)
        }
    }, [usuario.id]);

    function usuarioSair() {
        if (confirm("Confirma saída do sistema?")) {
            deslogaUsuario()
            if (localStorage.getItem("usuarioKey")) {
                localStorage.removeItem("usuarioKey")
            }
            navigate("/login")
        }
    }

    function formatarNome(nomeCompleto: string) {
        if (!nomeCompleto) return ''
        const partes = nomeCompleto.trim().split(' ')
        if (partes.length === 1) return partes[0]
        const primeiroNome = partes[0]
        const sobrenomeInicial = partes[partes.length - 1][0].toUpperCase()
        return `${primeiroNome} ${sobrenomeInicial}.`
    }

    return (
        <section className='flex flex-row items-center justify-center h-[7.375rem] gap-[11.75rem]'>
            <img src="/logo3.png" className="w-[15.8125rem]" alt="" />
            <div className='flex flex-row gap-[3.12rem] font-inter text-[1.0625rem] font-normal text-[#2A2A2A]'>
                <Link to={"/"}>visão geral</Link>
                <Link to={"/estoques"}>estoque</Link>
                <Link to={"/insumos"}>insumos</Link>
                <Link to={"/despesas"}>despesas</Link>
                <Link to={"/receitas"}>receitas</Link>
                <Link to={"/relatorios"}>relatórios</Link>
                <Link to={"/clientes"}>clientes</Link>
            </div>
            <div className='flex flex-row gap-[1.69rem] px-[1.1625rem] py-[0.575rem] border-[1.5px] border-[#2A2A2A] rounded-[0.9375rem]'>
                <p className='font-inter text-[1rem] text-[#2A2A2A]'>{formatarNome(usuario.nome)}</p>
                <DropdownMenu>
                    <DropdownMenuTrigger><img src="/arrow_b.svg" alt="" /></DropdownMenuTrigger>
                    <DropdownMenuContent className="font-inter">
                        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Perfil</DropdownMenuItem>
                        <DropdownMenuItem>Configurações</DropdownMenuItem>
                        <DropdownMenuItem>Pagamentos</DropdownMenuItem>
                        <DropdownMenuItem onClick={usuarioSair}>Sair</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </section>
    )
}