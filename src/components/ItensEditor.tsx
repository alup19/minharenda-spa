import { useState } from "react";
import { parseQuantidade } from "./units";
import type { Unidade } from "./units";

/** modos possíveis do editor */
export type ModoItens = "compra" | "venda";

export interface ProdutoOption {
  id: number;
  nome: string;
  unidadeBase: Unidade;
  custoMedio?: number;
  margemPadrao?: number;
  saldoBase?: number;
}

export interface ItemLinha {
  produtoId?: number;

  // CAMPOS USADOS NO MODO COMPRA
  qtdConteudoInput?: string;
  unidadeSelecionada?: Unidade;
  custoUnitario?: number;
  quantidadeComprada?: number;

  // CAMPOS COMUNS (base / totais)
  qtdTotalBase?: number; 
  subtotal?: number;
  custoUnitBase?: number;

  erro?: string;
}

interface Props {
  itens: ItemLinha[];
  produtos: ProdutoOption[];
  onChange: (itens: ItemLinha[]) => void;
  modo?: ModoItens;
  onCadastrarProdutoRapido?: (
    nome: string,
    unidade: Unidade
  ) => Promise<ProdutoOption>;
}

function toBaseNumber(input: string, u: Unidade) {
  const raw = String(input ?? "").trim().toLowerCase();
  if (!raw) return 0;
  return parseQuantidade(/\d/.test(raw) ? raw : "0", u);
}

