import { useUsuarioStore } from '../context/UsuarioContext'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'

const apiUrl = import.meta.env.VITE_API_URL;

type ProdutoTop = {
    id: number;
    nome: string;
    totalVendido: number;
};

export default function TopProdutos() {
    const { usuario } = useUsuarioStore()
    const [topProdutos, setTopProdutos] = useState<ProdutoTop[]>([]);

    async function getTopProdutos() {
        try {
            const res = await fetch(`${apiUrl}/produtos/top/10/${usuario.id}`);
            const data = await res.json();
            setTopProdutos(data);
        } catch (error) {
            toast.error("Não foi possível carregar produtos.");
        }
    }

    useEffect(() => {
        if (usuario?.id) {
            getTopProdutos();
        }
    }, [usuario?.id]);

    return (
        <section className='flex flex-col py-[1.4375rem] px-[1.3875rem] bg-[#F5F5F5] rounded-[1.275rem] gap-[1rem]'>
            <h2 className='font-inter text-center text-[1.25rem] font-semibold'>Produtos + Vendidos</h2>
            <hr className='h-[0.1225rem] bg-[#D9D9D9]' />
            <div className='flex flex-col gap-[0.625rem]'>
                {topProdutos?.length === 0 && (
                    <p className='text-[#656565] text-center'>Nenhuma venda encontrada</p>
                )}

                {topProdutos?.length > 0 &&
                    topProdutos.map((p) => (
                        <div key={p.id} className='flex flex-row justify-between'>
                            <p className='text-[#656565] font-inter font-normal'>
                                {p.nome}
                            </p>
                            <p className='text-[#656565] font-inter font-semibold'>
                                {p.totalVendido} Vendas
                            </p>
                        </div>
                    ))
                }
            </div>
        </section>
    )
}