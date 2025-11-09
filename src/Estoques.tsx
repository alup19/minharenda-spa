// src/Estoque.tsx
import { useEffect, useMemo, useState } from "react";
import Titulo from "./components/Titulo.js";
import Modal from "./components/Modal.js";
import ItensEditor from "./components/ItensEditor.js";
import type { ItemLinha, ProdutoOption } from "./components/ItensEditor.js";

import { parseQuantidade } from "./components/units.js";
import type { Unidade } from "./components/units.js";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";

// ===================================================================
// Componente principal
// ===================================================================
export default function Estoque() {
  // controles de modais (lista: alterar/excluir são mocks visuais)
  const [openAdicionar, setOpenAdicionar] = useState(false);
  const [openAlterar, setOpenAlterar] = useState(false);
  const [openExcluir, setOpenExcluir] = useState(false);

  // cabeçalho da entrada de compra
  const [dataMov, setDataMov] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [categoria, setCategoria] = useState<string>("Compras");
  const [anexo, setAnexo] = useState<string>("");

  // itens e produtos
  const [itensEntrada, setItensEntrada] = useState<ItemLinha[]>([]);
  const [produtos, setProdutos] = useState<ProdutoOption[]>([]);

  // mock de produtos (trocar por sua API)
  useEffect(() => {
    async function carregar() {
      // TODO: substituir pela sua chamada real
      // const data = await api.get("/produtos").then(r => r.data)
      const data: ProdutoOption[] = [
        { id: 1, nome: "Farofa Yoki", unidadeBase: "G" },
        { id: 2, nome: "Água Mineral 500ml", unidadeBase: "ML" },
        { id: 3, nome: "Rótulo", unidadeBase: "UN" },
      ];
      setProdutos(data);
    }
    carregar();
  }, []);

  // total geral R$
  const total = useMemo(
    () => itensEntrada.reduce((s, i) => s + (Number(i.subtotal) || 0), 0),
    [itensEntrada]
  );

  // helper: se algum campo vier vazio, calculo a partir do básico
  function calcularBasesDoItem(i: ItemLinha) {
    const unid: Unidade = i.unidadeSelecionada ?? "UN";
    const qtdConteudoBase = parseQuantidade(i.qtdConteudoInput ?? "0", unid);
    const qtdComprada = Number(i.quantidadeComprada ?? 0);
    const subtotal =
      Number(
        i.subtotal ?? (Number(i.custoUnitario ?? 0) * (qtdComprada || 0))
      ) || 0;

    const qtdBase =
      i.qtdTotalBase ?? Math.max(0, qtdConteudoBase * (qtdComprada || 0));
    const custoUnitBase =
      i.custoUnitBase ??
      (qtdBase > 0 ? +(subtotal / qtdBase).toFixed(6) : 0);

    return { qtdBase, custoUnitBase, subtotal };
  }

  // confirmar compra
  async function confirmarEntrada() {
    if (!dataMov) return alert("Informe a data.");
    if (!itensEntrada.length) return alert("Adicione pelo menos um item.");

    const invalido = itensEntrada.some(
      (i) =>
        !i.produtoId ||
        !i.qtdConteudoInput ||
        !i.quantidadeComprada ||
        !i.custoUnitario
    );
    if (invalido)
      return alert(
        "Verifique: Produto, QTD por unidade, Custo (1 unid.) e Quantidade Comprada."
      );

    const payload = {
      data: dataMov,
      categoria,
      anexo,
      total,
      itens: itensEntrada.map((i) => {
        const { qtdBase, custoUnitBase, subtotal } = calcularBasesDoItem(i);
        return {
          produtoId: i.produtoId!,
          qtdBase, // total em base (g/ml/un)
          custoUnit: custoUnitBase, // custo por base (para custo médio)
          subtotal,
        };
      }),
    };

    try {
      // =========================
      // TODO: Enviar ao backend
      // 1) POST /despesas (descricao: `Compra - ${dataMov}`, categoria, data, anexo, valor=total)
      // 2) POST /despesas/:id/itens (itens do payload)
      // 3) POST /estoque/entrada/lote (produtoId, qtdBase, custoUnit) -> atualiza custo médio
      // =========================
      console.log("Salvar entrada de estoque (compra):", payload);

      // limpar e fechar
      setItensEntrada([]);
      setDataMov(new Date().toISOString().slice(0, 10));
      setCategoria("Compras");
      setAnexo("");
      setOpenAdicionar(false);
    } catch (e) {
      console.error(e);
      alert("Não foi possível salvar. Tente novamente.");
    }
  }

  // cadastro rápido de produto (chamado pelo ItensEditor)
  async function cadastrarProdutoRapido(nome: string, unidade: Unidade) {
    // TODO: trocar por API real
    // const criado = await api.post("/produtos", { nome, unidadeBase: unidade }).then(r=>r.data)
    const criado: ProdutoOption = {
      id: Math.floor(Math.random() * 1e9),
      nome,
      unidadeBase: unidade,
    };
    setProdutos((prev) => [...prev, criado]);
    return criado;
  }

  return (
    <>
      <Titulo />

      <section className="mt-[3rem] mb-[2rem] flex flex-col justify-center items-center">
        <div className="w-[85.6875rem] flex flex-col gap-[1.44rem]">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-[0.7rem] justify-center">
              <img src="/tabela.svg" className="w-[2rem] h-[2rem]" alt="" />
              <h2 className="text-center text-[2rem] font-inter font-semibold">
                Estoque
              </h2>
            </div>
            <button
              onClick={() => setOpenAdicionar(true)}
              className="flex text-white items-center justify-center rounded-[0.5rem] bg-[linear-gradient(139deg,_#114114_-40.56%,_#00C000_279.19%)] w-[12rem] h-[2.7rem] text-[1.25rem] font-roboto font-normal"
            >
              Adicionar
            </button>
          </div>

          {/* filtros da tabela (mantidos) */}
          <div className="bg-[#F5F5F5] px-[1.62rem] py-[1.93rem] rounded-[1rem] flex flex-col gap-[1.44rem]">
            <div className="flex flex-col gap-[1.44rem]">
              <div className="flex flex-row gap-[1.25rem]">
                <div className="relative">
                  <label className="absolute font-inter -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.6875rem] font-semibold tracking-wide">
                    NOME
                  </label>
                  <input
                    type="text"
                    placeholder="Filtrar por Nome"
                    className="border-2 border-[#4A4B51] rounded-xl font-inter pl-5 w-[14.6875rem] h-[2.75rem] placeholder:text-[1rem] placeholder:font-normal placeholder:text-[#828386] text-[#4A4B51] text-lg font-medium bg-[#F5F5F5] outline-none focus:border-[#407B6A] transition-colors"
                    id="filtro_nome"
                  />
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

            {/* cabeçalhos mock */}
            <div className="flex flex-row justify-between font-inter text-[1rem] font-normal mt-4">
              <h2>Nome</h2>
              <h2 className="relative left-[1.8rem]">Quantidade</h2>
              <h2 className="relative left-[2.4rem]">Valor/Kg</h2>
              <h2 className="relative left-[3.5rem]">Categoria</h2>
              <h2 className="relative left-[3.3rem]">Anexo</h2>
              <h2>Opções</h2>
            </div>

            {/* linha de exemplo (mock) */}
            <div className="flex flex-col gap-[0.44rem]">
              <div className="bg-[#E2E2E2] py-[0.875rem] px-[1.06rem] rounded-[0.9375rem] flex flex-row justify-between items-center">
                <p className="text-[#656565] font-inter font-normal text-[1rem]">
                  Farinha
                </p>
                <p className="text-[#303030] font-inter font-semibold">
                  20kg e 800g
                </p>
                <p className="text-[#656565] font-inter font-normal">
                  R$19,99/Kg
                </p>
                <p className="text-[#705519] font-inter text-[0.975rem] font-medium bg-[#F6DDA6] py-[0.10rem] px-[1.06rem] rounded-[0.46875rem] ">
                  Alimento
                </p>
                <img src="/attachment.svg" alt="" />
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <img src="/options.svg" alt="opções" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="font-inter">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpenAlterar(true)}>
                      Alterar Dados
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setOpenExcluir(true)}
                      className="text-[#c02424]"
                    >
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL: Adicionar ao Estoque (Compra) */}
      <Modal open={openAdicionar} onClose={() => setOpenAdicionar(false)}>
        <div className="container w-[44rem]">
          <div className="flex items-center gap-2">
            <img src="/tabela.svg" className="w-[1.5rem] h-[1.5rem]" alt="" />
            <h2 className="text-[1.4rem] font-inter font-semibold">
              Adicionar ao Estoque
            </h2>
          </div>

          {/* Cabeçalho */}
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="relative">
              <label className="absolute -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold">
                DATA
              </label>
              <input
                type="date"
                value={dataMov}
                onChange={(e) => setDataMov(e.target.value)}
                className="w-full border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold">
                ANEXO (NF)
              </label>
              <input
                type="url"
                value={anexo}
                onChange={(e) => setAnexo(e.target.value)}
                placeholder="Link / upload"
                className="w-full border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold">
                CATEGORIA
              </label>
              <input
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                placeholder="Compras"
                className="w-full border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]"
              />
            </div>
          </div>

          {/* Itens */}
          <div className="mt-8">
            <h3 className="font-inter font-semibold mb-2">Itens comprados</h3>

            <ItensEditor
              itens={itensEntrada}
              produtos={produtos}
              onChange={setItensEntrada}
              onCadastrarProdutoRapido={cadastrarProdutoRapido}
            />

            <p className="text-sm text-[#4A4B51] mt-2">
              Custo médio será atualizado automaticamente ao confirmar.
            </p>

            <div className="mt-4 flex justify-end font-inter">
              <div>
                <div className="text-sm text-[#4A4B51]">Total</div>
                <div className="text-lg font-semibold">R$ {total.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => setOpenAdicionar(false)}
              className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter"
            >
              Cancelar
            </button>
            <button
              className="text-white bg-[#308021] rounded-md px-6 py-2 text-[1rem] font-bold font-inter hover:opacity-90"
              onClick={confirmarEntrada}
            >
              Confirmar
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL: Alterar Item (mock) */}
      <Modal open={openAlterar} onClose={() => setOpenAlterar(false)}>
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
            {/* seu formulário de edição aqui (mantive como estava) */}
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

      {/* MODAL: Excluir Item (mock) */}
      <Modal open={openExcluir} onClose={() => setOpenExcluir(false)}>
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
