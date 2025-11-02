// import { Link } from 'react-router-dom'
// import { useNavigate } from "react-router-dom"
import { toast } from 'sonner'
import Titulo from './components/Titulo.js'
import Modal from "./components/Modal.js";
import { useEffect, useState } from "react";
import ReceitaItem from './components/ReceitaItem';
import type { ReceitaType } from "./utils/ReceitaType";
import { useForm } from 'react-hook-form';
import { useUsuarioStore } from './context/UsuarioContext.js';

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

export default function Receitas() {
  const { usuario } = useUsuarioStore()
  const { register, handleSubmit, reset, setFocus } = useForm<Inputs>()
  const [receitas, setReceitas] = useState<ReceitaType[]>([])
  const [openCriar, setOpenCriar] = useState(false)

  async function getReceitas() {
    const response = await fetch(`${apiUrl}/receitas`)
    const dados = await response.json()
    setReceitas(dados)
  }

  useEffect(() => {
    getReceitas()
  }, [openCriar, setFocus("descricao")])

  const listaReceitas = receitas.map(receita => (
    <ReceitaItem key={receita.id} receita={receita} receitas={receitas} setReceitas={setReceitas} />
  ))

  async function incluirReceita(data: Inputs) {

    const novaReceita: Inputs = {
      descricao: data.descricao,
      valor: Number(data.valor),
      categoria: data.categoria,
      anexo: data.anexo,
      createdAt: data.createdAt,
      usuarioId: usuario.id,
      tagId: 1, // tem que mudar isso
      clienteId: Number(data.clienteId),
    }

    
    const response = await fetch(`${apiUrl}/receitas`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${usuario.token}`
        },
        body: JSON.stringify(novaReceita)
      })
      
      if (response.status == 201) {
        toast.success("Receita criada com sucesso!")
        reset()
        getReceitas()
        setOpenCriar(false)
      } else {
      console.log(novaReceita)
      toast.error("Erro... Não foi possivel criar esta Receita")
    }
  }

  return (
    <>
      <Titulo />
      <section className='mt-[3rem] mb-[2rem] flex flex-col justify-center items-center'>
        <div className='w-[85.6875rem] flex flex-col gap-[1.44rem]'>
          <div className='flex flex-row items-center justify-between'>
            <div className='flex flex-row items-center gap-[0.7rem] justify-center'>
              <img src="/tabela.svg" className='w-[2rem] h-[2rem]' alt="" />
              <h2 className='text-center text-[2rem] font-inter font-semibold'>Receitas</h2>
            </div>
            <button onClick={() => setOpenCriar(true)} className='flex text-white items-center justify-center rounded-[0.5rem] bg-[linear-gradient(139deg,_#114114_-40.56%,_#00C000_279.19%)] w-[12rem] h-[2.7rem] text-[1.25rem] font-roboto font-normal'>Adicionar</button>
          </div>
          <div className='bg-[#F5F5F5] px-[1.62rem] py-[1.93rem] rounded-[1rem] flex flex-col gap-[1.44rem]'>
            <div className='flex flex-col gap-[1.44rem]'>
              <div className='flex flex-row justify-between'>
                <div className='flex flex-row items-center gap-[1.125rem]'>
                  <img src="/arrow_l.svg" alt="" />
                  <h3 className='text-[1.5rem] font-inter font-semibold'>Setembro</h3>
                  <img src="/arrow_r.svg" alt="" />
                </div>
                <div className='flex flex-row gap-[1.25rem]'>
                  <div className='relative'>
                    <label className='absolute font-inter -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.6875rem] font-semibold tracking-wide'>
                      CLIENTE
                    </label>
                    <input
                      type="text"
                      placeholder='Filtrar por Cliente'
                      className='border-2 border-[#4A4B51] rounded-xl font-inter pl-5 w-[14.6875rem h-[2.75rem] placeholder:text-[1rem] placeholder:font-normal placeholder:text-[#828386] text-[#4A4B51] text-lg font-medium bg-[#F5F5F5] outline-none focus:border-[#407B6A] transition-colors'
                      id="filtro_cliente"
                      required
                    />
                  </div>
                  <div className='relative'>
                    <label className='absolute font-inter -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.6875rem] font-semibold tracking-wide'>
                      CATEGORIA
                    </label>
                    <input
                      type="text"
                      placeholder='Selecionar Categoria'
                      className='border-2 border-[#4A4B51] rounded-xl font-inter pl-5 w-[14.6875rem h-[2.75rem] placeholder:text-[1rem] placeholder:font-normal placeholder:text-[#828386] text-[#4A4B51] text-lg font-medium bg-[#F5F5F5] outline-none focus:border-[#407B6A] transition-colors'
                      id="filtro_cliente"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-row justify-between font-inter text-[1rem] font-normal mt-4'>
              <h2>Data da Receita</h2>
              <h2 className='relative right-4'>Valor</h2>
              <h2 className='relative left-1'>Cliente</h2>
              <h2 className='relative left-[3.5rem]'>Categoria</h2>
              <h2 className='relative left-[4.2rem]'>Anexo</h2>
              <h2>Opções</h2>
            </div>
            {listaReceitas}
          </div>
        </div>
      </section >

      <Modal open={openCriar} onClose={() => setOpenCriar(false)}>
        <div className="container">
          <div className="container flex flex-col items-start">

            <div className='flex flex-row items-center gap-[0.7rem] justify-center'>
              <img src="/tabela.svg" className='w-[1.5rem] h-[1.5rem]' alt="" />
              <h2 className='text-center text-[1.4rem] font-inter font-semibold'>Adicionar Receita</h2>
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
              <button onClick={() => setOpenCriar(false)} className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter hover:opacity-90 transition cursor-pointer"> Cancelar</button>
              <input type="submit" value="Confirmar" onClick={handleSubmit(incluirReceita)} className="text-white bg-[#308021] rounded-md px-6 py-2 text-[1rem] font-bold hover:opacity-90 font-inter transition cursor-pointer" />
            </div>
          </form>
        </div>
      </Modal>
    </>
  )
}