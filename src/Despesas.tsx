// src/Despesas.tsx
import { useState } from "react";
import Titulo from "./components/Titulo.js";
import Modal from "./components/Modal.js";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";

export default function Despesas() {
  // Modais da tela
  const [openAdicionar, setOpenAdicionar] = useState(false);
  const [openAlterar, setOpenAlterar] = useState(false);
  const [openExcluir, setOpenExcluir] = useState(false);

  // Formulário de despesa (Adicionar/Alterar)
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState<number | "">("");
  const [data, setData] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [categoria, setCategoria] = useState("Operacional");
  const [anexo, setAnexo] = useState("");

  function limparForm() {
    setDescricao("");
    setValor("");
    setData(new Date().toISOString().slice(0, 10));
    setCategoria("Operacional");
    setAnexo("");
  }

  async function confirmarSalvar() {
    if (!descricao.trim()) return alert("Informe a descrição.");
    if (valor === "" || Number(valor) <= 0) return alert("Informe um valor válido.");
    if (!data) return alert("Informe a data.");

    const payload = {
      descricao: descricao.trim(),
      valor: Number(valor),
      data,
      categoria: categoria.trim(),
      anexo: anexo.trim() || undefined,
    };

    try {
      // TODO: integrar com seu backend
      // await api.post("/despesas", payload)
      console.log("Salvar despesa:", payload);
      setOpenAdicionar(false);
      limparForm();
    } catch (e) {
      console.error(e);
      alert("Não foi possível salvar. Tente novamente.");
    }
  }

  return (
    <>
      <Titulo />

      <section className="mt-[3rem] mb-[2rem] flex flex-col justify-center items-center">
        <div className="w-[85.6875rem] flex flex-col gap-[1.44rem]">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-[0.7rem] justify-center">
              <img src="/tabela.svg" className="w-[2rem] h-[2rem]" alt="" />
              <h2 className="text-center text-[2rem] font-inter font-semibold">Despesas</h2>
            </div>
            <button
              onClick={() => setOpenAdicionar(true)}
              className="flex text-white items-center justify-center rounded-[0.5rem] bg-[linear-gradient(139deg,_#114114_-40.56%,_#00C000_279.19%)] w-[12rem] h-[2.7rem] text-[1.25rem] font-roboto font-normal"
            >
              Adicionar
            </button>
          </div>

          <div className="bg-[#F5F5F5] px-[1.62rem] py-[1.93rem] rounded-[1rem] flex flex-col gap-[1.44rem]">
            {/* Filtros/cabeçalho do mês */}
            <div className="flex flex-col gap-[1.44rem]">
              <div className="flex flex-row justify-between">
                <div className="flex flex-row items-center gap-[1.125rem]">
                  <img src="/arrow_l.svg" alt="" />
                  <h3 className="text-[1.5rem] font-inter font-semibold">Setembro</h3>
                  <img src="/arrow_r.svg" alt="" />
                </div>
                <div className="relative">
                  <label className="absolute font-inter -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.6875rem] font-semibold tracking-wide">
                    CATEGORIA
                  </label>
                  <input
                    type="text"
                    placeholder="Selecionar Categoria"
                    className="border-2 border-[#4A4B51] rounded-xl font-inter pl-5 w-[14.6875rem] h-[2.75rem] placeholder:text-[1rem] placeholder:font-normal placeholder:text-[#828386] text-[#4A4B51] text-lg font-medium bg-[#F5F5F5] outline-none focus:border-[#407B6A] transition-colors"
                    id="filtro_categoria"
                  />
                </div>
              </div>
            </div>

            {/* Cabeçalhos da lista */}
            <div className="flex flex-row justify-between font-inter text-[1rem] font-normal mt-4">
              <h2>Data da Despesa</h2>
              <h2 className="relative right-2">Valor</h2>
              <h2 className="relative left-10">Categoria</h2>
              <h2 className="relative left-[3.5rem]">Anexo</h2>
              <h2>Opções</h2>
            </div>

            {/* Linha mock (exemplo) */}
            <div className="flex flex-col gap-[0.44rem]">
              <div className="bg-[#E2E2E2] py-[0.875rem] px-[1.06rem] rounded-[0.9375rem] flex flex-row justify-between items-center">
                <p className="text-[#656565] font-inter font-normal text-[1rem]">13/09/2025</p>
                <p className="text-[#303030] font-inter font-semibold">R$100,00</p>
                <p className="text-[#705519] font-inter text-[0.975rem] font-medium bg-[#F6DDA6] py-[0.10rem] px-[1.06rem] rounded-[0.46875rem]">
                  Impostos e Taxas
                </p>
                <img src="/attachment.svg" alt="" />
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <img src="/options.svg" alt="opções" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="font-inter">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpenAlterar(true)}>Alterar Dados</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenExcluir(true)} className="text-[#c02424]">
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Aviso educativo (sem mexer em estoque) */}
            <div className="text-[0.95rem] text-[#4A4B51]">
              Comprou produtos/insumos? Cadastre a compra em <span className="font-semibold">Estoque</span> para atualizar o custo médio automaticamente.
            </div>
          </div>
        </div>
      </section>

      {/* MODAL: Adicionar Despesa */}
      <Modal open={openAdicionar} onClose={() => setOpenAdicionar(false)}>
        <div className="container">
          <div className="container flex flex-col items-start">
            <div className="flex flex-row items-center gap-[0.7rem] justify-center">
              <img src="/tabela.svg" className="w-[1.5rem] h-[1.5rem]" alt="" />
              <h2 className="text-center text-[1.4rem] font-inter font-semibold">Adicionar Despesa</h2>
            </div>
          </div>

          <div className="container flex flex-col items-center">
            <div className="flex flex-col items-center my-8 gap-8 w-[35rem]">
              <div className="relative w-full">
                <label className="absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide">
                  DESCRIÇÃO
                </label>
                <input
                  type="text"
                  placeholder="Ex.: Luz, aluguel, frete, marketing..."
                  className="w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-8">
                <div className="flex flex-row justify-between gap-12 w-[35rem]">
                  <div className="relative w-full">
                    <label className="absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide">
                      VALOR
                    </label>
                    <input
                      type="number"
                      placeholder="R$ 0,00"
                      className="w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors"
                      value={valor}
                      onChange={(e) => setValor(e.target.value === "" ? "" : Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="relative w-full">
                    <label className="absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide">
                      DATA
                    </label>
                    <input
                      type="date"
                      className="w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors"
                      value={data}
                      onChange={(e) => setData(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-row justify-between gap-12 w-[35rem]">
                  <div className="relative w-full">
                    <label className="absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide">
                      CATEGORIA
                    </label>
                    <input
                      type="text"
                      placeholder="Operacional, Impostos, Serviços..."
                      className="w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors"
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      required
                    />
                  </div>

                  <div className="relative w-full">
                    <label className="absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide">
                      ANEXO (NF)
                    </label>
                    <input
                      type="url"
                      placeholder="Link / upload"
                      className="w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors"
                      value={anexo}
                      onChange={(e) => setAnexo(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setOpenAdicionar(false)}
                className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter hover:opacity-90 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarSalvar}
                className="text-white bg-[#308021] rounded-md px-6 py-2 text-[1rem] font-bold hover:opacity-90 font-inter transition cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* MODAL: Alterar (visual) */}
      <Modal open={openAlterar} onClose={() => setOpenAlterar(false)}>
        <div className="container">
          <div className="container flex flex-col items-start">
            <div className="flex flex-row items-center gap-[0.7rem] justify-center">
              <img src="/tabela.svg" className="w-[1.5rem] h-[1.5rem]" alt="" />
              <h2 className="text-center text-[1.4rem] font-inter font-semibold">Modificar Despesa</h2>
            </div>
          </div>

          <div className="container flex flex-col items-center">
            {/* Reaproveite o mesmo formulário acima neste modal, se precisar */}
            <div className="flex gap-4">
              <button
                onClick={() => setOpenAlterar(false)}
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

      {/* MODAL: Excluir */}
      <Modal open={openExcluir} onClose={() => setOpenExcluir(false)}>
        <div className="container">
          <div className="container flex flex-col items-start">
            <div className="flex flex-row items-center gap-[0.7rem] justify-center">
              <img src="/tabela.svg" className="w-[1.5rem] h-[1.5rem]" alt="" />
              <h2 className="text-center text-[1.4rem] font-inter font-semibold">Excluir Despesa</h2>
            </div>
          </div>

          <div className="container flex flex-col items-center">
            <div className="flex flex-col items-center my-6">
              <p className="font-inter">Você tem certeza que deseja apagar esta despesa?</p>
              <p className="font-inter">Após confirmar, essa ação será irreversível.</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setOpenExcluir(false)}
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
    </>
  );
}
