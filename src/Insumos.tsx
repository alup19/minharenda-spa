import { useEffect, useMemo, useState } from "react";
import Titulo from "./components/Titulo";
import { parseQuantidade } from "./components/units.js";
import type { Unidade } from "./components/units.js";
import { toast } from "sonner";
import Modal from "./components/Modal.js";
import { useUsuarioStore } from "./context/UsuarioContext.js";

const apiUrl = import.meta.env.VITE_API_URL;

type ProdutoEstoque = {
  id: number;
  nome: string;
  unidadeBase: Unidade;
  saldoBase: number;
  custoMedio: number;
  saldoDisplay: number;
  unidadeDisplay: string;
  precoMedioDisplay: number;
  categoria: string | null;
};

type LinhaInsumo = {
  produtoId?: number;
  qtdInput?: string;
  qtdBase?: number;
  erro?: string;
};

export default function Insumos() {
  const { usuario } = useUsuarioStore();

  const [produtos, setProdutos] = useState<ProdutoEstoque[]>([]);
  const [linhas, setLinhas] = useState<LinhaInsumo[]>([
    { produtoId: undefined, qtdInput: "" },
  ]);

  const [margemPercent, setMargemPercent] = useState<number | "">("");
  const [unidadesProduzidas, setUnidadesProduzidas] = useState<number | "">("");

  const [openModalProdutoFinal, setOpenModalProdutoFinal] = useState(false);
  const [nomeProdutoFinal, setNomeProdutoFinal] = useState("");

  async function carregarProdutos() {
    if (!usuario?.id) return;

    try {
      const resp = await fetch(`${apiUrl}/produtos/${usuario.id}`, {
        headers: usuario?.token
          ? { Authorization: `Bearer ${usuario.token}` }
          : {},
      });
      const dados = await resp.json();

      const mapped: ProdutoEstoque[] = (dados || [])
        .filter((p: any) => p.ativo !== false)
        .map((p: any) => {
          const unidadeBase: Unidade = p.unidadeBase as Unidade;

          let unidadeDisplay =
            p.unidadeDisplay ??
            (unidadeBase === "G"
              ? "kg"
              : unidadeBase === "ML"
                ? "L"
                : "un");

          let saldoBase = Number(p.saldoBase ?? 0);
          let saldoDisplay =
            p.saldoDisplay ??
            (unidadeBase === "G" || unidadeBase === "ML"
              ? +(saldoBase / 1000).toFixed(3)
              : saldoBase);

          let custoMedio = Number(p.custoMedio ?? 0);
          let precoMedioDisplay =
            p.precoMedioDisplay ??
            (unidadeBase === "G" || unidadeBase === "ML"
              ? +(custoMedio * 1000).toFixed(6)
              : custoMedio);

          return {
            id: p.id,
            nome: p.nome,
            unidadeBase,
            saldoBase,
            custoMedio,
            saldoDisplay,
            unidadeDisplay,
            precoMedioDisplay,
            categoria: p.categoria ?? null,
          };
        });

      setProdutos(mapped);
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível carregar os produtos do estoque.");
    }
  }

  useEffect(() => {
    if (usuario?.id) {
      carregarProdutos();
    }
  }, [usuario?.id]);

  function atualizarLinha(idx: number, patch: Partial<LinhaInsumo>) {
    const next = [...linhas];
    next[idx] = { ...next[idx], ...patch };

    const prod = produtos.find((p) => p.id === next[idx].produtoId);
    const unidade: Unidade = prod?.unidadeBase ?? "UN";

    const qtdBase = parseQuantidade(next[idx].qtdInput || "0", unidade);
    next[idx].qtdBase = qtdBase || undefined;

    next[idx].erro = !next[idx].produtoId
      ? "Selecione um produto"
      : qtdBase <= 0
        ? "Informe uma quantidade válida"
        : undefined;

    setLinhas(next);
  }

  function adicionarLinha() {
    setLinhas((prev) => [...prev, { produtoId: undefined, qtdInput: "" }]);
  }

  function removerLinha(idx: number) {
    const next = [...linhas];
    next.splice(idx, 1);
    setLinhas(next.length ? next : [{ produtoId: undefined, qtdInput: "" }]);
  }

  const custoTotal = useMemo(() => {
    return linhas.reduce((s, l) => {
      if (!l.produtoId || !l.qtdBase) return s;
      const p = produtos.find((x) => x.id === l.produtoId);
      if (!p) return s;
      return s + p.custoMedio * l.qtdBase;
    }, 0);
  }, [linhas, produtos]);

  const precoUnitarioSugerido = useMemo(() => {
    const unidades = Number(unidadesProduzidas || 0);
    if (!unidades) return 0;

    const base = custoTotal / unidades;
    const margem = Number(margemPercent || 0) / 100;

    return +(base * (1 + margem)).toFixed(2);
  }, [custoTotal, unidadesProduzidas, margemPercent]);

  async function handleConfirmarProdutoFinal() {
    if (!nomeProdutoFinal.trim()) {
      toast.error("Informe o nome do produto final.");
      return;
    }
    const unidades = Number(unidadesProduzidas || 0);
    if (!unidades || unidades <= 0) {
      toast.error("Informe as unidades produzidas.");
      return;
    }

    const temExcesso = linhas.some((l) => {
      if (!l.produtoId || !l.qtdBase) return false;
      const prod = produtos.find((p) => p.id === l.produtoId);
      if (!prod) return false;
      return l.qtdBase > prod.saldoBase;
    });

    if (temExcesso) {
      toast.error(
        "Você está utilizando mais insumos do que há em estoque. Verifique as quantidades."
      );
      return;
    }

    const nome = nomeProdutoFinal.trim();

    const existente = produtos.find(
      (p) => p.nome.toLowerCase() === nome.toLowerCase()
    );

    let produtoId = existente?.id;

    if (!existente) {
      try {
        const resp = await fetch(`${apiUrl}/produtos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(usuario?.token
              ? { Authorization: `Bearer ${usuario.token}` }
              : {}),
          },
          body: JSON.stringify({
            nome,
            unidadeBase: "UN",
            usuarioId: usuario.id,
            categoria: null,
          }),
        });

        if (resp.status !== 201) {
          const t = await resp.text();
          console.error("Erro ao criar produto final:", t);
          toast.error("Erro ao criar produto final.");
          return;
        }

        const criado = await resp.json();
        produtoId = criado.id;
      } catch (e) {
        console.error(e);
        toast.error("Erro ao criar produto final no estoque.");
        return;
      }
    }

    const unidadesNovas = unidades;
    const custoUnit = precoUnitarioSugerido;

    try {
      await fetch(`${apiUrl}/produtos/${produtoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(usuario?.token
            ? { Authorization: `Bearer ${usuario.token}` }
            : {}),
        },
        body: JSON.stringify({
          saldoBase: unidadesNovas,
          custoMedio: custoUnit,
        }),
      });
    } catch (e) {
      console.error(e);
      toast.error("Erro ao atualizar o estoque do produto final.");
      return;
    }

    try {
      for (const l of linhas) {
        if (!l.produtoId || !l.qtdBase) continue;

        const prod = produtos.find((p) => p.id === l.produtoId);
        if (!prod) continue;

        const novoSaldoBase = Math.max(0, prod.saldoBase - l.qtdBase);

        await fetch(`${apiUrl}/produtos/${l.produtoId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(usuario?.token
              ? { Authorization: `Bearer ${usuario.token}` }
              : {}),
          },
          body: JSON.stringify({
            saldoBase: novoSaldoBase,
          }),
        });
      }

      await carregarProdutos();

      toast.success("Produto final adicionado e insumos descontados do estoque!");
      setOpenModalProdutoFinal(false);
      setNomeProdutoFinal("");
    } catch (e) {
      console.error(e);
      toast.error("Erro ao dar baixa nos insumos.");
    }
  }

  return (
    <>
      <Titulo />

      <section className="mt-[3rem] mb-[2rem] flex flex-row justify-center gap-[3rem]">
        {/* ----------------- ESTOQUE (ESQUERDA) --------------- */}
        <div className="w-[30rem] flex flex-col gap-[1.44rem]">
          <div className="flex flex-row items-center gap-[0.7rem]">
            <img src="/tabela.svg" className="w-[2rem] h-[2rem]" alt="" />
            <h2 className="text-[2rem] font-inter font-semibold">Estoque</h2>
          </div>

          <div className="bg-[#F5F5F5] px-[1.62rem] py-[1.93rem] rounded-[1rem] flex flex-col gap-[0.75rem]">
            {produtos.map((p) => (
              <div
                key={p.id}
                className="bg-[#E2E2E2] py-[0.875rem] px-[1.06rem] rounded-[0.9375rem] flex flex-row justify-between items-center"
              >
                <p className="text-[#656565] font-inter text-[1rem]">
                  {p.nome}
                </p>

                <p className="text-[#303030] font-inter font-semibold">
                  {p.saldoDisplay} {p.unidadeDisplay}
                </p>

                <p className="text-[#656565] font-inter">
                  R$ {p.precoMedioDisplay.toFixed(2)} /{p.unidadeDisplay}
                </p>

                <button className="bg-[#F6DDA6] rounded-[0.46875rem] px-[1.06rem] py-[0.10rem] text-[#705519] font-inter text-[0.975rem] font-medium">
                  -
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ----------------- INSUMOS (DIREITA) --------------- */}
        <div className="w-[40rem] flex flex-col gap-[1.44rem]">
          <div className="flex flex-row items-center gap-[0.7rem]">
            <img src="/tabela.svg" className="w-[2rem] h-[2rem]" alt="" />
            <h2 className="text-[2rem] font-inter font-semibold">Insumos</h2>
          </div>

          <div className="bg-[#F5F5F5] px-[1.62rem] py-[1.93rem] rounded-[1rem] flex flex-col gap-[0.75rem]">
            {linhas.map((l, idx) => {
              const produto = produtos.find((p) => p.id === l.produtoId);
              const unidade = produto?.unidadeBase ?? "UN";

              return (
                <div
                  key={idx}
                  className="flex flex-row items-center gap-[0.75rem]"
                >
                  <select
                    className="border-2 border-[#4A4B51] rounded-xl pl-3 w-[14rem] h-[2.5rem] bg-white outline-none"
                    value={l.produtoId ?? ""}
                    onChange={(e) =>
                      atualizarLinha(idx, {
                        produtoId:
                          e.target.value === "" ? undefined : Number(e.target.value),
                      })
                    }
                  >
                    <option value="">Selecione</option>
                    {produtos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome}
                      </option>
                    ))}
                  </select>

                  <input
                    className="border-2 border-[#4A4B51] rounded-xl pl-3 w-[9rem] h-[2.5rem] bg-white outline-none"
                    placeholder={
                      unidade === "G"
                        ? "500 (g)"
                        : unidade === "ML"
                          ? "500 (ml)"
                          : "2 (un)"
                    }
                    value={l.qtdInput ?? ""}
                    onChange={(e) =>
                      atualizarLinha(idx, { qtdInput: e.target.value })
                    }
                  />

                  <button
                    type="button"
                    onClick={() => removerLinha(idx)}
                    className="text-[#D13B3B] font-inter text-[0.95rem]"
                  >
                    Remover
                  </button>

                  {l.erro && (
                    <span className="text-xs text-red-500 ml-2">{l.erro}</span>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={adicionarLinha}
              className="mt-2 text-[#407B6A] font-inter text-[0.95rem] underline"
            >
              + Adicionar insumo
            </button>

            <div className="mt-5 flex flex-row gap-[0.75rem]">
              <input
                className="border-2 border-[#4A4B51] rounded-xl pl-3 w-[9rem] h-[2.5rem] bg-white outline-none"
                placeholder="Margem %"
                type="number"
                value={margemPercent}
                onChange={(e) =>
                  setMargemPercent(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
              <input
                className="border-2 border-[#4A4B51] rounded-xl pl-3 w-[9rem] h-[2.5rem] bg-white outline-none"
                placeholder="Unidades"
                type="number"
                value={unidadesProduzidas}
                onChange={(e) =>
                  setUnidadesProduzidas(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
            </div>

            <div className="mt-4 bg-white rounded-[0.9375rem] px-4 py-3 font-inter">
              <p>Custo total: R$ {custoTotal.toFixed(2)}</p>
              <p>
                Preço unitário sugerido: R$ {precoUnitarioSugerido.toFixed(2)}
              </p>

              <button
                type="button"
                onClick={() => setOpenModalProdutoFinal(true)}
                className="mt-3 flex text-white items-center justify-center rounded-[0.5rem] bg-[linear-gradient(139deg,_#114114_-40.56%,_#00C000_279.19%)] w-[16rem] h-[2.7rem] text-[1rem] font-roboto font-normal"
              >
                Acrescentar Produtos no Estoque
              </button>
            </div>
          </div>
        </div>
      </section>

      <Modal
        open={openModalProdutoFinal}
        onClose={() => setOpenModalProdutoFinal(false)}
      >
        <div className="container flex flex-col gap-4 font-inter">
          <h2 className="text-[1.3rem] font-semibold">
            Nome do produto que será criado no estoque
          </h2>

          <input
            className="border-2 border-[#4A4B51] rounded-xl px-4 py-2 outline-none focus:border-[#407B6A]"
            placeholder="Ex: Panetone"
            value={nomeProdutoFinal}
            onChange={(e) => setNomeProdutoFinal(e.target.value)}
          />

          <div className="mt-4 flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => setOpenModalProdutoFinal(false)}
              className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmarProdutoFinal}
              className="text-white bg-[#308021] rounded-md px-6 py-2 text-[1rem] font-bold font-inter hover:opacity-90"
            >
              Confirmar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
