import { toast } from 'sonner'
import type { ClienteType } from "../utils/ClienteType";
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

interface listaClienteProps {
  cliente: ClienteType;
  clientes: ClienteType[];
  setClientes: React.Dispatch<React.SetStateAction<ClienteType[]>>;
}

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
  nome: string
  endereco: string
  telefone: string
  notas: string
  usuarioId: string
}

export default function ClienteItem({ cliente, clientes, setClientes }: listaClienteProps) {
  const { usuario } = useUsuarioStore()
  const [OpenAlterarCliente, setOpenAlterarClientes] = useState(false)
  const [OpenExcluirCliente, setOpenExcluirClientes] = useState(false)
  const { register, handleSubmit, reset, setFocus } = useForm<Inputs>()

  async function getClientes() {
    const response = await fetch(`${apiUrl}/clientes/${usuario.id}`)
    const dados = await response.json()
    setClientes(dados)
  }

  useEffect(() => {
    getClientes()
  }, [OpenAlterarCliente, setFocus("nome")])

  async function atualizarCliente(data: Inputs) {
    const payloadAtualizado: Inputs = {
      nome: data.nome,
      endereco: data.endereco,
      telefone: data.telefone,
      notas: data.notas,
      usuarioId: usuario.id
    }

    const response = await fetch(`${apiUrl}/clientes/${cliente.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${usuario.token}`
      },
      body: JSON.stringify(payloadAtualizado)
    })

    if (response.status === 200) {
      toast.success("Cliente atualizado com sucesso!")
      reset()
      setOpenAlterarClientes(false)
    } else {
      console.log(payloadAtualizado)
      toast.error("Erro... Não foi possível atualizar este Cliente")
    }
  }

  async function excluirCliente() {

    const response = await fetch(`${apiUrl}/clientes/${cliente.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${usuario.token}`
        },
      },
    )

    if (response.status == 200) {
      const receitas2 = clientes.filter(x => x.id != cliente.id)
      setClientes(receitas2)
      toast.success("Cliente excluído com sucesso")
    } else {
      setOpenExcluirClientes(false)
      toast.error("Erro... Cliente não foi excluído")
    }
  }

  return (
    <section>
      <div key={cliente.id} className='flex flex-col gap-[0.44rem]'>
        <div className='bg-[#E2E2E2] py-[0.875rem] px-[1.06rem] rounded-[0.9375rem] flex flex-row justify-between items-center'>
          <p className='text-[#656565] font-inter font-normal text-[1rem]'>{cliente.nome}</p>
          <p className='text-[#303030] font-inter font-semibold'>R$1500,00</p>
          <p className='text-[#656565] font-inter font-normal'>0</p>
          <img src="/article_p.svg" alt="" className="relative left-9 w-[2rem]" />
          <img src="/attachment.svg" alt="" />
          <DropdownMenu>
            <DropdownMenuTrigger><img src="/options.svg" alt="" /></DropdownMenuTrigger>
            <DropdownMenuContent className="font-inter">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setOpenAlterarClientes(true)}>Alterar Dados</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenExcluirClientes(true)} className="text-[#c02424]">Excluir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Modal open={OpenAlterarCliente} onClose={() => setOpenAlterarClientes(false)}>
        <div className="container">
          <div className="container flex flex-col items-start">

            <div className='flex flex-row items-center gap-[0.7rem] justify-center'>
              <img src="/tabela.svg" className='w-[1.5rem] h-[1.5rem]' alt="" />
              <h2 className='text-center text-[1.4rem] font-inter font-semibold'>Atualizar Cliente</h2>
            </div>
          </div>
          <form onSubmit={handleSubmit(atualizarCliente)} className='container flex flex-col items-center'>
            <div className='flex flex-col items-center my-8 gap-8 w-[35rem]'>
              <div className='relative w-full'>
                <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                  NOME DO CLIENTE
                </label>
                <input
                  type="text"
                  placeholder='José Almeida'
                  className='w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                  id="nome"
                  required
                  {...register("nome")}
                />
              </div>
              <div className='relative w-full'>
                <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                  NOTAS
                </label>
                <input
                  type="text"
                  placeholder='Bom pagador.'
                  className='w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                  id="notas"
                  required
                  {...register("notas")}
                />
              </div>
              <div className='relative w-full'>
                <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                  ENDEREÇO
                </label>
                <input
                  type="text"
                  placeholder='R. Das Flores, 105 - Centro'
                  className='w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                  id="endereco"
                  required
                  {...register("endereco")}
                />
              </div>
              <div className='relative w-full'>
                <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                  TELEFONE
                </label>
                <input
                  type="text"
                  placeholder='Digite o Telefone'
                  className='w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                  id="telefone"
                  required
                  {...register("telefone")}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setOpenAlterarClientes(false)} className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter hover:opacity-90 transition cursor-pointer"> Cancelar</button>
              <button type='submit' className="text-white bg-[#308021] rounded-md px-6 py-2 text-[1rem] font-bold hover:opacity-90 font-inter transition cursor-pointer">Confirmar</button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal open={OpenExcluirCliente} onClose={() => setOpenExcluirClientes(false)}>
        <div className="container">
          <div className="container flex flex-col items-start">

            <div className='flex flex-row items-center gap-[0.7rem] justify-center'>
              <img src="/tabela.svg" className='w-[1.5rem] h-[1.5rem]' alt="" />
              <h2 className='text-center text-[1.4rem] font-inter font-semibold'>Excluir Cliente</h2>
            </div>
          </div>
          <div className='container flex flex-col items-center'>
            <div className='flex flex-col items-center my-6'>
              <p className='font-inter'>
                Você tem certeza que deseja apagar os dados de <span className='font-inter font-bold'>{cliente.nome}</span>?
              </p>
              <p className='font-inter'>
                Após confirmar, essa ação será irreversível.
              </p>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setOpenExcluirClientes(false)} className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter hover:opacity-90 transition cursor-pointer"> Cancelar</button>
              <button onClick={excluirCliente} className="text-white bg-[#c02424] rounded-md px-6 py-2 text-[1rem] font-bold hover:opacity-90 font-inter transition cursor-pointer">Confirmar</button>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  )
}