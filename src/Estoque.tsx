import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom"
import { toast } from 'sonner'
import Titulo from './components/Titulo.js'
import Modal from "./components/Modal.js";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export default function Estoque() {
  const [openExcluir, setOpenExcluir] = useState(false)
  const [OpenAlterarDados, setOpenAlterarDados] = useState(false)
  const [OpenExcluirCliente, setOpenExcluirCliente] = useState(false)

  return (
    <>
      <Titulo />
      <section className='mt-[3rem] mb-[2rem] flex flex-col justify-center items-center'>
        <div className='w-[85.6875rem] flex flex-col gap-[1.44rem]'>
          <div className='flex flex-row items-center justify-between'>
            <div className='flex flex-row items-center gap-[0.7rem] justify-center'>
              <img src="/tabela.svg" className='w-[2rem] h-[2rem]' alt="" />
              <h2 className='text-center text-[2rem] font-inter font-semibold'>Estoque</h2>
            </div>
            <button onClick={() => setOpenExcluir(true)} className='flex text-white items-center justify-center rounded-[0.5rem] bg-[linear-gradient(139deg,_#114114_-40.56%,_#00C000_279.19%)] w-[12rem] h-[2.7rem] text-[1.25rem] font-roboto font-normal'>Adicionar</button>
          </div>
          <div className='bg-[#F5F5F5] px-[1.62rem] py-[1.93rem] rounded-[1rem] flex flex-col gap-[1.44rem]'>
            <div className='flex flex-col gap-[1.44rem]'>
              <div className='flex flex-row gap-[1.25rem]'>
                <div className='relative'>
                  <label className='absolute font-inter -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.6875rem] font-semibold tracking-wide'>
                    NOME
                  </label>
                  <input
                    type="text"
                    placeholder='Filtrar por Nome'
                    className='border-2 border-[#4A4B51] rounded-xl font-inter pl-5 w-[14.6875rem] h-[2.75rem] placeholder:text-[1rem] placeholder:font-normal placeholder:text-[#828386] text-[#4A4B51] text-lg font-medium bg-[#F5F5F5] outline-none focus:border-[#407B6A] transition-colors'
                    id="filtro_cliente"
                    required
                  />
                </div>
                <div className='relative'>
                  <label className='absolute font-inter -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.6875rem] font-semibold tracking-wide'>
                    FILTRO
                  </label>
                  <input
                    type="text"
                    placeholder='Selecionar Categoria'
                    className='border-2 border-[#4A4B51] rounded-xl font-inter pl-5 w-[13.6875rem] h-[2.75rem] placeholder:text-[1rem] placeholder:font-normal placeholder:text-[#828386] text-[#4A4B51] text-lg font-medium bg-[#F5F5F5] outline-none focus:border-[#407B6A] transition-colors'
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
                    className='border-2 border-[#4A4B51] rounded-xl font-inter pl-5 w-[14.6875rem] h-[2.75rem] placeholder:text-[1rem] placeholder:font-normal placeholder:text-[#828386] text-[#4A4B51] text-lg font-medium bg-[#F5F5F5] outline-none focus:border-[#407B6A] transition-colors'
                    id="filtro_cliente"
                    required
                  />
                </div>
              </div>
            </div>
            <div className='flex flex-row justify-between font-inter text-[1rem] font-normal mt-4'>
              <h2>Nome</h2>
              <h2 className='relative left-[1.3rem]'>Quantidade</h2>
              <h2 className='relative left-[2.5rem]'>Valor</h2>
              <h2 className='relative left-[4rem]'>Categoria</h2>
              <h2 className='relative left-[3.6rem]'>Anexo</h2>
              <h2>Opções</h2>
            </div>
            <div className='flex flex-col gap-[0.44rem]'>
              <div className='bg-[#E2E2E2] py-[0.875rem] px-[1.06rem] rounded-[0.9375rem] flex flex-row justify-between items-center'>
                <p className='text-[#656565] font-inter font-normal text-[1rem]'>Farinha</p>
                <p className='text-[#303030] font-inter font-semibold'>20kg e 800g</p>
                <p className='text-[#656565] font-inter font-normal'>R$19,99/Kg</p>
                <p className='text-[#705519] font-inter text-[0.975rem] font-medium bg-[#F6DDA6] py-[0.10rem] px-[1.06rem] rounded-[0.46875rem] '>Alimento</p>
                <img src="/attachment.svg" alt="" />
                <DropdownMenu>
                  <DropdownMenuTrigger><img src="/options.svg" alt="" /></DropdownMenuTrigger>
                  <DropdownMenuContent className="font-inter">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpenAlterarDados(true)}>Alterar Dados</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenExcluirCliente(true)} className="text-[#c02424]">Excluir</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </section >

      <Modal open={openExcluir} onClose={() => setOpenExcluir(false)}>
        <div className="container">
          <div className="container flex flex-col items-start">

            <div className='flex flex-row items-center gap-[0.7rem] justify-center'>
              <img src="/tabela.svg" className='w-[1.5rem] h-[1.5rem]' alt="" />
              <h2 className='text-center text-[1.4rem] font-inter font-semibold'>Adicionar Estoque</h2>
            </div>
          </div>
          <div className='container flex flex-col items-center'>
            <div className='flex flex-col items-center my-8 gap-8 w-[35rem]'>
              <div className='relative w-full'>
                <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                  NOME
                </label>
                <input
                  type="text"
                  placeholder='Farofa Yoki'
                  className='w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                  id="nome"
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
                      placeholder='R$14,99'
                      className='w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                      id="nome"
                      required
                    />
                  </div>
                  <div className='relative w-full'>
                    <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                      QUANTIDADE (GRAMAS)
                    </label>
                    <input
                      type="number"
                      placeholder='950g'
                      className='w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                      id="nome"
                      required
                    />
                  </div>
                </div>
                <div className='flex flex-row justify-between gap-12 w-[35rem]'>
                  <div className='relative w-full'>
                    <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                      CATEGORIA
                    </label>
                    <input
                      type="number"
                      placeholder='Selecionar Categoria'
                      className='w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                      id="nome"
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
                      id="nome"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setOpenExcluir(false)} className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter hover:opacity-90 transition cursor-pointer"> Cancelar</button>
              <button className="text-white bg-[#308021] rounded-md px-6 py-2 text-[1rem] font-bold hover:opacity-90 font-inter transition cursor-pointer">Confirmar</button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={OpenAlterarDados} onClose={() => setOpenAlterarDados(false)}>
        <div className="container">
          <div className="container flex flex-col items-start">

            <div className='flex flex-row items-center gap-[0.7rem] justify-center'>
              <img src="/tabela.svg" className='w-[1.5rem] h-[1.5rem]' alt="" />
              <h2 className='text-center text-[1.4rem] font-inter font-semibold'>Alterar Item do Estoque</h2>
            </div>
          </div>
          <div className='container flex flex-col items-center'>
            <div className='flex flex-col items-center my-8 gap-8 w-[35rem]'>
              <div className='relative w-full'>
                <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                  NOME
                </label>
                <input
                  type="text"
                  placeholder='Farofa Yoki'
                  className='w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                  id="nome"
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
                      placeholder='R$14,99'
                      className='w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                      id="nome"
                      required
                    />
                  </div>
                  <div className='relative w-full'>
                    <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                      QUANTIDADE (GRAMAS)
                    </label>
                    <input
                      type="number"
                      placeholder='950g'
                      className='w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                      id="nome"
                      required
                    />
                  </div>
                </div>
                <div className='flex flex-row justify-between gap-12 w-[35rem]'>
                  <div className='relative w-full'>
                    <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                      CATEGORIA
                    </label>
                    <input
                      type="number"
                      placeholder='Selecionar Categoria'
                      className='w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                      id="nome"
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
                      id="nome"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setOpenAlterarDados(false)} className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter hover:opacity-90 transition cursor-pointer"> Cancelar</button>
              <button className="text-white bg-[#308021] rounded-md px-6 py-2 text-[1rem] font-bold hover:opacity-90 font-inter transition cursor-pointer">Confirmar</button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={OpenExcluirCliente} onClose={() => setOpenExcluirCliente(false)}>
        <div className="container">
          <div className="container flex flex-col items-start">

            <div className='flex flex-row items-center gap-[0.7rem] justify-center'>
              <img src="/tabela.svg" className='w-[1.5rem] h-[1.5rem]' alt="" />
              <h2 className='text-center text-[1.4rem] font-inter font-semibold'>Excluir Item do Estoque</h2>
            </div>
          </div>
          <div className='container flex flex-col items-center'>
            <div className='flex flex-col items-center my-6'>
              <p className='font-inter'>
                Você tem certeza que deseja apagar este item do estoque?
              </p>
              <p className='font-inter'>
                Após confirmar, essa ação será irreversível.
              </p>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setOpenExcluirCliente(false)} className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter hover:opacity-90 transition cursor-pointer"> Cancelar</button>
              <button className="text-white bg-[#c02424] rounded-md px-6 py-2 text-[1rem] font-bold hover:opacity-90 font-inter transition cursor-pointer">Confirmar</button>
            </div>
          </div>
        </div>
      </Modal>
    </>

  )
}