import { useState } from "react";
import { parseQuantidade } from "./units";
import type { Unidade } from "./units";

export type ModoItens = "compra";

export interface ProdutoOption {
  id: number;
  nome: string;
  unidadeBase: Unidade;
  custoMedio?: number;
  margemPadrao?: number;
}

export interface ItemLinha {
  produtoId?: number;

  qtdConteudoInput?: string;
  unidadeSelecionada?: Unidade;
  custoUnitario?: number;
  quantidadeComprada?: number;

  qtdTotalBase?: number;    // (qtdConteudo × quantidadeComprada)
  custoUnitBase?: number;   // (subtotal / qtdTotalBase)
  subtotal?: number;        // (custoUnitario × quantidadeComprada)

  erro?: string;
}

type Props = {
  itens: ItemLinha[];
  produtos: ProdutoOption[];
  onChange: (next: ItemLinha[]) => void;

  onCadastrarProdutoRapido?: (
    nome: string,
    unidade: Unidade
  ) => Promise<ProdutoOption>;
};

function toBaseNumber(input: string, u: Unidade) {
  // formataçao p aceitar 500, 500ml, 0,5l, 950 g
  const raw = String(input ?? "").trim().toLowerCase();
  if (!raw) return 0;
  return parseQuantidade(/\d/.test(raw) ? raw : "0", u);
}

