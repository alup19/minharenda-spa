import { useUsuarioStore } from '../context/UsuarioContext'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
// import { useNavigate } from "react-router-dom"
// import { Link } from 'react-router-dom'

const apiUrl = import.meta.env.VITE_API_URL;

export default function Dashboard() {
    const { usuario } = useUsuarioStore()
    const [dashboards, setDashboards] = useState({
        totalReceitas: 0,
        totalDespesas: 0,
        lucroLiquido: 0
    })
    // const navigate = useNavigate()

    async function getDadosDashBoard() {
        try {
            const resp = await fetch(`${apiUrl}/usuarios/dashboard/${usuario.id}`, {
                headers: { Authorization: `Bearer ${usuario.token}` },
            });
            const data = await resp.json();
            setDashboards(data);
        } catch (error) {
            toast.error("Não foi possível carregar dashboard.");
        }
    }

    useEffect(() => {
        if (usuario?.id) {
            getDadosDashBoard();
        }
    }, [usuario?.id]);

    function formatarNome(nomeCompleto: string) {
        if (!nomeCompleto) return ''
        const partes = nomeCompleto.trim().split(' ')
        if (partes.length === 1) return partes[0]
        const primeiroNome = partes[0]
        return `${primeiroNome}`
    }

    const lucroBruto = dashboards.lucroLiquido ?? 0
    const lucroNegativo = lucroBruto < 0
    const lucroAbsoluto = Math.abs(lucroBruto)

    return (
        <section className="bg-[#F5F5F5] rounded-[1.25rem] w-[83vw] flex items-center justify-between px-20 py-[2.3125rem]">
            <div className='flex flex-col items-start gap-3'>
                <h2 className='text-[#2A2A2A] font-inter text-[1.25rem] font-semibold'>Olá {formatarNome(usuario.nome)}, como você está hoje?</h2>
                <div className="flex items-stretch font-inter text-[1rem]">
                    <div className="flex flex-col items-center justify-center pr-[1.06rem]">
                        <h2 className="text-[#4A4B51] font-semibold">Receita Total</h2>
                        <h3 className="text-[#407B6A] font-medium text-[1.3rem]">
                            R${dashboards.totalReceitas?.toLocaleString("pt-br", { minimumFractionDigits: 2 })}
                        </h3>
                    </div>

                    <div className="w-[0.1rem] rounded-[0.9375rem] bg-[#B7BBC7] mx-[1.06rem]" />

                    <div className="flex flex-col items-center justify-center px-[1.06rem]">
                        <h2 className="text-[#4A4B51] font-semibold">Despesas Totais</h2>
                        <h3 className="text-[#CA3030] font-medium text-[1.3rem]">
                            R${dashboards.totalDespesas?.toLocaleString("pt-br", { minimumFractionDigits: 2 })}
                        </h3>
                    </div>

                    <div className="w-[0.1rem] rounded-[0.9375rem] bg-[#B7BBC7] mx-[1.06rem]" />

                    <div className="flex flex-col items-center justify-center px-[1.06rem]">
                        <h2 className="text-[#4A4B51] font-semibold">Lucro Líquido</h2>
                        <h3 className={`font-medium text-[1.3rem] ${lucroNegativo ? "text-[#CA3030]" : "text-[#407B6A]"}`}>
                            R${lucroAbsoluto.toLocaleString("pt-br", { minimumFractionDigits: 2 })}
                        </h3>
                    </div>

                </div>
            </div>

            <div className='flex flex-col items-center gap-2'>
                <h2 className='text-[#2A2A2A] font-inter text-[1.25rem] font-semibold'>Menu Rápido</h2>
                <div className='flex flex-row gap-[0.88rem]'>
                    <button className='flex flex-row gap-[0.5rem] border-[#7C7DCE] border bg-[linear-gradient(139deg,#111241_-40.56%,#C04300_279.19%)] px-[0.8125rem] py-[0.4375rem] rounded-[0.375rem]'>
                        <img src="/estoque-icon.svg" alt="" />
                        <p className='font-inter text-white font-normal'>Estoque</p>
                    </button>
                    <button className='flex flex-row gap-[0.5rem] border-[#F00] border bg-[linear-gradient(139deg,#972E2E_-40.56%,#C00000_279.19%)] px-[0.8125rem] py-[0.4375rem] rounded-[0.375rem]'>
                        <img src="/despesa-icon.svg" alt="" />
                        <p className='font-inter text-white font-normal'>Despesa</p>
                    </button>
                    <button className='flex flex-row gap-[0.5rem] border-[#0F1] border bg-[linear-gradient(139deg,#114114_-40.56%,#00C000_279.19%)] px-[0.8125rem] py-[0.4375rem] rounded-[0.375rem]'>
                        <img src="/receita-icon.svg" alt="" />
                        <p className='font-inter text-white font-normal'>Receita</p>
                    </button>
                    <button className='flex flex-row gap-[0.5rem] border-[#7CBCCE] border bg-[linear-gradient(139deg,#184047_-40.56%,#F89900_279.19%)] px-[0.8125rem] py-[0.4375rem] rounded-[0.375rem]'>
                        <img src="/relatorio-icon.svg" alt="" />
                        <p className='font-inter text-white font-normal'>Relatório</p>
                    </button>
                </div>
            </div>
        </section>
    )
}
