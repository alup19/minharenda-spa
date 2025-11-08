// src/Insumos.tsx
import { useEffect, useMemo, useState } from "react";
import Titulo from "./components/Titulo";
import { parseQuantidade } from "./components/units.js";
import type { Unidade } from "./components/units.js";
import { toast } from "sonner";
import Modal from "./components/Modal.js"; // se quiser usar depois
// import { useUsuarioStore } from "./context/UsuarioContext.js"; // descomente se precisar do token

const apiUrl = import.meta.env.VITE_API_URL;

type ProdutoOption = {
  id: number;
  nome: string;
  unidadeBase: Unidade; // "UN" | "G" | "ML"
  custoMedio?: number;  // custo por base (g/ml/un)
  margemPadrao?: number;
};

type LinhaInsumo = {
  produtoId?: number;
  qtdInput?: string;          // o que o usuário digita (ex.: "500", "950 g")
  qtdBase?: number;           // quantidade convertida p/ base do produto
  erro?: string;
};

export default function Insumos() {
  // const { usuario } = useUsuarioStore();
  const [produtos, setProdutos] = useState<ProdutoOption[]>([]);
  const [linhas, setLinhas] = useState<LinhaInsumo[]>([
    { produtoId: undefined, qtdInput: "" },
  ]);

  // parâmetros da produção
  const [margemPercent, setMargemPercent] = useState<number | "">("");
  const [unidadesProduzidas, setUnidadesProduzidas] = useState<number | "">("");

  // carregar produtos do estoque
  useEffect(() => {
    async function fetchProdutos() {
      try {
        const r = await fetch(`${apiUrl}/produtos`, {
          // headers: { Authorization: `Bearer ${usuario.token}` }
        });
        const data = await r.json();
        const lista = Array.isArray(data) ? data : data.produtos ?? [];
        setProdutos(lista);
      } catch (e) {
        console.error(e);
        toast.error("Não foi possível carregar os produtos do estoque.");
        // fallback mock opcional:
        setProdutos([
          { id: 1, nome: "Farofa Yoki", unidadeBase: "G", custoMedio: 0.025 },
          { id: 2, nome: "Água 500ml", unidadeBase: "ML", custoMedio: 0.004 },
          { id: 3, nome: "Rótulo", unidadeBase: "UN", custoMedio: 0.35 },
        ]);
      }
    }
    fetchProdutos();
  }, []);

  function setLinha(idx: number, patch: Partial<LinhaInsumo>) {
    const next = [...linhas];
    next[idx] = { ...next[idx], ...patch };

    const prod = produtos.find((p) => p.id === next[idx].produtoId);
    // unidade automática pela unidadeBase do produto
    const unidade: Unidade = prod?.unidadeBase ?? "UN";

    // parse quantidade para base
    const qtdBase = parseQuantidade(next[idx].qtdInput || "0", unidade);
    next[idx].qtdBase = qtdBase || undefined;

    // validações simples
    next[idx].erro = !next[idx].produtoId
      ? "Selecione um produto do estoque"
      : qtdBase <= 0
      ? "Informe a quantidade utilizada"
      : undefined;

    setLinhas(next);
  }

  function addLinha() {
    setLinhas([...linhas, { produtoId: undefined, qtdInput: "" }]);
  }

  function removeLinha(idx: number) {
    const next = [...linhas];
    next.splice(idx, 1);
    setLinhas(next.length ? next : [{ produtoId: undefined, qtdInput: "" }]);
  }

  // totais
  const totalQtdBase = useMemo(() => {
    return linhas.reduce((s, l) => s + (Number(l.qtdBase) || 0), 0);
  }, [linhas]);

  const custoTotal = useMemo(() => {
    return linhas.reduce((s, l) => {
      const prod = produtos.find((p) => p.id === l.produtoId);
      const custo = (prod?.custoMedio || 0) * (Number(l.qtdBase) || 0);
      return s + custo;
    }, 0);
  }, [linhas, produtos]);

  const precoUnitSugerido = useMemo(() => {
    const unidades = Number(unidadesProduzidas || 0);
    if (!unidades || unidades <= 0) return 0;
    const custoUnit = custoTotal / unidades;
    const margem = Number(margemPercent || 0) / 100;
    return +(custoUnit * (1 + margem)).toFixed(2);
  }, [custoTotal, margemPercent, unidadesProduzidas]);

  const lucroTotal = useMemo(() => {
    const unidades = Number(unidadesProduzidas || 0);
    if (!unidades || unidades <= 0) return 0;
    const receitaEstimada = precoUnitSugerido * unidades;
    return +(receitaEstimada - custoTotal).toFixed(2);
  }, [custoTotal, precoUnitSugerido, unidadesProduzidas]);

  return (
    <>
      <Titulo />
      <section className="flex flex-row items-start justify-center gap-[6rem]">
        {/* Coluna Estoque (exibição) */}
        <section className="mt-[3rem] mb-[2rem] flex flex-col justify-center items-center gap-[1.88rem]">
          <div className="flex flex-row items-center justify-center gap-[0.7rem]">
            <img src="/tabela.svg" className="w-[2rem] h-[2rem]" alt="" />
            <h2 className="text-center text-[2rem] font-inter font-semibold">
              Estoque
            </h2>
          </div>
          <div className="bg-[#F5F5F5] px-[1.62rem] flex flex-col py-[1.94rem] gap-4 rounded-[0.9375rem]">
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

            {/* Cabeçalhos (mock visual) */}
            <div className="flex flex-row justify-between font-inter text-[1rem] px-3 font-normal">
              <h2>Nome</h2>
              <h2 className="relative right-4">Quantidade</h2>
              <h2 className="relative right-6">Valor</h2>
              <h2 className="relative">Categoria</h2>
            </div>

            {/* Exemplo estático (você substituirá pela sua tabela real) */}
            <div className="bg-[#E2E2E2] py-[0.875rem] px-[1.06rem] rounded-[0.9375rem] flex flex-row justify-between items-center">
              <p className="text-[#656565] font-inter font-normal text-[1rem]">
                Farinha
              </p>
              <p className="text-[#303030] font-inter font-semibold">20kg e 800g</p>
              <p className="text-[#656565] font-inter font-normal">R$19,99/Kg</p>
              <p className="text-[#705519] font-inter text-[0.975rem] font-medium bg-[#F6DDA6] py-[0.10rem] px-[1.06rem] rounded-[0.46875rem] ">
                Alimento
              </p>
            </div>
          </div>
        </section>

        {/* Coluna Insumos (seleciona itens existentes + cálculos) */}
        <section className="mt-[3rem] mb-[2rem] flex flex-col justify-center items-center gap-[1.88rem]">
          <div className="flex flex-row items-center justify-center gap-[0.7rem]">
            <img src="/tabela.svg" className="w-[2rem] h-[2rem]" alt="" />
            <h2 className="text-center text-[2rem] font-inter font-semibold">
              Insumos
            </h2>
          </div>

          <div className="bg-[#F5F5F5] px-[1.62rem] flex flex-col py-[1.94rem] gap-4 rounded-[0.9375rem] w-[38rem]">
            {/* Linhas de Insumo */}
            {linhas.map((l, idx) => {
              const prod = produtos.find((p) => p.id === l.produtoId);
              const unidade = prod?.unidadeBase ?? "UN";

              return (
                <div key={idx} className="flex flex-row justify-between gap-[1.25rem]">
                  {/* PRODUTO (dropdown) */}
                  <div className="relative">
                    <label className="absolute font-inter -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.6875rem] font-semibold tracking-wide">
                      PRODUTO
                    </label>
                    <select
                      value={l.produtoId ?? ""}
                      onChange={(e) =>
                        setLinha(idx, { produtoId: Number(e.target.value) || undefined })
                      }
                      className="border-2 border-[#4A4B51] rounded-xl font-inter pl-5 w-[13.2rem] h-[2.75rem] text-[#4A4B51] text-lg bg-white outline-none focus:border-[#407B6A] transition-colors"
                      required
                    >
                      <option value="">Selecionar</option>
                      {produtos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* QUANTIDADE UTILIZADA (auto–unidade baseada no produto) */}
                  <div className="relative">
                    <label className="absolute font-inter -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.6875rem] font-semibold tracking-wide">
                      QUANTIDADE UTILIZADA
                    </label>
                    <input
                      type="text"
                      value={l.qtdInput ?? ""}
                      onChange={(e) => setLinha(idx, { qtdInput: e.target.value })}
                      placeholder={
                        unidade === "G"
                          ? "Ex.: 800 g"
                          : unidade === "ML"
                          ? "Ex.: 2,5 L ou 2500 ml"
                          : "Ex.: 4 un"
                      }
                      className="border-2 border-[#4A4B51] rounded-xl font-inter pl-5 w-[14.25rem] h-[2.75rem] placeholder:text-[1rem] placeholder:font-normal placeholder:text-[#828386] text-[#4A4B51] text-lg font-medium bg-white outline-none focus:border-[#407B6A] transition-colors"
                      required
                    />
                    <div className="text-[0.75rem] text-[#656565] mt-1">
                      Unidade: <b>{unidade}</b> {l.qtdBase ? `| Base: ${l.qtdBase}` : ""}
                    </div>
                  </div>

                  {/* Remover linha */}
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeLinha(idx)}
                      className="text-[#c02424] hover:opacity-80 px-2 py-1"
                    >
                      Remover
                    </button>
                  </div>

                  {/* Erros */}
                  {l.erro && (
                    <div className="basis-full text-[#c02424] text-xs mt-1">
                      {l.erro}
                    </div>
                  )}
                </div>
              );
            })}

            <button
              className="text-[#407B6A] underline w-fit"
              type="button"
              onClick={addLinha}
            >
              + Adicionar insumo
            </button>

            {/* Parâmetros: Margem e Unidades Produzidas */}
            <div className="flex flex-row justify-between gap-[1.25rem] mt-2">
              <div className="relative">
                <label className="absolute font-inter -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.6875rem] font-semibold tracking-wide">
                  MARGEM DE LUCRO
                </label>
                <input
                  type="number"
                  value={margemPercent}
                  onChange={(e) =>
                    setMargemPercent(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  placeholder="10%"
                  className="border-2 border-[#4A4B51] rounded-xl font-inter pl-5 w-[13.2rem] h-[2.75rem] placeholder:text-[1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg bg-white outline-none focus:border-[#407B6A]"
                />
              </div>
              <div className="relative">
                <label className="absolute font-inter -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.6875rem] font-semibold tracking-wide">
                  UNIDADES PRODUZIDAS
                </label>
                <input
                  type="number"
                  value={unidadesProduzidas}
                  onChange={(e) =>
                    setUnidadesProduzidas(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  placeholder="20 Unidades"
                  className="border-2 border-[#4A4B51] rounded-xl font-inter pl-5 w-[14.25rem] h-[2.75rem] placeholder:text-[1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg bg-white outline-none focus:border-[#407B6A]"
                />
              </div>
            </div>

            <hr className="my-2" />

            {/* Resumo (agora dinâmico) */}
            <div className="flex flex-col gap-[0.75rem]">
              <div className="flex flex-row justify-between font-inter text-[#656565] bg-[#E2E2E2] rounded-[0.9375rem] py-[0.875rem] px-[1.0625rem]">
                <h3>Em produtos, você irá gastar (base total):</h3>
                <p className="text-[#3a3a3a] font-medium">
                  {totalQtdBase.toLocaleString("pt-BR")} {/** unidade é mista por item */}
                </p>
              </div>
              <div className="flex flex-row justify-between font-inter text-[#656565] bg-[#E2E2E2] rounded-[0.9375rem] py-[0.875rem] px-[1.0625rem]">
                <h3>Você teve um gasto de:</h3>
                <p className="text-[#3a3a3a] font-medium">
                  R$ {custoTotal.toFixed(2)}
                </p>
              </div>
              <div className="flex flex-row justify-between font-inter text-[#656565] bg-[#E2E2E2] rounded-[0.9375rem] py-[0.875rem] px-[1.0625rem]">
                <h3>Com {Number(margemPercent || 0)}% de margem, cada unidade será:</h3>
                <p className="text-[#3a3a3a] font-medium">
                  R$ {precoUnitSugerido.toFixed(2)}
                </p>
              </div>
              <div className="flex flex-row justify-between font-inter text-[#656565] bg-[#E2E2E2] rounded-[0.9375rem] py-[0.875rem] px-[1.0625rem]">
                <h3>Você terá um lucro total estimado:</h3>
                <p className="text-[#3a3a3a] font-medium">
                  R$ {lucroTotal.toFixed(2)}
                </p>
              </div>

              <div className="flex gap-3">
                <button className="bg-[#407B6A] rounded-[0.44938rem] px-8 py-2 font-inter text-white">
                  Acrescentar Produtos à Receita
                </button>
                {/* Se quiser converter isso em uma "ficha de receita" e salvar, conecte aqui */}
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
