import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Titulo from "./components/Titulo";

export default function Relatorio() {

  const relatorioRef = useRef(null);

  async function gerarPDF() {
    const element = relatorioRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      ignoreElements: (el) => el.classList?.contains("ignore-pdf")
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
    pdf.save("relatorio_mensal.pdf");
  }

  return (
    <section>
      <Titulo />
      <div ref={relatorioRef}>

        <section className='mt-[3rem] mb-[2rem] flex flex-col justify-center items-center gap-[2.63rem]'>
          <div className="flex flex-row items-center justify-between w-[83vw]">
            <div className="flex flex-col items-start">
              <div className="flex flex-row items-center gap-[0.7rem] justify-center">
                <img src="/tabela.svg" className="w-[2rem] h-[2rem]" alt="" />
                <h2 className="text-center text-[2rem] font-inter font-semibold">
                  Relatório
                </h2>
              </div>
              <h2 className="text-[#4A4B51] font-inter font-semibold">Maiquel, aqui está o seu relatório mensal do mês de Setembro.</h2>
            </div>
            <div className="flex flex-row gap-[2.25rem]">
              <div className="flex flex-row items-center gap-[1.125rem]">
                <img src="/arrow_l.svg" alt="" />
                <h3 className="text-[1.5rem] font-inter font-semibold">Setembro</h3>
                <img src="/arrow_r.svg" alt="" />
              </div>
              <button
                onClick={gerarPDF}
                className="ignore-pdf flex items-center gap-3 px-[0.9375rem] rounded-[0.375rem] border-[#969b96] border-2 py-[0.625rem] flex-row bg-[linear-gradient(139deg,#184047_-40.56%,#F89900_279.19%)]"
              >
                <img className="w-[1.25rem]" src="/print.svg" alt="" />
                <span className="font-inter text-white font-normal">
                  Exportar relatório para PDF
                </span>
              </button>
            </div>
          </div>

          <section className="bg-[#F5F5F5] rounded-[1.25rem] w-[83vw] flex items-center justify-center py-[2.3125rem]">
            <div className="flex items-stretch font-inter text-[1rem]">
              <div className="flex flex-col items-center justify-center px-[1.06rem]">
                <h2 className="text-[#4A4B51] font-semibold">Receita Total</h2>
                <h3 className="text-[#407B6A] font-medium text-[1.3rem]">R$800,00</h3>
              </div>
              <div className="w-[0.2rem] rounded-[0.9375rem] bg-[#B7BBC7] mx-[1.06rem]" />
              <div className="flex flex-col items-center justify-center px-[1.06rem]">
                <h2 className="text-[#4A4B51] font-semibold">Despesas Totais</h2>
                <h3 className="text-[#CA3030] font-medium text-[1.3rem]">R$200,00</h3>
              </div>
              <div className="w-[0.2rem] rounded-[0.9375rem] bg-[#B7BBC7] mx-[1.06rem]" />
              <div className="flex flex-col items-center justify-center px-[1.06rem]">
                <h2 className="text-[#4A4B51] font-semibold">Lucro Líquido</h2>
                <h3 className="text-[#407B6A] font-medium text-[1.3rem]">R$600,00</h3>
              </div>
            </div>
          </section>

          <section className="flex flex-row gap-[2.19rem]">
            <div className="flex flex-col items-center gap-[0.5rem]">
              <h2 className="text-center text-[2rem] font-inter font-semibold">
                Estoque
              </h2>
              <div className="flex flex-col bg-[#F5F5F5] px-[2rem] py-[1.8125rem] rounded-[0.9375rem] gap-[0.91rem]">
                <p className="text-[#4A4B51] font-inter text-[1.25rem] font-medium">Categorias com maior itens em estoque:</p>
                <div className="flex flex-col gap-[0.5rem]">
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Bebidas</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">10 Itens</p>
                  </div>
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Alimentos</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">30 Itens</p>
                  </div>
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Itens de Beleza</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">80 Itens</p>
                  </div>
                </div>
                <p className="text-[#4A4B51] font-inter text-[1.25rem] font-medium">Maior quantidade em estoque (un):</p>
                <div className="flex flex-col gap-[0.5rem]">
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Alfinete</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">30 Unidades</p>
                  </div>
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Coca-Cola Mini</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">40 Unidades</p>
                  </div>
                </div>
                <p className="text-[#4A4B51] font-inter text-[1.25rem] font-medium">Maior quantidade em estoque (kg):</p>
                <div className="flex flex-col gap-[0.5rem]">
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Cereal Lobão</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">39 Kg</p>
                  </div>
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Farinha Orquidea</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">25 Kg</p>
                  </div>
                </div>
                <p className="text-[#4A4B51] font-inter text-[1.25rem] font-medium">Maior quantidade em estoque (ml):</p>
                <div className="flex flex-col gap-[0.5rem]">
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Água Cristal</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">5,6 L</p>
                  </div>
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Suco de Laranja</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">5 L</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-[0.5rem]">
              <h2 className="text-center text-[2rem] font-inter font-semibold">
                Despesas
              </h2>
              <div className="flex flex-col bg-[#F5F5F5] px-[2rem] py-[1.8125rem] rounded-[0.9375rem] gap-[0.91rem]">
                <p className="text-[#4A4B51] font-inter text-[1.25rem] font-medium">Categorias com mais despesas:</p>
                <div className="flex flex-col gap-[0.5rem]">
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Salário Funcionários</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">50 Despesas</p>
                  </div>
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Impostos</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">5 Despesas</p>
                  </div>
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Aluguél</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">1 Despesa</p>
                  </div>
                </div>
                <p className="text-[#4A4B51] font-inter text-[1.25rem] font-medium">Valor gasto em Categorias:</p>
                <div className="flex flex-col gap-[0.5rem]">
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Salário Funcionários</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">R$58.018,28</p>
                  </div>
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Impostos</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">R$2.048,20</p>
                  </div>
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Aluguél</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">R$1.200,00</p>
                  </div>
                </div>
                <p className="text-[#4A4B51] font-inter text-[1.25rem] font-medium">Em setembro, você:</p>
                <div className="flex flex-col gap-[0.5rem]">
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Realizou <span className="font-semibold text-[#4d4d4d]">20</span> despesas sem anexos.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-[0.5rem]">
              <h2 className="text-center text-[2rem] font-inter font-semibold">
                Receitas
              </h2>
              <div className="flex flex-col bg-[#F5F5F5] px-[2rem] py-[1.8125rem] rounded-[0.9375rem] gap-[0.91rem]">
                <p className="text-[#4A4B51] font-inter text-[1.25rem] font-medium">Categorias mais vendidas:</p>
                <div className="flex flex-col gap-[0.5rem]">
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Alimento</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">30 Vendas</p>
                  </div>
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Bebidas</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">30 Vendas</p>
                  </div>
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Limpeza</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">30 Vendas</p>
                  </div>
                </div>
                <p className="text-[#4A4B51] font-inter text-[1.25rem] font-medium">Produtos mais vendidos:</p>
                <div className="flex flex-col gap-[0.5rem]">
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Pepsi E-Cola</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">7</p>
                  </div>
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">X-Burguer Laricão</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">6</p>
                  </div>
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Corrente Pérolas</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">5</p>
                  </div>
                </div>
                <p className="text-[#4A4B51] font-inter text-[1.25rem] font-medium">Em setembro, você:</p>
                <div className="flex flex-col gap-[0.5rem]">
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Realizou <span className="font-semibold text-[#4d4d4d]">20</span> vendas</p>
                  </div>
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Obteve <span className="font-semibold text-[#4d4d4d]">R$150,00</span> em vendas.</p>
                  </div>
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Realizou <span className="font-semibold text-[#4d4d4d]">20</span> vendas sem itens.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-[0.5rem]">
              <h2 className="text-center text-[2rem] font-inter font-semibold">
                Clientes
              </h2>
              <div className="flex flex-col bg-[#F5F5F5] px-[2rem] py-[1.8125rem] rounded-[0.9375rem] gap-[0.91rem]">
                <p className="text-[#4A4B51] font-inter text-[1.25rem] font-medium">Os que mais gastaram:</p>
                <div className="flex flex-col gap-[0.5rem]">
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Manoel Lopes</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">R$159,00</p>
                  </div>
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Manoel Lopes</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">R$158,00</p>
                  </div>
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Manoel Lopes</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">R$157,00</p>
                  </div>
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Manoel Lopes</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">R$156,00</p>
                  </div>
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Manoel Lopes</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">R$155,00</p>
                  </div>
                </div>
                <p className="text-[#4A4B51] font-inter text-[1.25rem] font-medium">Com maior número de compras:</p>
                <div className="flex flex-col gap-[0.5rem]">
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Manoel Lopes</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">7</p>
                  </div>
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Manoel Lopes</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">6</p>
                  </div>
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Manoel Lopes</p>
                    <p className="font-inter font-semibold text-[#4d4d4d]">5</p>
                  </div>
                </div>
                <p className="text-[#4A4B51] font-inter text-[1.25rem] font-medium">Em setembro, você:</p>
                <div className="flex flex-col gap-[0.5rem]">
                  <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                    <p className="font-inter font-normal text-[#656565]">Registrou <span className="font-semibold text-[#4d4d4d]">20</span> clientes</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </section>
        
      </div>
    </section>
  )
}