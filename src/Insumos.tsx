// import { useForm } from 'react-hook-form'
// import { Link } from 'react-router-dom'
// import { useNavigate } from "react-router-dom"
// import { toast } from 'sonner'
import Titulo from './components/Titulo'
// import Modal from "./components/Modal.js";
// import { useState } from "react";


export default function Insumos() {

  return (
    <>
      <Titulo />
      <section className='flex flex-row items-start justify-center gap-[6rem]'>
        <section className='mt-[3rem] mb-[2rem] flex flex-col justify-center items-center gap-[1.88rem]'>
          <div className='flex flex-row items-center justify-center gap-[0.7rem]'>
            <img src="/tabela.svg" className='w-[2rem] h-[2rem]' alt="" />
            <h2 className='text-center text-[2rem] font-inter font-semibold'>Estoque</h2>
          </div>
          <div className='bg-[#F5F5F5] px-[1.62rem] flex flex-col py-[1.94rem] gap-4 rounded-[0.9375rem]'>
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
                  placeholder='Selecionar Filtro'
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
            <div className='flex flex-row justify-between font-inter text-[1rem] px-3 font-normal'>
              <h2>Nome</h2>
              <h2 className='relative right-4'>Quantidade</h2>
              <h2 className='relative right-6'>Valor</h2>
              <h2 className='relative'>Categoria</h2>
            </div>
            <div className='bg-[#E2E2E2] py-[0.875rem] px-[1.06rem] rounded-[0.9375rem] flex flex-row justify-between items-center'>
              <p className='text-[#656565] font-inter font-normal text-[1rem]'>Farinha</p>
              <p className='text-[#303030] font-inter font-semibold'>20kg e 800g</p>
              <p className='text-[#656565] font-inter font-normal'>R$19,99/Kg</p>
              <p className='text-[#705519] font-inter text-[0.975rem] font-medium bg-[#F6DDA6] py-[0.10rem] px-[1.06rem] rounded-[0.46875rem] '>Alimento</p>
            </div>
          </div>
        </section >

        <section className='mt-[3rem] mb-[2rem] flex flex-col justify-center items-center gap-[1.88rem]'>
          <div className='flex flex-row items-center justify-center gap-[0.7rem]'>
            <img src="/tabela.svg" className='w-[2rem] h-[2rem]' alt="" />
            <h2 className='text-center text-[2rem] font-inter font-semibold'>Insumos</h2>
          </div>
          <div className='bg-[#F5F5F5] px-[1.62rem] flex flex-col py-[1.94rem] gap-4 rounded-[0.9375rem]'>
            <div className='flex flex-row justify-between gap-[1.25rem]'>
              <div className='relative'>
                {/* INVÉS DE SER INPUT, A PESSOA CONSEGUIR ESCOLHER COM UM DROPDOWN */}
                <label className='absolute font-inter -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.6875rem] font-semibold tracking-wide'>
                  PRODUTO
                </label>
                <input
                  type="text"
                  placeholder='Produto Utilizado'
                  className='border-2 border-[#4A4B51] rounded-xl font-inter pl-5 w-[13.2rem] h-[2.75rem] placeholder:text-[1rem] placeholder:font-normal placeholder:text-[#828386] text-[#4A4B51] text-lg font-medium bg-[#F5F5F5] outline-none focus:border-[#407B6A] transition-colors'
                  id="filtro_cliente"
                  required
                />
              </div>
              <div className='relative'>
                <label className='absolute font-inter -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.6875rem] font-semibold tracking-wide'>
                  QUANTIDADE UTILIZADA
                </label>
                <input
                  type="text"
                  placeholder='Gramas utilizadas'
                  className='border-2 border-[#4A4B51] rounded-xl font-inter pl-5 w-[14.25rem] h-[2.75rem] placeholder:text-[1rem] placeholder:font-normal placeholder:text-[#828386] text-[#4A4B51] text-lg font-medium bg-[#F5F5F5] outline-none focus:border-[#407B6A] transition-colors'
                  id="filtro_cliente"
                  required
                />
              </div>
            </div>
            <div className='flex flex-row justify-between gap-[1.25rem]'>
              <div className='relative'>
                {/* INVÉS DE SER INPUT, A PESSOA CONSEGUIR ESCOLHER COM UM DROPDOWN */}
                <label className='absolute font-inter -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.6875rem] font-semibold tracking-wide'>
                  PRODUTO
                </label>
                <input
                  type="text"
                  placeholder='Produto Utilizado'
                  className='border-2 border-[#4A4B51] rounded-xl font-inter pl-5 w-[13.2rem] h-[2.75rem] placeholder:text-[1rem] placeholder:font-normal placeholder:text-[#828386] text-[#4A4B51] text-lg font-medium bg-[#F5F5F5] outline-none focus:border-[#407B6A] transition-colors'
                  id="filtro_cliente"
                  required
                />
              </div>
              <div className='relative'>
                <label className='absolute font-inter -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.6875rem] font-semibold tracking-wide'>
                  QUANTIDADE UTILIZADA
                </label>
                <input
                  type="text"
                  placeholder='Gramas utilizadas'
                  className='border-2 border-[#4A4B51] rounded-xl font-inter pl-5 w-[14.25rem] h-[2.75rem] placeholder:text-[1rem] placeholder:font-normal placeholder:text-[#828386] text-[#4A4B51] text-lg font-medium bg-[#F5F5F5] outline-none focus:border-[#407B6A] transition-colors'
                  id="filtro_cliente"
                  required
                />
              </div>
            </div>
            <div className='flex flex-row justify-between gap-[1.25rem]'>
              <div className='relative'>
                <label className='absolute font-inter -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.6875rem] font-semibold tracking-wide'>
                  MARGEM DE LUCRO
                </label>
                <input
                  type="number"
                  placeholder='10%'
                  className='border-2 border-[#4A4B51] rounded-xl font-inter pl-5 w-[13.2rem] h-[2.75rem] placeholder:text-[1rem] placeholder:font-normal placeholder:text-[#828386] text-[#4A4B51] text-lg font-medium bg-[#F5F5F5] outline-none focus:border-[#407B6A] transition-colors'
                  id="filtro_cliente"
                  required
                />
              </div>
              <div className='relative'>
                <label className='absolute font-inter -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.6875rem] font-semibold tracking-wide'>
                  UNIDADES PRODUZIDAS
                </label>
                <input
                  type="number"
                  placeholder='20 Unidades'
                  className='border-2 border-[#4A4B51] rounded-xl font-inter pl-5 w-[14.25rem] h-[2.75rem] placeholder:text-[1rem] placeholder:font-normal placeholder:text-[#828386] text-[#4A4B51] text-lg font-medium bg-[#F5F5F5] outline-none focus:border-[#407B6A] transition-colors'
                  id="filtro_cliente"
                  required
                />
              </div>
            </div>
            <div className='flex flex-row justify-between text-white font-roboto font-normal'>
              <button className='bg-[#407B6A] rounded-[0.44938rem] px-8 py-2'>Acrescentar Produto</button>
              <button className='bg-[#407B6A] rounded-[0.44938rem] px-8 py-2'>Remover Itens Estoque</button>
            </div>
            <hr />
            <div className='flex flex-col gap-[0.75rem]'>
              <div className='flex flex-row justify-between font-inter text-[#656565] bg-[#E2E2E2] rounded-[0.9375rem] py-[0.875rem] px-[1.0625rem]'>
                <h3>Em produtos, você irá gastar:</h3>
                <p className='text-[#3a3a3a] font-medium'>800g</p>
              </div>
              <div className='flex flex-row justify-between font-inter text-[#656565] bg-[#E2E2E2] rounded-[0.9375rem] py-[0.875rem] px-[1.0625rem]'>
                <h3>Você teve um gasto de:</h3>
                <p className='text-[#3a3a3a] font-medium'>R$21,85</p>
              </div>
              <div className='flex flex-row justify-between font-inter text-[#656565] bg-[#E2E2E2] rounded-[0.9375rem] py-[0.875rem] px-[1.0625rem]'>
                <h3>Com 10% de margem, cada unidade será:</h3>
                <p className='text-[#3a3a3a] font-medium'>R$4,95</p>
              </div>
              <div className='flex flex-row justify-between font-inter text-[#656565] bg-[#E2E2E2] rounded-[0.9375rem] py-[0.875rem] px-[1.0625rem]'>
                <h3>Você terá um lucro total de:</h3>
                <p className='text-[#3a3a3a] font-medium'>R$51,84</p>
              </div>
            </div>
          </div>
        </section >
      </section>
    </>

  )
}