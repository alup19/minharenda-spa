import './tailwind.css'
import Titulo from './components/Titulo.js'

export default function App() {

  return (
    <>
      <Titulo />
      <section className='mt-[3rem] mb-[2rem] flex flex-col justify-center items-center gap-[2.63rem]'>
        <section className="bg-[#F5F5F5] rounded-[1.25rem] w-[83vw] flex items-center justify-between px-20 py-[2.3125rem]">
          <div className='flex flex-col items-start gap-3'>
            <h2 className='text-[#2A2A2A] font-inter text-[1.25rem] font-semibold'>Olá Alberto, como você está hoje?</h2>
            <div className="flex items-stretch font-inter text-[1rem]">
              <div className="flex flex-col items-center justify-center pr-[1.06rem]">
                <h2 className="text-[#4A4B51] font-semibold">Receita Total</h2>
                <h3 className="text-[#407B6A] font-medium text-[1.3rem]">R$800,00</h3>
              </div>

              <div className="w-[0.1rem] rounded-[0.9375rem] bg-[#B7BBC7] mx-[1.06rem]" />

              <div className="flex flex-col items-center justify-center px-[1.06rem]">
                <h2 className="text-[#4A4B51] font-semibold">Despesas Totais</h2>
                <h3 className="text-[#CA3030] font-medium text-[1.3rem]">R$200,00</h3>
              </div>

              <div className="w-[0.1rem] rounded-[0.9375rem] bg-[#B7BBC7] mx-[1.06rem]" />

              <div className="flex flex-col items-center justify-center px-[1.06rem]">
                <h2 className="text-[#4A4B51] font-semibold">Lucro Líquido</h2>
                <h3 className="text-[#407B6A] font-medium text-[1.3rem]">R$600,00</h3>
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

        <section className='flex flex-row justify-between w-[83vw] items-start'>

          <section className='flex flex-col gap-[1rem] bg-[#F5F5F5] rounded-[1.275rem] px-[1.5625rem] py-[1.4375rem]'>
            <div className='flex flex-row items-center gap-[0.75rem]'>
              <img src="/tabela.svg" alt="" className='w-[1.675rem]' />
              <h3 className='font-inter text-[1.25rem] font-semibold'>Últimas Despesas</h3>
            </div>
            <hr className='h-[0.1225rem] bg-[#D9D9D9]' />
            <div className='flex flex-col gap-[0.5rem]'>
              <div className='flex flex-row items-center gap-[3.75rem] bg-[#E2E2E2] px-[1.0625rem] py-[0.875rem] rounded-[0.9375rem]'>
                <div className='flex flex-row gap-[0.81rem]'>
                  <img src="/launch.svg" alt="" className='rotate-[180deg]' />
                  <p className='text-[#656565] font-inter font-normal'>16 ago.</p>
                </div>
                <p className='font-inter font-semibold text-[#303030]'>R$100,00</p>
                <div className='flex flex-row gap-[1.1875rem]'>
                  <p className="text-[#705519] font-inter text-[0.975rem] py-[0.25rem] px-[1.0625rem] text-center font-medium bg-[#F6DDA6] rounded-[0.46875rem] ">
                    Impostos e Taxas
                  </p>
                  <img src="/options.svg" alt="opções" />
                </div>
              </div>
              <div className='flex flex-row items-center gap-[3.75rem] bg-[#E2E2E2] px-[1.0625rem] py-[0.875rem] rounded-[0.9375rem]'>
                <div className='flex flex-row gap-[0.81rem]'>
                  <img src="/launch.svg" alt="" className='rotate-[180deg]' />
                  <p className='text-[#656565] font-inter font-normal'>16 ago.</p>
                </div>
                <p className='font-inter font-semibold text-[#303030]'>R$100,00</p>
                <div className='flex flex-row gap-[1.1875rem]'>
                  <p className="text-[#705519] font-inter text-[0.975rem] py-[0.25rem] px-[1.0625rem] text-center font-medium bg-[#F6DDA6] rounded-[0.46875rem] ">
                    Impostos e Taxas
                  </p>
                  <img src="/options.svg" alt="opções" />
                </div>
              </div>
              <div className='flex flex-row items-center gap-[3.75rem] bg-[#E2E2E2] px-[1.0625rem] py-[0.875rem] rounded-[0.9375rem]'>
                <div className='flex flex-row gap-[0.81rem]'>
                  <img src="/launch.svg" alt="" className='rotate-[180deg]' />
                  <p className='text-[#656565] font-inter font-normal'>16 ago.</p>
                </div>
                <p className='font-inter font-semibold text-[#303030]'>R$100,00</p>
                <div className='flex flex-row gap-[1.1875rem]'>
                  <p className="text-[#705519] font-inter text-[0.975rem] py-[0.25rem] px-[1.0625rem] text-center font-medium bg-[#F6DDA6] rounded-[0.46875rem] ">
                    Impostos e Taxas
                  </p>
                  <img src="/options.svg" alt="opções" />
                </div>
              </div>
              <div className='flex flex-row items-center gap-[3.75rem] bg-[#E2E2E2] px-[1.0625rem] py-[0.875rem] rounded-[0.9375rem]'>
                <div className='flex flex-row gap-[0.81rem]'>
                  <img src="/launch.svg" alt="" className='rotate-[180deg]' />
                  <p className='text-[#656565] font-inter font-normal'>16 ago.</p>
                </div>
                <p className='font-inter font-semibold text-[#303030]'>R$100,00</p>
                <div className='flex flex-row gap-[1.1875rem]'>
                  <p className="text-[#705519] font-inter text-[0.975rem] py-[0.25rem] px-[1.0625rem] text-center font-medium bg-[#F6DDA6] rounded-[0.46875rem] ">
                    Impostos e Taxas
                  </p>
                  <img src="/options.svg" alt="opções" />
                </div>
              </div>
              <div className='flex flex-row items-center gap-[3.75rem] bg-[#E2E2E2] px-[1.0625rem] py-[0.875rem] rounded-[0.9375rem]'>
                <div className='flex flex-row gap-[0.81rem]'>
                  <img src="/launch.svg" alt="" className='rotate-[180deg]' />
                  <p className='text-[#656565] font-inter font-normal'>16 ago.</p>
                </div>
                <p className='font-inter font-semibold text-[#303030]'>R$100,00</p>
                <div className='flex flex-row gap-[1.1875rem]'>
                  <p className="text-[#705519] font-inter text-[0.975rem] py-[0.25rem] px-[1.0625rem] text-center font-medium bg-[#F6DDA6] rounded-[0.46875rem] ">
                    Impostos e Taxas
                  </p>
                  <img src="/options.svg" alt="opções" />
                </div>
              </div>
              <div className='flex flex-row items-center gap-[3.75rem] bg-[#E2E2E2] px-[1.0625rem] py-[0.875rem] rounded-[0.9375rem]'>
                <div className='flex flex-row gap-[0.81rem]'>
                  <img src="/launch.svg" alt="" className='rotate-[180deg]' />
                  <p className='text-[#656565] font-inter font-normal'>16 ago.</p>
                </div>
                <p className='font-inter font-semibold text-[#303030]'>R$100,00</p>
                <div className='flex flex-row gap-[1.1875rem]'>
                  <p className="text-[#705519] font-inter text-[0.975rem] py-[0.25rem] px-[1.0625rem] text-center font-medium bg-[#F6DDA6] rounded-[0.46875rem] ">
                    Impostos e Taxas
                  </p>
                  <img src="/options.svg" alt="opções" />
                </div>
              </div>
              <div className='flex flex-row items-center gap-[3.75rem] bg-[#E2E2E2] px-[1.0625rem] py-[0.875rem] rounded-[0.9375rem]'>
                <div className='flex flex-row gap-[0.81rem]'>
                  <img src="/launch.svg" alt="" className='rotate-[180deg]' />
                  <p className='text-[#656565] font-inter font-normal'>16 ago.</p>
                </div>
                <p className='font-inter font-semibold text-[#303030]'>R$100,00</p>
                <div className='flex flex-row gap-[1.1875rem]'>
                  <p className="text-[#705519] font-inter text-[0.975rem] py-[0.25rem] px-[1.0625rem] text-center font-medium bg-[#F6DDA6] rounded-[0.46875rem] ">
                    Impostos e Taxas
                  </p>
                  <img src="/options.svg" alt="opções" />
                </div>
              </div>
              <div className='flex flex-row items-center gap-[3.75rem] bg-[#E2E2E2] px-[1.0625rem] py-[0.875rem] rounded-[0.9375rem]'>
                <div className='flex flex-row gap-[0.81rem]'>
                  <img src="/launch.svg" alt="" className='rotate-[180deg]' />
                  <p className='text-[#656565] font-inter font-normal'>16 ago.</p>
                </div>
                <p className='font-inter font-semibold text-[#303030]'>R$100,00</p>
                <div className='flex flex-row gap-[1.1875rem]'>
                  <p className="text-[#705519] font-inter text-[0.975rem] py-[0.25rem] px-[1.0625rem] text-center font-medium bg-[#F6DDA6] rounded-[0.46875rem] ">
                    Impostos e Taxas
                  </p>
                  <img src="/options.svg" alt="opções" />
                </div>
              </div>
              <div className='flex flex-row items-center gap-[3.75rem] bg-[#E2E2E2] px-[1.0625rem] py-[0.875rem] rounded-[0.9375rem]'>
                <div className='flex flex-row gap-[0.81rem]'>
                  <img src="/launch.svg" alt="" className='rotate-[180deg]' />
                  <p className='text-[#656565] font-inter font-normal'>16 ago.</p>
                </div>
                <p className='font-inter font-semibold text-[#303030]'>R$100,00</p>
                <div className='flex flex-row gap-[1.1875rem]'>
                  <p className="text-[#705519] font-inter text-[0.975rem] py-[0.25rem] px-[1.0625rem] text-center font-medium bg-[#F6DDA6] rounded-[0.46875rem] ">
                    Impostos e Taxas
                  </p>
                  <img src="/options.svg" alt="opções" />
                </div>
              </div>
              <div className='flex flex-row items-center gap-[3.75rem] bg-[#E2E2E2] px-[1.0625rem] py-[0.875rem] rounded-[0.9375rem]'>
                <div className='flex flex-row gap-[0.81rem]'>
                  <img src="/launch.svg" alt="" className='rotate-[180deg]' />
                  <p className='text-[#656565] font-inter font-normal'>16 ago.</p>
                </div>
                <p className='font-inter font-semibold text-[#303030]'>R$100,00</p>
                <div className='flex flex-row gap-[1.1875rem]'>
                  <p className="text-[#705519] font-inter text-[0.975rem] py-[0.25rem] px-[1.0625rem] text-center font-medium bg-[#F6DDA6] rounded-[0.46875rem] ">
                    Impostos e Taxas
                  </p>
                  <img src="/options.svg" alt="opções" />
                </div>
              </div>

            </div>
          </section>

          <section className='flex flex-col gap-[1rem] bg-[#F5F5F5] rounded-[1.275rem] px-[1.5625rem] py-[1.4375rem]'>
            <div className='flex flex-row items-center gap-[0.75rem]'>
              <img src="/tabela.svg" alt="" className='w-[1.675rem]' />
              <h3 className='font-inter text-[1.25rem] font-semibold'>Últimas Despesas</h3>
            </div>
            <hr className='h-[0.1225rem] bg-[#D9D9D9]' />
            <div className='flex flex-col gap-[0.5rem]'>
              <div className='flex flex-row items-center gap-[3.75rem] bg-[#E2E2E2] px-[1.0625rem] py-[0.875rem] rounded-[0.9375rem]'>
                <div className='flex flex-row gap-[0.81rem]'>
                  <img src="/launch.svg" alt="" className='rotate-[180deg]' />
                  <p className='text-[#656565] font-inter font-normal'>16 ago.</p>
                </div>
                <p className='font-inter font-semibold text-[#303030]'>R$100,00</p>
                <div className='flex flex-row gap-[1.1875rem]'>
                  <p className="text-[#705519] font-inter text-[0.975rem] py-[0.25rem] px-[1.0625rem] text-center font-medium bg-[#F6DDA6] rounded-[0.46875rem] ">
                    Impostos e Taxas
                  </p>
                  <img src="/options.svg" alt="opções" />
                </div>
              </div>
              <div className='flex flex-row items-center gap-[3.75rem] bg-[#E2E2E2] px-[1.0625rem] py-[0.875rem] rounded-[0.9375rem]'>
                <div className='flex flex-row gap-[0.81rem]'>
                  <img src="/launch.svg" alt="" className='rotate-[180deg]' />
                  <p className='text-[#656565] font-inter font-normal'>16 ago.</p>
                </div>
                <p className='font-inter font-semibold text-[#303030]'>R$100,00</p>
                <div className='flex flex-row gap-[1.1875rem]'>
                  <p className="text-[#705519] font-inter text-[0.975rem] py-[0.25rem] px-[1.0625rem] text-center font-medium bg-[#F6DDA6] rounded-[0.46875rem] ">
                    Impostos e Taxas
                  </p>
                  <img src="/options.svg" alt="opções" />
                </div>
              </div>
              <div className='flex flex-row items-center gap-[3.75rem] bg-[#E2E2E2] px-[1.0625rem] py-[0.875rem] rounded-[0.9375rem]'>
                <div className='flex flex-row gap-[0.81rem]'>
                  <img src="/launch.svg" alt="" className='rotate-[180deg]' />
                  <p className='text-[#656565] font-inter font-normal'>16 ago.</p>
                </div>
                <p className='font-inter font-semibold text-[#303030]'>R$100,00</p>
                <div className='flex flex-row gap-[1.1875rem]'>
                  <p className="text-[#705519] font-inter text-[0.975rem] py-[0.25rem] px-[1.0625rem] text-center font-medium bg-[#F6DDA6] rounded-[0.46875rem] ">
                    Impostos e Taxas
                  </p>
                  <img src="/options.svg" alt="opções" />
                </div>
              </div>
              <div className='flex flex-row items-center gap-[3.75rem] bg-[#E2E2E2] px-[1.0625rem] py-[0.875rem] rounded-[0.9375rem]'>
                <div className='flex flex-row gap-[0.81rem]'>
                  <img src="/launch.svg" alt="" className='rotate-[180deg]' />
                  <p className='text-[#656565] font-inter font-normal'>16 ago.</p>
                </div>
                <p className='font-inter font-semibold text-[#303030]'>R$100,00</p>
                <div className='flex flex-row gap-[1.1875rem]'>
                  <p className="text-[#705519] font-inter text-[0.975rem] py-[0.25rem] px-[1.0625rem] text-center font-medium bg-[#F6DDA6] rounded-[0.46875rem] ">
                    Impostos e Taxas
                  </p>
                  <img src="/options.svg" alt="opções" />
                </div>
              </div>
              <div className='flex flex-row items-center gap-[3.75rem] bg-[#E2E2E2] px-[1.0625rem] py-[0.875rem] rounded-[0.9375rem]'>
                <div className='flex flex-row gap-[0.81rem]'>
                  <img src="/launch.svg" alt="" className='rotate-[180deg]' />
                  <p className='text-[#656565] font-inter font-normal'>16 ago.</p>
                </div>
                <p className='font-inter font-semibold text-[#303030]'>R$100,00</p>
                <div className='flex flex-row gap-[1.1875rem]'>
                  <p className="text-[#705519] font-inter text-[0.975rem] py-[0.25rem] px-[1.0625rem] text-center font-medium bg-[#F6DDA6] rounded-[0.46875rem] ">
                    Impostos e Taxas
                  </p>
                  <img src="/options.svg" alt="opções" />
                </div>
              </div>
              <div className='flex flex-row items-center gap-[3.75rem] bg-[#E2E2E2] px-[1.0625rem] py-[0.875rem] rounded-[0.9375rem]'>
                <div className='flex flex-row gap-[0.81rem]'>
                  <img src="/launch.svg" alt="" className='rotate-[180deg]' />
                  <p className='text-[#656565] font-inter font-normal'>16 ago.</p>
                </div>
                <p className='font-inter font-semibold text-[#303030]'>R$100,00</p>
                <div className='flex flex-row gap-[1.1875rem]'>
                  <p className="text-[#705519] font-inter text-[0.975rem] py-[0.25rem] px-[1.0625rem] text-center font-medium bg-[#F6DDA6] rounded-[0.46875rem] ">
                    Impostos e Taxas
                  </p>
                  <img src="/options.svg" alt="opções" />
                </div>
              </div>
              <div className='flex flex-row items-center gap-[3.75rem] bg-[#E2E2E2] px-[1.0625rem] py-[0.875rem] rounded-[0.9375rem]'>
                <div className='flex flex-row gap-[0.81rem]'>
                  <img src="/launch.svg" alt="" className='rotate-[180deg]' />
                  <p className='text-[#656565] font-inter font-normal'>16 ago.</p>
                </div>
                <p className='font-inter font-semibold text-[#303030]'>R$100,00</p>
                <div className='flex flex-row gap-[1.1875rem]'>
                  <p className="text-[#705519] font-inter text-[0.975rem] py-[0.25rem] px-[1.0625rem] text-center font-medium bg-[#F6DDA6] rounded-[0.46875rem] ">
                    Impostos e Taxas
                  </p>
                  <img src="/options.svg" alt="opções" />
                </div>
              </div>
              <div className='flex flex-row items-center gap-[3.75rem] bg-[#E2E2E2] px-[1.0625rem] py-[0.875rem] rounded-[0.9375rem]'>
                <div className='flex flex-row gap-[0.81rem]'>
                  <img src="/launch.svg" alt="" className='rotate-[180deg]' />
                  <p className='text-[#656565] font-inter font-normal'>16 ago.</p>
                </div>
                <p className='font-inter font-semibold text-[#303030]'>R$100,00</p>
                <div className='flex flex-row gap-[1.1875rem]'>
                  <p className="text-[#705519] font-inter text-[0.975rem] py-[0.25rem] px-[1.0625rem] text-center font-medium bg-[#F6DDA6] rounded-[0.46875rem] ">
                    Impostos e Taxas
                  </p>
                  <img src="/options.svg" alt="opções" />
                </div>
              </div>
              <div className='flex flex-row items-center gap-[3.75rem] bg-[#E2E2E2] px-[1.0625rem] py-[0.875rem] rounded-[0.9375rem]'>
                <div className='flex flex-row gap-[0.81rem]'>
                  <img src="/launch.svg" alt="" className='rotate-[180deg]' />
                  <p className='text-[#656565] font-inter font-normal'>16 ago.</p>
                </div>
                <p className='font-inter font-semibold text-[#303030]'>R$100,00</p>
                <div className='flex flex-row gap-[1.1875rem]'>
                  <p className="text-[#705519] font-inter text-[0.975rem] py-[0.25rem] px-[1.0625rem] text-center font-medium bg-[#F6DDA6] rounded-[0.46875rem] ">
                    Impostos e Taxas
                  </p>
                  <img src="/options.svg" alt="opções" />
                </div>
              </div>
              <div className='flex flex-row items-center gap-[3.75rem] bg-[#E2E2E2] px-[1.0625rem] py-[0.875rem] rounded-[0.9375rem]'>
                <div className='flex flex-row gap-[0.81rem]'>
                  <img src="/launch.svg" alt="" className='rotate-[180deg]' />
                  <p className='text-[#656565] font-inter font-normal'>16 ago.</p>
                </div>
                <p className='font-inter font-semibold text-[#303030]'>R$100,00</p>
                <div className='flex flex-row gap-[1.1875rem]'>
                  <p className="text-[#705519] font-inter text-[0.975rem] py-[0.25rem] px-[1.0625rem] text-center font-medium bg-[#F6DDA6] rounded-[0.46875rem] ">
                    Impostos e Taxas
                  </p>
                  <img src="/options.svg" alt="opções" />
                </div>
              </div>
            </div>
          </section>

          <section className='flex flex-col justify-center gap-4'>
            <section className='flex flex-row items-start gap-4'>

              <section className='flex flex-col py-[1.4375rem] px-[1.3875rem] bg-[#F5F5F5] rounded-[1.275rem] gap-[1rem]'>
                <h2 className='font-inter text-center text-[1.25rem] font-semibold'>Produtos + Vendidos</h2>
                <hr className='h-[0.1225rem] bg-[#D9D9D9]'/>
                <div className='flex flex-col gap-[0.625rem]'>
                  <div className='flex flex-row justify-between'>
                    <p className='text-[#656565] font-inter font-normal'>Coca-Cola</p>
                    <p className='text-[#656565] font-inter font-semibold'>10 Vendas</p>
                  </div>
                  <div className='flex flex-row justify-between'>
                    <p className='text-[#656565] font-inter font-normal'>Coca-Cola</p>
                    <p className='text-[#656565] font-inter font-semibold'>10 Vendas</p>
                  </div>
                  <div className='flex flex-row justify-between'>
                    <p className='text-[#656565] font-inter font-normal'>Coca-Cola</p>
                    <p className='text-[#656565] font-inter font-semibold'>10 Vendas</p>
                  </div>
                  <div className='flex flex-row justify-between'>
                    <p className='text-[#656565] font-inter font-normal'>Coca-Cola</p>
                    <p className='text-[#656565] font-inter font-semibold'>10 Vendas</p>
                  </div>
                  <div className='flex flex-row justify-between'>
                    <p className='text-[#656565] font-inter font-normal'>Coca-Cola</p>
                    <p className='text-[#656565] font-inter font-semibold'>10 Vendas</p>
                  </div>
                  <div className='flex flex-row justify-between'>
                    <p className='text-[#656565] font-inter font-normal'>Coca-Cola</p>
                    <p className='text-[#656565] font-inter font-semibold'>10 Vendas</p>
                  </div>
                  <div className='flex flex-row justify-between'>
                    <p className='text-[#656565] font-inter font-normal'>Coca-Cola</p>
                    <p className='text-[#656565] font-inter font-semibold'>10 Vendas</p>
                  </div>
                  <div className='flex flex-row justify-between'>
                    <p className='text-[#656565] font-inter font-normal'>Coca-Cola</p>
                    <p className='text-[#656565] font-inter font-semibold'>10 Vendas</p>
                  </div>
                  <div className='flex flex-row justify-between'>
                    <p className='text-[#656565] font-inter font-normal'>Coca-Cola</p>
                    <p className='text-[#656565] font-inter font-semibold'>10 Vendas</p>
                  </div>
                  <div className='flex flex-row justify-between'>
                    <p className='text-[#656565] font-inter font-normal'>Coca-Cola</p>
                    <p className='text-[#656565] font-inter font-semibold'>10 Vendas</p>
                  </div>
                </div>
              </section>

              <section className='flex flex-col py-[1.4375rem] px-[1.3875rem] bg-[#F5F5F5] rounded-[1.275rem] gap-[1rem]'>
                <h2 className='font-inter text-center text-[1.25rem] font-semibold'>Top Clientes</h2>
                <hr className='h-[0.1225rem] bg-[#D9D9D9]'/>
                <div className='flex flex-col gap-[0.625rem]'>
                  <div className='flex flex-row justify-between w-[10rem]'>
                    <p className='text-[#656565] font-inter font-normal'>Lucas M.</p>
                    <p className='text-[#656565] font-inter font-semibold'>R$500,00</p>
                  </div>
                  <div className='flex flex-row justify-between w-[10rem]'>
                    <p className='text-[#656565] font-inter font-normal'>Lucas M.</p>
                    <p className='text-[#656565] font-inter font-semibold'>R$500,00</p>
                  </div>
                  <div className='flex flex-row justify-between w-[10rem]'>
                    <p className='text-[#656565] font-inter font-normal'>Lucas M.</p>
                    <p className='text-[#656565] font-inter font-semibold'>R$500,00</p>
                  </div>
                  <div className='flex flex-row justify-between w-[10rem]'>
                    <p className='text-[#656565] font-inter font-normal'>Lucas M.</p>
                    <p className='text-[#656565] font-inter font-semibold'>R$500,00</p>
                  </div>
                  <div className='flex flex-row justify-between w-[10rem]'>
                    <p className='text-[#656565] font-inter font-normal'>Lucas M.</p>
                    <p className='text-[#656565] font-inter font-semibold'>R$500,00</p>
                  </div>
                  <div className='flex flex-row justify-between w-[10rem]'>
                    <p className='text-[#656565] font-inter font-normal'>Lucas M.</p>
                    <p className='text-[#656565] font-inter font-semibold'>R$500,00</p>
                  </div>
                  <div className='flex flex-row justify-between w-[10rem]'>
                    <p className='text-[#656565] font-inter font-normal'>Lucas M.</p>
                    <p className='text-[#656565] font-inter font-semibold'>R$500,00</p>
                  </div>
                  <div className='flex flex-row justify-between w-[10rem]'>
                    <p className='text-[#656565] font-inter font-normal'>Lucas M.</p>
                    <p className='text-[#656565] font-inter font-semibold'>R$500,00</p>
                  </div>
                  <div className='flex flex-row justify-between w-[10rem]'>
                    <p className='text-[#656565] font-inter font-normal'>Lucas M.</p>
                    <p className='text-[#656565] font-inter font-semibold'>R$500,00</p>
                  </div>
                  <div className='flex flex-row justify-between w-[10rem]'>
                    <p className='text-[#656565] font-inter font-normal'>Lucas M.</p>
                    <p className='text-[#656565] font-inter font-semibold'>R$500,00</p>
                  </div>
                </div>
              </section>
            </section>
            
            <section className='flex flex-col gap-[0.7rem] px-[1.5625rem] py-[1.0625rem] bg-[#F5F5F5] rounded-[1.275rem]'>
              <h1 className='text-center text-[#2A2A2A] font-semibold font-inter text-[1.25rem]'>Alerta Inteligente</h1>
              <hr className='h-[0.1225rem] bg-[#D9D9D9]'/>
              <div className='flex flex-col items-center font-inter text-[#646464]'>
                <p>Seu maior gasto foi com impostos e taxas.</p>
                <p>O seu produto mais vendido foi Anzol.</p>
              </div>
            </section>

          </section>

        </section>

      </section>
    </>
  )
}