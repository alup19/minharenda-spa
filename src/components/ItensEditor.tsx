import React, { useMemo, useState } from "react";
import { parseQuantidade } from "./units";
import type { Unidade } from "./units";

/** Modo único para compras/estoque */
export type ModoItens = "compra";

export interface ProdutoOption {
  id: number;
  nome: string;
  unidadeBase: Unidade;      // "UN" | "G" | "ML"
  custoMedio?: number;
  margemPadrao?: number;
}

export interface ItemLinha {
  produtoId?: number;

  /** ----- Entrada por unidade ----- */
  qtdConteudoInput?: string; // o que o usuário digita (ex.: "500", "950 g")
  unidadeSelecionada?: Unidade; // pode trocar G/ML/UN para o conteúdo informado
  custoUnitario?: number;   // preço de UMA unidade (ex.: R$ 3,00)
  quantidadeComprada?: number; // número de pacotes/unidades (ex.: 5)

  /** ----- Calculados ----- */
  qtdTotalBase?: number;    // (qtdConteudoBase × quantidadeComprada)
  custoUnitBase?: number;   // (subtotal / qtdTotalBase)
  subtotal?: number;        // (custoUnitario × quantidadeComprada)

  erro?: string;
}

type Props = {
  itens: ItemLinha[];
  produtos: ProdutoOption[];
  onChange: (next: ItemLinha[]) => void;

  /** Cadastro rápido inline (se não for passado, a UI de cadastro não aparece) */
  onCadastrarProdutoRapido?: (
    nome: string,
    unidade: Unidade
  ) => Promise<ProdutoOption>;
};

function toBaseNumber(input: string, u: Unidade) {
  // aceita "500", "500ml", "0,5l", "950 g", etc.
  const raw = String(input ?? "").trim().toLowerCase();
  if (!raw) return 0;

  // Se o usuário incluiu sufixo, deixe o parser decidir;
  // caso contrário, calcule usando a unidade escolhida.
  return parseQuantidade(/\d/.test(raw) ? raw : "0", u);
}