export default function ItensEditor({ itens, produtos, onChange, modo = "compra", onCadastrarProdutoRapido, }: Props) {
  const [showNovoProduto, setShowNovoProduto] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novaUnidade, setNovaUnidade] = useState<Unidade>("UN");

  const botaoAdicionarTexto =
    modo === "compra" ? "Adicionar item comprado" : "Adicionar item vendido";

  function addLinha() {
    const nova: ItemLinha = {quantidadeComprada: 1,};
    onChange([...itens, nova]);
  }

  function setItem(indiceLinha: number, patch: Partial<ItemLinha>) {
    const itensAtualizados = [...itens];
    itensAtualizados[indiceLinha] = { ...itensAtualizados[indiceLinha], ...patch };

    const prod = produtos.find((p) => p.id === itensAtualizados[indiceLinha].produtoId);
    const unidadeRef: Unidade =
      itensAtualizados[indiceLinha].unidadeSelecionada ?? prod?.unidadeBase ?? "UN";

    itensAtualizados[indiceLinha].unidadeSelecionada = unidadeRef;

    if (modo === "compra") {
      const qtdConteudoBase = unidadeRef === "UN" ? 1 : toBaseNumber(itensAtualizados[indiceLinha].qtdConteudoInput || "", unidadeRef);

      const qtdComprada = Number(itensAtualizados[indiceLinha].quantidadeComprada || 0);
      const custoUnit = Number(itensAtualizados[indiceLinha].custoUnitario || 0);

      const qtdTotalBase = Math.max(0, qtdConteudoBase * qtdComprada);
      const subtotal = Math.max(0, +(custoUnit * qtdComprada).toFixed(2));
      const custoUnitBase = qtdTotalBase > 0 ? +(subtotal / qtdTotalBase).toFixed(6) : undefined;

      itensAtualizados[indiceLinha].qtdTotalBase = qtdTotalBase || undefined;
      itensAtualizados[indiceLinha].subtotal = subtotal || undefined;
      itensAtualizados[indiceLinha].custoUnitBase = custoUnitBase;

    } else {
      const qtdVendida = Number(itensAtualizados[indiceLinha].quantidadeComprada || 0);
      const precoUnit = Number(itensAtualizados[indiceLinha].custoUnitario || 0);

      const qtdTotalBase = Math.max(0, qtdVendida);
      const subtotal = Math.max(0, +(precoUnit * qtdVendida).toFixed(2));
      const custoUnitBase = qtdTotalBase > 0 && subtotal > 0 ? +(subtotal / qtdTotalBase).toFixed(4) : undefined;

      itensAtualizados[indiceLinha].qtdTotalBase = qtdTotalBase || undefined;
      itensAtualizados[indiceLinha].subtotal = subtotal || undefined;
      itensAtualizados[indiceLinha].custoUnitBase = custoUnitBase;

      const estoqueDisponivel = prod && prod.saldoBase != null ? Number(prod.saldoBase) : undefined;

      let erro: string | undefined;
      if (!itensAtualizados[indiceLinha].produtoId) erro = "Selecione um produto";
      else if (qtdVendida <= 0) erro = "Informe a quantidade vendida";
      else if (precoUnit <= 0) erro = "Informe o valor por unidade";
      else if (
        estoqueDisponivel != null &&
        qtdVendida > estoqueDisponivel
      ) {
        erro = `Quantidade em estoque: ${estoqueDisponivel}`;
      }

      itensAtualizados[indiceLinha].erro = erro;
    }

    onChange(itensAtualizados);
  }

  function remove(indiceLinha: number) {
    const itensAtualizados = [...itens];
    itensAtualizados.splice(indiceLinha, 1);
    onChange(itensAtualizados);
  }

  async function cadastrarRapido(idxParaSelecionar?: number) {
    if (!onCadastrarProdutoRapido) return;
    const nome = novoNome.trim();
    if (!nome) return;

    const criado = await onCadastrarProdutoRapido(nome, novaUnidade);
    setShowNovoProduto(false);
    setNovoNome("");
    setNovaUnidade("UN");

    if (typeof idxParaSelecionar === "number") {
      setItem(idxParaSelecionar, {
        produtoId: criado.id,
        unidadeSelecionada: criado.unidadeBase,
      });
    }
  }

  return (
    <div className="mt-4">
      {onCadastrarProdutoRapido && (
        <div className="border-[#CCCCCC] rounded-xl mb-4">
          <button type="button" className="text-white bg-[#308021] rounded-md px-6 py-2 text-[0.9rem] font-semibold font-inter hover:opacity-90 mr-6" onClick={() => setShowNovoProduto((v) => !v)}>
            {showNovoProduto ? "Fechar cadastro rápido" : "Cadastrar novo produto"}
          </button>

          {showNovoProduto && (
            <div className="mt-6 flex gap-3 items-center flex-wrap border border-[#D0D0D0] rounded-xl px-4 py-5 bg-[#F5F5F5]">
              <div className="relative">
                <label className="absolute -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.72rem] font-semibold">
                  NOME DO PRODUTO
                </label>
                <input type="text" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} placeholder="Ex.: Farofa Yoki" className="w-[18rem] border-2 border-[#4A4B51] rounded-xl bg-[#F5F5F5] px-4 py-2 outline-none focus:border-[#407B6A]"
                />
              </div>
              <div className="relative">
                <label className="absolute -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.72rem] font-semibold">
                  BASE
                </label>
                <select value={novaUnidade} onChange={(e) => setNovaUnidade(e.target.value as Unidade)} className="border-2 border-[#4A4B51] rounded-xl bg-[#F5F5F5] px-4 py-2 outline-none focus:border-[#407B6A]">
                  <option value="UN">UN</option>
                  <option value="G">G</option>
                  <option value="ML">ML</option>
                </select>
              </div>
              <button type="button" onClick={() => cadastrarRapido()} className="text-white bg-[#308021] rounded-md px-4 py-2 text-[0.95rem] font-bold font-inter hover:opacity-90">Salvar produto</button>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {itens.map((it, idx) => {
          const prod = produtos.find((p) => p.id === it.produtoId);
          const unidade = it.unidadeSelecionada ?? prod?.unidadeBase ?? "UN";

          const estoque = prod && prod.saldoBase != null ? Number(prod.saldoBase) : undefined;
          const estoqueDisplay =
            estoque == null ? "-" : Number.isInteger(estoque) ? estoque.toString() : estoque.toFixed(3);

          return (
            <div key={idx} className="border border-[#D0D0D0] rounded-xl px-4 py-3 flex flex-col gap-2 bg-[#F5F5F5]">
              <div className="flex flex-wrap gap-3 items-end">
                <div className="relative">
                  <label className="absolute -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.72rem] font-semibold">
                    PRODUTO
                  </label>
                  <select className="w-[16rem] border-2 border-[#4A4B51] rounded-xl bg-[#F5F5F5] px-4 py-2 outline-none focus:border-[#407B6A]" value={it.produtoId ?? ""}
                    onChange={(e) => {
                      const id = Number(e.target.value || 0);
                      const p = produtos.find((pp) => pp.id === id);
                      setItem(idx, { produtoId: id || undefined, unidadeSelecionada: p?.unidadeBase ?? unidade, });
                    }}>
                    <option value="">Selecione...</option>
                    {produtos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {modo === "compra" && (
                  <>
                    {unidade !== "UN" && (
                      <div className="flex gap-2 items-end">
                        <div className="relative">
                          <label className="absolute -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.72rem] font-semibold">
                            CONTEÚDO (1 unid.)
                          </label>
                          <input type="text" className="w-[9rem] border-2 border-[#4A4B51] rounded-xl bg-[#F5F5F5] px-4 py-2 outline-none focus:border-[#407B6A]" placeholder={ unidade === "G" ? "950g" : unidade === "ML" ? "1000 ML" : "1un" } value={it.qtdConteudoInput ?? ""}
                            onChange={(e) =>
                              setItem(idx, {qtdConteudoInput: e.target.value,})
                            }
                          />
                        </div>
                        <div className="w-[4rem] border-2 border-[#4A4B51] rounded-xl bg-[#E9E9E9] px-4 py-2 flex items-center justify-center text-[#4A4B51]">
                          {unidade}
                        </div>
                      </div>
                    )}

                    <div className="relative w-32">
                      <label className="absolute -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.72rem] font-semibold">
                        CUSTO R$
                      </label>
                      <input type="number" step="0.01" className="w-full border-2 border-[#4A4B51] rounded-xl bg-[#F5F5F5] px-4 py-2 outline-none focus:border-[#407B6A]" value={it.custoUnitario ?? ""}
                        onChange={(e) =>
                          setItem(idx, {custoUnitario: Number(e.target.value || 0),})
                        }
                      />
                    </div>
                  </>
                )}

                <div className="relative w-[12rem]">
                  <label className="absolute -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.72rem] font-semibold">
                    QTD COMPRADA
                  </label>
                  <input type="number" step="0.01" className="w-full border-2 border-[#4A4B51] rounded-xl bg-[#F5F5F5] px-4 py-2 outline-none focus:border-[#407B6A]" value={it.quantidadeComprada ?? ""}
                    onChange={(e) =>
                      setItem(idx, {quantidadeComprada: Number(e.target.value || 0),})
                    }
                  />
                </div>

                {modo === "venda" && (
                  <>
                    <div className="relative w-36">
                      <label className="absolute -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.72rem] font-semibold">
                        VALOR R$
                      </label>
                      <input type="number" step="0.01" className="w-full border-2 border-[#4A4B51] rounded-xl bg-[#F5F5F5] px-4 py-2 outline-none focus:border-[#407B6A]" value={it.custoUnitario ?? ""}
                        onChange={(e) =>
                          setItem(idx, {custoUnitario: Number(e.target.value || 0),})
                        }
                      />
                    </div>
                  </>
                )}

                <button type="button" onClick={() => remove(idx)} className="ml-auto text-sm text-red-600 font-semibold">Remover</button>
              </div>

              <div className="flex items-center justify-between mt-1 text-sm">
                <div className="text-[#4A4B51]">
                  {modo === "compra" ? (
                    <>
                      {it.custoUnitBase != null && (
                        <>Valor por {unidade}:{" "}<span className="font-semibold">R$ {it.custoUnitBase.toFixed(2)}</span></>
                      )}
                    </>
                  ) : (
                    <>
                      Quantidade estoque:{" "}<span className="font-semibold">{estoqueDisplay} {unidade}</span>
                    </>
                  )}
                </div>

                <div className="text-[#4A4B51]">Subtotal:{" "} <span className="font-semibold">R$ {(Number(it.subtotal) || 0).toFixed(2)}</span></div>
              </div>
            </div>
          );
        })}
      </div>

      <button type="button" onClick={addLinha} className="text-white bg-[#308021] rounded-md px-6 py-2 mt-5 text-[0.9rem] font-semibold font-inter hover:opacity-90"> {botaoAdicionarTexto}
      </button>
    </div>
  );
}
