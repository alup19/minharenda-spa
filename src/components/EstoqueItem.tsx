import { toast } from 'sonner'
import type { ProdutoType } from "../utils/ProdutoType";
import { useUsuarioStore } from '../context/UsuarioContext';
import Modal from "./Modal";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"

interface listaProdutoProps {
    produto: ProdutoType;
    produtos: ProdutoType[];
    setProdutos: React.Dispatch<React.SetStateAction<ProdutoType[]>>;
}

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
    nome: string
    unidadeBase: string
    categoria: string
    usuarioId: string
}

export default function EstoqueItem({ produto, produtos, setProdutos }: listaProdutoProps) {
    const { usuario } = useUsuarioStore()
    const [OpenAlterarProduto, setOpenAlterarProduto] = useState(false)
    const [OpenExcluirProduto, setOpenExcluirProduto] = useState(false)
    const { register, handleSubmit, reset, setFocus } = useForm<Inputs>()

    async function getProdutos() {
        const response = await fetch(`${apiUrl}/produtos`)
        const dados = await response.json()
        setProdutos(dados)
    }

    useEffect(() => {
        getProdutos()
    }, [OpenAlterarProduto, setFocus("nome")])

    //   async function atualizarReceita(data: Inputs) {
    //     const receitaAtualizada: Inputs = {
    //       descricao: data.descricao,
    //       valor: Number(data.valor),
    //       categoria: data.categoria,
    //       anexo: data.anexo,
    //       createdAt: data.createdAt,
    //       usuarioId: usuario.id,
    //       tagId: 1, // depois tem que alterar
    //       clienteId: Number(data.clienteId)
    //     }

    //     const response = await fetch(`${apiUrl}/receitas/${receita.id}`, {
    //       method: "PUT",
    //       headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": `Bearer ${usuario.token}`
    //       },
    //       body: JSON.stringify(receitaAtualizada)
    //     })

    //     if (response.status === 200) {
    //       toast.success("Receita atualizada com sucesso!")
    //       reset()
    //       getReceitas
    //       setOpenAlterarDados(false)
    //     } else {
    //       console.log(receitaAtualizada)
    //       toast.error("Erro... Não foi possível atualizar esta receita")
    //     }
    //   }

    //   async function excluirReceita() {

    //     const response = await fetch(`${apiUrl}/receitas/${receita.id}`,
    //       {
    //         method: "DELETE",
    //         headers: {
    //           "Content-type": "application/json",
    //           Authorization: `Bearer ${usuario.token}`
    //         },
    //       },
    //     )

    //     if (response.status == 200) {
    //       const receitas2 = receitas.filter(x => x.id != receita.id)
    //       setReceitas(receitas2)
    //       toast.success("Receita excluída com sucesso")
    //     } else {
    //       setOpenExcluirReceita(false)
    //       toast.error("Erro... Receita não foi excluída")
    //     }
    //   }

    return (
        <section>
            <div key={produto.id} className="flex flex-col gap-[0.44rem]">
                <div className="bg-[#E2E2E2] py-[0.875rem] px-[1.06rem] rounded-[0.9375rem] flex flex-row justify-between items-center">
                    <p className="text-[#656565] font-inter font-normal text-[1rem]">
                        {produto.nome}
                    </p>
                    <p className="text-[#303030] font-inter font-semibold">
                        {produto.saldoBase} kg/g
                    </p>
                    <p className="text-[#656565] font-inter font-normal">
                        R$ {produto.custoMedio} /Kg
                    </p>
                    <p className="text-[#705519] font-inter text-[0.975rem] font-medium bg-[#F6DDA6] py-[0.10rem] px-[1.06rem] rounded-[0.46875rem] ">
                        {produto.categoria}
                    </p>
                    <img src="/attachment.svg" alt="" />
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <img src="/options.svg" alt="opções" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="font-inter">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setOpenAlterarProduto(true)}>
                                Alterar Dados
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setOpenExcluirProduto(true)}
                                className="text-[#c02424]"
                            >
                                Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Modal open={OpenAlterarProduto} onClose={() => setOpenAlterarProduto(false)}>
                <div className="container">
                    <div className="container flex flex-col items-start">
                        <div className="flex flex-row items-center gap-[0.7rem] justify-center">
                            <img src="/tabela.svg" className="w-[1.5rem] h-[1.5rem]" alt="" />
                            <h2 className="text-center text-[1.4rem] font-inter font-semibold">
                                Alterar Item do Estoque
                            </h2>
                        </div>
                    </div>

                    <div className="container flex flex-col items-center">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setOpenAlterarProduto(false)}
                                className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter hover:opacity-90 transition cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button className="text-white bg-[#308021] rounded-md px-6 py-2 text-[1rem] font-bold hover:opacity-90 font-inter transition cursor-pointer">
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal open={OpenExcluirProduto} onClose={() => setOpenExcluirProduto(false)}>
                <div className="container">
                    <div className="container flex flex-col items-start">
                        <div className="flex flex-row items-center gap-[0.7rem] justify-center">
                            <img src="/tabela.svg" className="w-[1.5rem] h-[1.5rem]" alt="" />
                            <h2 className="text-center text-[1.4rem] font-inter font-semibold">
                                Excluir Item do Estoque
                            </h2>
                        </div>
                    </div>

                    <div className="container flex flex-col items-center">
                        <div className="flex flex-col items-center my-6">
                            <p className="font-inter">
                                Você tem certeza que deseja apagar este item do estoque?
                            </p>
                            <p className="font-inter">
                                Após confirmar, essa ação será irreversível.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setOpenExcluirProduto(false)}
                                className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter hover:opacity-90 transition cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button className="text-white bg-[#c02424] rounded-md px-6 py-2 text-[1rem] font-bold hover:opacity-90 font-inter transition cursor-pointer">
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </section>
    )

}