export default function ItensEditor({
  itens,
  produtos,
  onChange,
  onCadastrarProdutoRapido,
}: Props) {
  const [showNovoProduto, setShowNovoProduto] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novaUnidade, setNovaUnidade] = useState<Unidade>("UN");

  function setItem(idx: number, patch: Partial<ItemLinha>) {
    const next = [...itens];
    next[idx] = { ...next[idx], ...patch };

    const prod = produtos.find((p) => p.id === next[idx].produtoId);

    // unidade default: a do produto (se houver) ou a selecionada atual
    const unidadeRef: Unidade =
      patch.unidadeSelecionada ??
      next[idx].unidadeSelecionada ??
      prod?.unidadeBase ??
      "UN";

    next[idx].unidadeSelecionada = unidadeRef;

    // conteúdo por unidade → base
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

    // validações
    next[idx].erro = !next[idx].produtoId
      ? (onCadastrarProdutoRapido ? "Selecione ou cadastre um produto" : "Selecione um produto")
      : qtdConteudoBase <= 0
      ? "Informe o conteúdo (QTD) da unidade"
      : custoUnit <= 0
      ? "Informe o custo de uma unidade"
      : qtdComprada <= 0
      ? "Informe a quantidade comprada"
      : undefined;

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

    // adiciona na lista visual (quem controla 'produtos' é o pai)
    // aqui só selecionamos o recém-criado na linha focada
    if (typeof idxParaSelecionar === "number") {
      setItem(idxParaSelecionar, {
        produtoId: criado.id,
        unidadeSelecionada: criado.unidadeBase,
      });
    }
  }

  const totalGeral = useMemo(
    () => itens.reduce((s, it) => s + (Number(it.subtotal) || 0), 0),
    [itens]
  );

  return (
    <div className="w-full">
      {/* Cadastro rápido inline — só aparece se o pai passar onCadastrarProdutoRapido */}
      {onCadastrarProdutoRapido && (
        <div className="mb-2">
          {!showNovoProduto ? (
            <button
              type="button"
              className="text-[0.85rem] text-[#407B6A] underline"
              onClick={() => setShowNovoProduto(true)}
            >
              + Cadastrar novo produto
            </button>
          ) : (
            <div className="flex flex-wrap items-end gap-3 bg-[#F5F5F5] p-3 rounded-xl">
              <div className="relative">
                <label className="absolute -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.72rem] font-semibold">
                  NOME DO PRODUTO
                </label>
                <input
                  placeholder="Ex.: Farofa Yoki"
                  className="w-[18rem] border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]"
                />
              </div>
              <div className="relative">
                <label className="absolute -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.72rem] font-semibold">
                  UNIDADE BASE
                </label>
                <select
                  className="w-[10rem] border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]"
                >
                  <option value="UN">UN</option>
                  <option value="G">G</option>
                  <option value="ML">ML</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => cadastrarRapido()}
                className="text-white bg-[#308021] rounded-md px-4 py-2 text-[0.95rem] font-bold font-inter hover:opacity-90"
              >
                Salvar produto
              </button>
              <button
                type="button"
                onClick={() => setShowNovoProduto(false)}
                className="text-[#292727] px-2 py-1"
              >
                cancelar
              </button>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        {itens.map((it, idx) => {
          const sel = produtos.find((p) => p.id === it.produtoId);

          return (
            <div
              key={idx}
              className="bg-[#F5F5F5] rounded-xl p-3 flex flex-col gap-3"
            >
              <div className="flex gap-3 flex-wrap items-end">
                <div className="relative grow min-w-[16rem]">
                  <label className="absolute -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.72rem] font-semibold">
                    PRODUTO
                  </label>
                  <select
                    className="w-full border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]"
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

                  {/* hint aparece só se a UI de cadastro estiver ativa */}
                  {onCadastrarProdutoRapido && showNovoProduto && (
                    <div className="text-[0.8rem] text-[#407B6A] mt-1">
                      Após salvar acima, o novo produto aparecerá aqui.
                    </div>
                  )}
                </div>

                {/* QTD (conteúdo de UMA unidade) + unidade */}
                <div className="flex items-end gap-2">
                  <div className="relative w-28">
                    <label className="absolute -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.72rem] font-semibold">
                      QTD
                    </label>
                    <input
                      value={it.qtdConteudoInput ?? ""}
                      onChange={(e) => setItem(idx, { qtdConteudoInput: e.target.value })}
                      placeholder={
                        (it.unidadeSelecionada || sel?.unidadeBase || "UN") === "UN"
                          ? "1"
                          : (it.unidadeSelecionada || sel?.unidadeBase) === "G"
                          ? "950"
                          : "500"
                      }
                      className="w-full border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]"
                    />
                  </div>
                  <div className="relative w-24">
                    <label className="absolute -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.72rem] font-semibold">
                      UNID.
                    </label>
                    <select
                      className="w-full border-2 border-[#4A4B51] rounded-xl bg-white px-3 py-2 outline-none focus:border-[#407B6A]"
                    >
                      <option value="UN">UN</option>
                      <option value="G">G</option>
                      <option value="ML">ML</option>
                    </select>
                  </div>
                </div>

                {/* Custo de UMA unidade */}
                <div className="relative w-36">
                  <label className="absolute -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.72rem] font-semibold">
                    CUSTO (1 unid.)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="R$"
                    className="w-full border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]"
                  />
                </div>

                {/* Quantidade Comprada (nº de pacotes) */}
                <div className="relative w-[18.5rem]">
                  <label className="absolute -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.72rem] font-semibold">
                    QUANTIDADE COMPRADA
                  </label>
                  <input
                    type="number"
                    step="1"
                    placeholder="ex.: 5"
                    className="w-full border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]"
                  />
                </div>

                {/* Subtotal + Remover */}
                <div className="flex items-end ml-auto">
                  <div className="min-w-24 text-right font-inter mr-3">
                    <div className="text-xs text-[#4A4B51]">Subtotal</div>
                    <div className="font-semibold">
                      R$ {Number(it.subtotal || 0).toFixed(2)}
                    </div>
                    {it.qtdTotalBase ? (
                      <div className="text-[10px] text-[#656565]">
                        Qtde total base: {it.qtdTotalBase}
                      </div>
                    ) : null}
                  </div>
                  <button
                    onClick={() => remove(idx)}
                    className="self-end text-[#c02424] hover:opacity-80 px-2 py-1"
                    title="Remover"
                    type="button"
                  >
                    Remover
                  </button>
                </div>
              </div>

              {it.erro && <p className="text-[#c02424] text-xs">{it.erro}</p>}
            </div>
          );
        })}
      </div>

      <button
        onClick={addLinha}
        className="mt-3 text-[#407B6A] underline"
        type="button"
      >
        + Adicionar item
      </button>

      <div className="mt-4 flex justify-end font-inter">
        <div>
          <div className="text-sm text-[#4A4B51]">Total</div>
          <div className="text-lg font-semibold">R$ {totalGeral.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
