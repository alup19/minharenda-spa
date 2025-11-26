import { useUsuarioStore } from '../context/UsuarioContext'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'

const apiUrl = import.meta.env.VITE_API_URL;

type ClienteTop = {
    id: number;
    nome: string;
    totalGasto: number;
};

export default function TopClientes() {
    const { usuario } = useUsuarioStore()
    const [topClientes, setTopClientes] = useState<ClienteTop[]>([]);

    async function getTopClientes() {
        try {
            const res = await fetch(`${apiUrl}/clientes/top/10/${usuario.id}`);
            const data = await res.json();
            setTopClientes(data);
        } catch (error) {
            toast.error("Não foi possível carregar clientes.");
        }
    }

    useEffect(() => {
        if (usuario?.id) {
            getTopClientes();
        }
    }, [usuario?.id]);

    return (
        <section className='flex flex-col py-[1.4375rem] px-[1.3875rem] bg-[#F5F5F5] rounded-[1.275rem] gap-[1rem]'>
            <h2 className='font-inter text-center text-[1.25rem] font-semibold'>Top Clientes</h2>
            <hr className='h-[0.1225rem] bg-[#D9D9D9]' />
            <div className='flex flex-col gap-[0.625rem]'>
                {topClientes?.length === 0 && (
                    <p className='text-[#656565] text-center'>Nenhum cliente encontrado</p>
                )}

                {topClientes?.length > 0 &&
                    topClientes.map((c) => (
                        <div key={c.id} className='flex flex-row justify-between w-[13rem]'>
                            <p className='text-[#656565] font-inter font-normal'>
                                {c.nome}
                            </p>

                            <p className='text-[#656565] font-inter ml-4 font-semibold'>
                                R${Number(c.totalGasto).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    ))
                }
            </div>
        </section>
    )
}