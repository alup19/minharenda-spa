import { toast } from 'sonner'
import type { ReceitaType } from "../utils/ReceitaType";
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


interface listaReceitaProps {
  receita: ReceitaType;
  receitas: ReceitaType[];
  setReceitas: React.Dispatch<React.SetStateAction<ReceitaType[]>>;
}

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
  descricao: string
  valor: number
  categoria: string
  anexo: string
  createdAt: Date
  usuarioId: string
  tagId: number
  clienteId: number
}

export default function ReceitaItem({ receita, receitas, setReceitas }: listaReceitaProps) {
  const { usuario } = useUsuarioStore()
  const [OpenAlterarDados, setOpenAlterarDados] = useState(false)
  const [OpenExcluirReceita, setOpenExcluirReceita] = useState(false)
  const { register, handleSubmit, reset, setFocus } = useForm<Inputs>()

  async function getReceitas() {
    const response = await fetch(`${apiUrl}/receitas`)
    const dados = await response.json()
    setReceitas(dados)
  }

  useEffect(() => {
      getReceitas()
    }, [OpenAlterarDados, setFocus("descricao")])

  async function atualizarReceita(data: Inputs) {
    const receitaAtualizada: Inputs = {
      descricao: data.descricao,
      valor: Number(data.valor),
      categoria: data.categoria,
      anexo: data.anexo,
      createdAt: data.createdAt,
      usuarioId: usuario.id,
      tagId: 1, // depois tem que alterar
      clienteId: Number(data.clienteId)
    }

    const response = await fetch(`${apiUrl}/receitas/${receita.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${usuario.token}`
      },
      body: JSON.stringify(receitaAtualizada)
    })

    if (response.status === 200) {
      toast.success("Receita atualizada com sucesso!")
      reset()
      getReceitas
      setOpenAlterarDados(false)
    } else {
      console.log(receitaAtualizada)
      toast.error("Erro... Não foi possível atualizar esta receita")
    }
  }

  async function excluirReceita() {

    const response = await fetch(`${apiUrl}/receitas/${receita.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${usuario.token}`
        },
      },
    )

    if (response.status == 200) {
      const receitas2 = receitas.filter(x => x.id != receita.id)
      setReceitas(receitas2)
      toast.success("Receita excluída com sucesso")
    } else {
      setOpenExcluirReceita(false)
      toast.error("Erro... Receita não foi excluída")
    }
  }

  function dataDMA(data: string) {
    if (data == null) {
      return "Data invalida"
    }

    const ano = data.substring(0, 4)
    const mes = data.substring(5, 7)
    const dia = data.substring(8, 10)
    return dia + "/" + mes + "/" + ano
  }

  return (
    <section>
      <div key={receita.id} className='flex flex-col gap-[0.44rem]'>
        <div className='bg-[#E2E2E2] py-[0.875rem] px-[1.06rem] rounded-[0.9375rem] flex flex-row justify-between items-center'>
          <p className='text-[#656565] font-inter font-normal text-[1rem]'>{dataDMA(receita.createdAt.toString())}</p>
          <p className='text-[#303030] font-inter font-semibold'>{Number(receita.valor).toLocaleString("pt-br", { minimumFractionDigits: 2 })}</p>
          <p className='text-[#656565] font-inter font-normal'>{receita.cliente.nome}</p>
          <p className='text-[#705519] font-inter text-[0.975rem] font-medium bg-[#F6DDA6] py-[0.10rem] px-[1.06rem] rounded-[0.46875rem] '>{receita.categoria}</p>
          <img src="/attachment.svg" alt="" />
          <DropdownMenu>
            <DropdownMenuTrigger><img src="/options.svg" alt="" /></DropdownMenuTrigger>
            <DropdownMenuContent className="font-inter">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setOpenAlterarDados(true)}>Alterar Dados</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenExcluirReceita(true)} className="text-[#c02424]">Excluir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Modal open={OpenAlterarDados} onClose={() => setOpenAlterarDados(false)}>
        <div className="container">
          <div className="container flex flex-col items-start">

            <div className='flex flex-row items-center gap-[0.7rem] justify-center'>
              <img src="/tabela.svg" className='w-[1.5rem] h-[1.5rem]' alt="" />
              <h2 className='text-center text-[1.4rem] font-inter font-semibold'>Alterar Dados</h2>
            </div>
          </div>
          <form className='container flex flex-col items-center'>
            <div className='flex flex-col items-center my-8 gap-8 w-[35rem]'>
              <div className='relative w-full'>
                <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                  DESCRIÇÃO
                </label>
                <input
                  type="text"
                  placeholder='Vendi duas camisetas M do Senac'
                  className='w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                  id="descricao"
                  {...register("descricao")}
                  required
                />
              </div>
              <div className='flex flex-col gap-8'>
                <div className='flex flex-row justify-between gap-12 w-[35rem]'>
                  <div className='relative w-full'>
                    <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                      VALOR
                    </label>
                    <input
                      type="number"
                      placeholder='R$800,00'
                      className='w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                      id="valor"
                      {...register("valor")}
                      required
                    />
                  </div>
                  <div className='relative w-full'>
                    <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                      DATA
                    </label>
                    <input
                      type="date"
                      placeholder='Vendi duas camisetas M do Senac'
                      className='w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                      id="data"
                      {...register("createdAt")}
                      required
                    />
                  </div>
                </div>
                <div className='flex flex-row justify-between gap-12 w-[35rem]'>
                  <div className='relative w-full'>
                    <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                      CLIENTE
                    </label>
                    <input
                      type="number"
                      placeholder='Selecionar Cliente'
                      className='w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                      id="cliente"
                      {...register("clienteId")}
                      required
                    />
                  </div>
                  <div className='relative w-full'>
                    <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                      CATEGORIA
                    </label>
                    <input
                      type="text"
                      placeholder='Selecionar Categoria'
                      className='w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                      id="categoria"
                      {...register("categoria")}
                      required
                    />
                  </div>
                </div>
                <div className='flex flex-row justify-between gap-12 w-[35rem]'>
                  <div className='relative w-full'>
                    <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                      ITENS VENDIDOS
                    </label>
                    <input
                      type="number"
                      placeholder='Selecionar Itens e Qtd'
                      className='w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                      id="itensVendidos"
                    />
                  </div>
                  <div className='relative w-full'>
                    <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                      ANEXO
                    </label>
                    <input
                      type="text"
                      placeholder='Adicionar Anexo'
                      className='w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                      id="anexo"
                      {...register("anexo")}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setOpenAlterarDados(false)} className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter hover:opacity-90 transition cursor-pointer"> Cancelar</button>
              <input type="submit" value="Confirmar" onClick={handleSubmit(atualizarReceita)} className="text-white bg-[#308021] rounded-md px-6 py-2 text-[1rem] font-bold hover:opacity-90 font-inter transition cursor-pointer" />
            </div>
          </form>
        </div>
      </Modal>

      <Modal open={OpenExcluirReceita} onClose={() => setOpenExcluirReceita(false)}>
        <div className="container">
          <div className="container flex flex-col items-start">

            <div className='flex flex-row items-center gap-[0.7rem] justify-center'>
              <img src="/tabela.svg" className='w-[1.5rem] h-[1.5rem]' alt="" />
              <h2 className='text-center text-[1.4rem] font-inter font-semibold'>Excluir Receita</h2>
            </div>
          </div>
          <div className='container flex flex-col items-center'>
            <div className='flex flex-col items-center my-6'>
              <p className='font-inter'>
                Você tem certeza que deseja apagar esta receita?
              </p>
              <p className='font-inter'>
                Após confirmar, essa ação será irreversível.
              </p>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setOpenExcluirReceita(false)} className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter hover:opacity-90 transition cursor-pointer"> Cancelar</button>
              <button onClick={excluirReceita} className="text-white bg-[#c02424] rounded-md px-6 py-2 text-[1rem] font-bold hover:opacity-90 font-inter transition cursor-pointer">Confirmar</button>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  )
}