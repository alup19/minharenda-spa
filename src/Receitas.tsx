import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom"
import { toast } from 'sonner'
import Titulo from './componentes/Titulo.js'

export default function Receitas() {

  return (
    <>
    <Titulo/>
    <section className='mt-[3rem] mb-[2rem] flex flex-col justify-center items-center'>
      <div className='w-[85.6875rem] flex flex-col gap-[1.44rem]'>
        <div className='flex flex-row items-center justify-between'>
          <div className='flex flex-row items-center gap-[0.7rem] justify-center'>
            <img src="/tabela.svg" className='w-[2rem] h-[2rem]' alt="" />
            <h2 className='text-center text-[2rem] font-inter font-semibold'>Receitas</h2>
          </div>
          <button className='flex text-white items-center justify-center rounded-[0.5rem] bg-[linear-gradient(139deg,_#114114_-40.56%,_#00C000_279.19%)] w-[12rem] h-[2.7rem] text-[1.25rem] font-roboto font-normal'>Adicionar</button>
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
          <div className='flex flex-col gap-[0.44rem]'>
            <div className='bg-[#E2E2E2] py-[0.875rem] px-[1.06rem] rounded-[0.9375rem] flex flex-row justify-between items-center'>
              <p className='text-[#656565] font-inter font-normal text-[1rem]'>16/08/2025</p>
              <p className='text-[#303030] font-inter font-semibold'>R$100,00</p>
              <p className='text-[#656565] font-inter font-normal'>Rodrigo Albano</p>
              <p className='text-[#705519] font-inter text-[0.975rem] font-medium bg-[#F6DDA6] py-[0.10rem] px-[1.06rem] rounded-[0.46875rem] '>Impostos e Taxas</p>
              <img src="/attachment.svg" alt="" />
              <img src="/options.svg" alt="" />
            </div>
            <div className='bg-[#E2E2E2] py-[0.875rem] px-[1.06rem] rounded-[0.9375rem] flex flex-row justify-between items-center'>
              <p className='text-[#656565] font-inter font-normal text-[1rem]'>16/08/2025</p>
              <p className='text-[#303030] font-inter font-semibold'>R$100,00</p>
              <p className='text-[#656565] font-inter font-normal'>Rodrigo Albano</p>
              <p className='text-[#705519] font-inter text-[0.975rem] font-medium bg-[#F6DDA6] py-[0.10rem] px-[1.06rem] rounded-[0.46875rem] '>Impostos e Taxas</p>
              <img src="/attachment.svg" alt="" />
              <img src="/options.svg" alt="" />
            </div>
            <div className='bg-[#E2E2E2] py-[0.875rem] px-[1.06rem] rounded-[0.9375rem] flex flex-row justify-between items-center'>
              <p className='text-[#656565] font-inter font-normal text-[1rem]'>16/08/2025</p>
              <p className='text-[#303030] font-inter font-semibold'>R$100,00</p>
              <p className='text-[#656565] font-inter font-normal'>Rodrigo Albano</p>
              <p className='text-[#705519] font-inter text-[0.975rem] font-medium bg-[#F6DDA6] py-[0.10rem] px-[1.06rem] rounded-[0.46875rem] '>Impostos e Taxas</p>
              <img src="/attachment.svg" alt="" />
              <img src="/options.svg" alt="" />
            </div>
            <div className='bg-[#E2E2E2] py-[0.875rem] px-[1.06rem] rounded-[0.9375rem] flex flex-row justify-between items-center'>
              <p className='text-[#656565] font-inter font-normal text-[1rem]'>16/08/2025</p>
              <p className='text-[#303030] font-inter font-semibold'>R$100,00</p>
              <p className='text-[#656565] font-inter font-normal'>Rodrigo Albano</p>
              <p className='text-[#705519] font-inter text-[0.975rem] font-medium bg-[#F6DDA6] py-[0.10rem] px-[1.06rem] rounded-[0.46875rem] '>Impostos e Taxas</p>
              <img src="/attachment.svg" alt="" />
              <img src="/options.svg" alt="" />
            </div>
            <div className='bg-[#E2E2E2] py-[0.875rem] px-[1.06rem] rounded-[0.9375rem] flex flex-row justify-between items-center'>
              <p className='text-[#656565] font-inter font-normal text-[1rem]'>16/08/2025</p>
              <p className='text-[#303030] font-inter font-semibold'>R$100,00</p>
              <p className='text-[#656565] font-inter font-normal'>Rodrigo Albano</p>
              <p className='text-[#705519] font-inter text-[0.975rem] font-medium bg-[#F6DDA6] py-[0.10rem] px-[1.06rem] rounded-[0.46875rem] '>Impostos e Taxas</p>
              <img src="/attachment.svg" alt="" />
              <img src="/options.svg" alt="" />
            </div>
            <div className='bg-[#E2E2E2] py-[0.875rem] px-[1.06rem] rounded-[0.9375rem] flex flex-row justify-between items-center'>
              <p className='text-[#656565] font-inter font-normal text-[1rem]'>16/08/2025</p>
              <p className='text-[#303030] font-inter font-semibold'>R$100,00</p>
              <p className='text-[#656565] font-inter font-normal'>Rodrigo Albano</p>
              <p className='text-[#705519] font-inter text-[0.975rem] font-medium bg-[#F6DDA6] py-[0.10rem] px-[1.06rem] rounded-[0.46875rem] '>Impostos e Taxas</p>
              <img src="/attachment.svg" alt="" />
              <img src="/options.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </section >
    </> 
  )
}