export default function ItensEditor({ itens, produtos, onChange, onCadastrarProdutoRapido }: Props) {
  const [showNovoProduto, setShowNovoProduto] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novaUnidade, setNovaUnidade] = useState<Unidade>("UN");

  function setItem(idx: number, patch: Partial<ItemLinha>) {
    const next = [...itens];
    next[idx] = { ...next[idx], ...patch };

    const prod = produtos.find((p) => p.id === next[idx].produtoId);

    const unidadeRef: Unidade =
      patch.unidadeSelecionada ??
      next[idx].unidadeSelecionada ??
      prod?.unidadeBase ??
      "UN";

    next[idx].unidadeSelecionada = unidadeRef;

    const qtdConteudoBase = toBaseNumber(next[idx].qtdConteudoInput || "", unidadeRef);

    const qtdComprada = Number(next[idx].quantidadeComprada || 0);
    const custoUnit = Number(next[idx].custoUnitario || 0);

    const qtdTotalBase = Math.max(0, qtdConteudoBase * qtdComprada);
    const subtotal = Math.max(0, +(custoUnit * qtdComprada).toFixed(2));
    const custoUnitBase =
      qtdTotalBase > 0 ? +(subtotal / qtdTotalBase).toFixed(6) : undefined;

    next[idx].qtdTotalBase = qtdTotalBase || undefined;
    next[idx].subtotal = subtotal || undefined;
    next[idx].custoUnitBase = custoUnitBase;

    next[idx].erro = !next[idx].produtoId ? (onCadastrarProdutoRapido ? "Selecione ou cadastre um produto" : "Selecione um produto") : qtdConteudoBase <= 0 ? "Informe o conteúdo (QTD) da unidade" : custoUnit <= 0 ? "Informe o custo de uma unidade" : qtdComprada <= 0 ? "Informe a quantidade comprada" : undefined;

    onChange(next);
  }

  function addLinha() {
    onChange([
      ...itens,
      {
        qtdConteudoInput: "",
        unidadeSelecionada: "UN",
        custoUnitario: undefined,
        quantidadeComprada: undefined,
      },
    ]);
  }

  function remove(idx: number) {
    const next = [...itens];
    next.splice(idx, 1);
    onChange(next);
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
    <div className="w-full">
      {onCadastrarProdutoRapido && (
        <div className="mb-2">
          {!showNovoProduto ? (
            <button type="button" className="text-white bg-[#308021] rounded-md px-4 py-2 text-[0.95rem] font-bold font-inter hover:opacity-90" onClick={() => setShowNovoProduto(true)}>+ Cadastrar Produto no Estoque</button>
          ) : (
            <div className="flex flex-wrap items-end gap-3 bg-[#F5F5F5] p-3 rounded-xl">
              <div className="relative">
                <label className="absolute -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.72rem] font-semibold">NOME DO PRODUTO</label>
                <input value={novoNome} onChange={(e) => setNovoNome(e.target.value)} placeholder="Ex.: Farofa Yoki" className="w-[18rem] border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]"/>
              </div>
              <div className="relative">
                <label className="absolute -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.72rem] font-semibold">UNIDADE BASE</label>
                <select value={novaUnidade} onChange={(e) => setNovaUnidade(e.target.value as Unidade)} className="w-[10rem] border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]">
                  <option value="UN">UN</option>
                  <option value="G">G</option>
                  <option value="ML">ML</option>
                </select>
              </div>
              <button type="button" onClick={() => cadastrarRapido()} className="text-white bg-[#308021] rounded-md px-4 py-2 text-[0.95rem] font-bold font-inter hover:opacity-90">
                Salvar produto
              </button>
              <button type="button" onClick={() => setShowNovoProduto(false)} className="text-[#c02424] px-2 py-1">
                Cancelar
              </button>
            </div>
          )}
          <button onClick={addLinha} className="text-white bg-[#308021] rounded-md px-4 py-2 ml-6 text-[0.95rem] font-bold font-inter hover:opacity-90" type="button">+ Adicionar Item no Estoque</button>
        </div>
      )}

      <div className="space-y-2">
        {itens.map((it, idx) => {
          const sel = produtos.find((p) => p.id === it.produtoId);

          return (
            <div key={idx} className="bg-[#F5F5F5] font-inter rounded-xl p-3 flex flex-col gap-3">
              <div className="flex gap-3 flex-wrap items-end">
                <div className="relative grow min-w-[16rem]">
                  <label className="absolute -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.72rem] font-semibold">
                    PRODUTO
                  </label>
                  <select
                    className="w-full border-2 border-[#4A4B51] rounded-xl  bg-[#F5F5F5] px-4 py-2 outline-none focus:border-[#407B6A]"
                    value={it.produtoId ?? ""}
                    onChange={(e) =>
                      setItem(idx, {
                        produtoId: Number(e.target.value) || undefined,
                        unidadeSelecionada:
                          produtos.find((p) => p.id === Number(e.target.value))
                            ?.unidadeBase ?? it.unidadeSelecionada ?? "UN",
                      })
                    }
                  >
                    <option value="">Selecionar</option>
                    {produtos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome}
                      </option>
                    ))}
                  </select>

                  {onCadastrarProdutoRapido && showNovoProduto && (
                    <div className="text-[0.8rem] text-[#407B6A] mt-1">Após salvar acima, o novo produto aparecerá aqui.</div>
                  )}
                </div>

                <div className="flex items-end gap-2">
                  <div className="relative w-28">
                    <label className="absolute -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.72rem] font-semibold">
                      QTD
                    </label>
                    <input
                      className="w-full border-2 border-[#4A4B51] rounded-xl  bg-[#F5F5F5] px-4 py-2 outline-none focus:border-[#407B6A]"
                      value={it.qtdConteudoInput ?? ""}
                      onChange={(e) => setItem(idx, { qtdConteudoInput: e.target.value })}
                      placeholder={
                        (it.unidadeSelecionada || sel?.unidadeBase || "UN") === "UN"
                          ? "1"
                          : (it.unidadeSelecionada || sel?.unidadeBase) === "G"
                            ? "950"
                            : "500"
                      }
                    />
                  </div>
                  <div className="relative w-24">
                    <label className="absolute -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.72rem] font-semibold">
                      UNID.
                    </label>
                    <select
                      value={it.unidadeSelecionada ?? sel?.unidadeBase ?? "UN"}
                      onChange={(e) =>
                        setItem(idx, { unidadeSelecionada: e.target.value as Unidade })
                      }
                      className="w-full border-2 border-[#4A4B51] rounded-xl bg-[#F5F5F5] px-3 py-2 outline-none focus:border-[#407B6A]">
                      <option value="UN">UN</option>
                      <option value="G">G</option>
                      <option value="ML">ML</option>
                    </select>
                  </div>
                </div>

                <div className="relative w-36">
                  <label className="absolute -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.72rem] font-semibold">
                    CUSTO (1 unid.)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={it.custoUnitario ?? ""}
                    onChange={(e) =>
                      setItem(idx, { custoUnitario: Number(e.target.value || 0) })
                    }
                    placeholder="R$"
                    className="w-full border-2 border-[#4A4B51] rounded-xl  bg-[#F5F5F5] px-4 py-2 outline-none focus:border-[#407B6A]"
                  />
                </div>

                <div className="relative w-[18.5rem]">
                  <label className="absolute -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.72rem] font-semibold">
                    QUANTIDADE COMPRADA
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={it.quantidadeComprada ?? ""}
                    onChange={(e) =>
                      setItem(idx, { quantidadeComprada: Number(e.target.value || 0) })
                    }
                    placeholder="ex.: 5"
                    className="w-full border-2 border-[#4A4B51] rounded-xl bg-[#F5F5F5] px-4 py-2 outline-none focus:border-[#407B6A]"
                  />
                </div>

                <div className="flex items-end ml-auto">
                  <div className="min-w-24 text-right font-inter mr-3">
                    <div className="text-xs text-[#4A4B51]">Subtotal</div>
                    <div className="font-semibold">
                      R$ {Number(it.subtotal || 0).toFixed(2)}
                    </div>
                    {it.qtdTotalBase ? (
                      <div className="text-[10px] text-[#656565]">
                        Quantidade: {it.qtdTotalBase}
                      </div>
                    ) : null}
                  </div>
                  <button onClick={() => remove(idx)} className="self-center font-inter text-[#c02424] hover:opacity-80 px-2 py-1" title="Remover" type="button">
                    Remover
                  </button>
                </div>
              </div>

              {it.erro && <p className="text-[#c02424] text-xs">{it.erro}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
