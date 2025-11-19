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
  const [linhasInsumos, setLinhasInsumos] = useState<LinhaInsumo[]>([
    { produtoId: undefined, qtdInput: "" },
  ]);

  const [margemPercentual, setMargemPercentual] = useState<number | "">("");
  const [unidadesProduzidas, setUnidadesProduzidas] = useState<number | "">("");

  const [openModalProdutoFinal, setOpenModalProdutoFinal] = useState(false);
  const [nomeProdutoFinal, setNomeProdutoFinal] = useState("");

  async function carregarProdutos() {
    if (!usuario?.id) return;

    try {
      const responseProdutos = await fetch(`${apiUrl}/produtos/${usuario.id}`, {
        headers: usuario?.token
          ? { Authorization: `Bearer ${usuario.token}` }
          : {},
      });
      const dataProdutos = await responseProdutos.json();

      const produtosMapeados: ProdutoEstoque[] = (dataProdutos || [])
        .filter((produto: any) => produto.ativo !== false)
        .map((produto: any) => {
          const unidadeBase: Unidade = produto.unidadeBase as Unidade;

          let unidadeDisplay = produto.unidadeDisplay ?? (unidadeBase === "G" ? "kg" : unidadeBase === "ML" ? "L" : "un");

          let saldoBase = Number(produto.saldoBase ?? 0);
          let saldoDisplay = produto.saldoDisplay ?? (unidadeBase === "G" || unidadeBase === "ML" ? +(saldoBase / 1000).toFixed(3) : saldoBase);

          let custoMedio = Number(produto.custoMedio ?? 0);
          let precoMedioDisplay = produto.precoMedioDisplay ?? (unidadeBase === "G" || unidadeBase === "ML" ? +(custoMedio * 1000).toFixed(6) : custoMedio);

          return {
            id: produto.id, nome: produto.nome, unidadeBase, saldoBase, custoMedio, saldoDisplay, unidadeDisplay, precoMedioDisplay, categoria: produto.categoria ?? null,
          };
        });

      setProdutos(produtosMapeados);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível carregar os produtos do estoque.");
    }
  }

  useEffect(() => {
    if (usuario?.id) {
      carregarProdutos();
    }
  }, [usuario?.id]);

  function atualizarLinhaInsumo(linhaIndex: number, dadosParciais: Partial<LinhaInsumo>) {
    const linhasAtualizadas = [...linhasInsumos];

    linhasAtualizadas[linhaIndex] = { ...linhasAtualizadas[linhaIndex], ...dadosParciais, };

    const produtoSelecionado = produtos.find((produto) => produto.id === linhasAtualizadas[linhaIndex].produtoId);

    const unidadeProduto: Unidade = produtoSelecionado?.unidadeBase ?? "UN";
    const quantidadeBase = parseQuantidade(linhasAtualizadas[linhaIndex].qtdInput || "0", unidadeProduto);

    linhasAtualizadas[linhaIndex].qtdBase = quantidadeBase || undefined;

    linhasAtualizadas[linhaIndex].erro = !linhasAtualizadas[linhaIndex].produtoId ? "Selecione um produto" : quantidadeBase <= 0 ? "Informe uma quantidade válida" : undefined;

    setLinhasInsumos(linhasAtualizadas);
  }

  function adicionarLinhaInsumo() {
    setLinhasInsumos((linhasAnteriores) => [...linhasAnteriores, { produtoId: undefined, qtdInput: "" },
    ]);
  }

  function removerLinhaInsumo(linhaIndex: number) {
    const linhasAtualizadas = [...linhasInsumos];
    linhasAtualizadas.splice(linhaIndex, 1);
    setLinhasInsumos(linhasAtualizadas.length ? linhasAtualizadas : [{ produtoId: undefined, qtdInput: "" }]
    );
  }

  const custoTotalInsumos = useMemo(() => {
    return linhasInsumos.reduce((total, linhaInsumo) => {
      if (!linhaInsumo.produtoId || !linhaInsumo.qtdBase) return total;
      const produto = produtos.find(
        (produto) => produto.id === linhaInsumo.produtoId
      );
      if (!produto) return total;
      return total + produto.custoMedio * linhaInsumo.qtdBase;
    }, 0);
  }, [linhasInsumos, produtos]);

  const precoUnitarioSugerido = useMemo(() => {
    const quantidadeUnidades = Number(unidadesProduzidas || 0);
    if (!quantidadeUnidades) return 0;

    const custoBasePorUnidade = custoTotalInsumos / quantidadeUnidades;
    const margemDecimal = Number(margemPercentual || 0) / 100;

    return +(custoBasePorUnidade * (1 + margemDecimal)).toFixed(2);
  }, [custoTotalInsumos, unidadesProduzidas, margemPercentual]);

  async function handleConfirmarProdutoFinal() {
    if (!nomeProdutoFinal.trim()) {
      toast.error("Informe o nome do produto final.");
      return;
    }
    const quantidadeUnidades = Number(unidadesProduzidas || 0);
    if (!quantidadeUnidades || quantidadeUnidades <= 0) {
      toast.error("Informe as unidades produzidas.");
      return;
    }

    const possuiUsoAcimaDoEstoque = linhasInsumos.some((linhaInsumo) => {
      if (!linhaInsumo.produtoId || !linhaInsumo.qtdBase) return false;
      const produto = produtos.find((produto) => produto.id === linhaInsumo.produtoId);
      if (!produto) return false;
      return linhaInsumo.qtdBase > produto.saldoBase;
    });

    if (possuiUsoAcimaDoEstoque) {
      toast.error("Você está utilizando mais insumos do que há em estoque. Verifique as quantidades.");
      return;
    }

    const nomeFinal = nomeProdutoFinal.trim();

    const produtoExistente = produtos.find(
      (produto) => produto.nome.toLowerCase() === nomeFinal.toLowerCase()
    );

    let produtoFinalId = produtoExistente?.id;

    if (!produtoExistente) {
      try {
        const responseCriarProdutoFinal = await fetch(`${apiUrl}/produtos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(usuario?.token ? { Authorization: `Bearer ${usuario.token}` } : {}),
          },
          body: JSON.stringify({
            nome: nomeFinal, unidadeBase: "UN", usuarioId: usuario.id, categoria: null,
          }),
        });

        if (responseCriarProdutoFinal.status !== 201) {
          const responseText = await responseCriarProdutoFinal.text();
          console.error("Erro ao criar produto final:", responseText);
          toast.error("Erro ao criar produto final.");
          return;
        }

        const produtoCriado = await responseCriarProdutoFinal.json();
        produtoFinalId = produtoCriado.id;
      } catch (error) {
        console.error(error);
        toast.error("Erro ao criar produto final no estoque.");
        return;
      }
    }

    const quantidadeNovasUnidades = quantidadeUnidades;
    const custoMedioUnitario = precoUnitarioSugerido;

    try {
      await fetch(`${apiUrl}/produtos/${produtoFinalId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(usuario?.token ? { Authorization: `Bearer ${usuario.token}` } : {}),
        },
        body: JSON.stringify({ saldoBase: quantidadeNovasUnidades, custoMedio: custoMedioUnitario, }),
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar o estoque do produto final.");
      return;
    }

    try {
      for (const linhaInsumo of linhasInsumos) {
        if (!linhaInsumo.produtoId || !linhaInsumo.qtdBase) continue;

        const produto = produtos.find((produto) => produto.id === linhaInsumo.produtoId);
        if (!produto) continue;

        const novoSaldoBase = Math.max(0, produto.saldoBase - linhaInsumo.qtdBase);

        await fetch(`${apiUrl}/produtos/${linhaInsumo.produtoId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(usuario?.token ? { Authorization: `Bearer ${usuario.token}` } : {}),
          },
          body: JSON.stringify({ saldoBase: novoSaldoBase, }),
        });
      }

      await carregarProdutos();

      toast.success("Produto final adicionado e insumos descontados do estoque!");
      setOpenModalProdutoFinal(false);
      setNomeProdutoFinal("");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao dar baixa nos insumos.");
    }
  }

  return (
    <>
      <Titulo />

      <section className="mt-[3rem] mb-[2rem] flex flex-row justify-center gap-[3rem]">
        <div className="w-[30rem] flex flex-col gap-[1.44rem]">
          <div className="flex flex-row items-center gap-[0.7rem]">
            <img src="/tabela.svg" className="w-[2rem] h-[2rem]" alt="" />
            <h2 className="text-[2rem] font-inter font-semibold">Estoque</h2>
          </div>

          <div className="bg-[#F5F5F5] px-[1.62rem] py-[1.93rem] rounded-[1rem] flex flex-col gap-[0.75rem]">
            {produtos.map((produto) => (
              <div key={produto.id} className="bg-[#E2E2E2] py-[0.875rem] px-[1.06rem] rounded-[0.9375rem] flex flex-row justify-between items-center">
                <p className="text-[#656565] font-inter text-[1rem]">{produto.nome}</p>
                <p className="text-[#303030] font-inter font-semibold">{produto.saldoDisplay} {produto.unidadeDisplay}</p>
                <p className="text-[#656565] font-inter">R$ {produto.precoMedioDisplay.toFixed(2)}/{produto.unidadeDisplay}</p>
                <button className="bg-[#F6DDA6] rounded-[0.46875rem] px-[1.06rem] py-[0.10rem] text-[#705519] font-inter text-[0.975rem] font-medium">-</button>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[32rem] flex flex-col gap-[1.44rem]">
          <div className="flex flex-row items-center gap-[0.7rem]">
            <img src="/tabela.svg" className="w-[2rem] h-[2rem]" alt="" />
            <h2 className="text-[2rem] font-inter font-semibold">Insumos</h2>
          </div>

          <div className="bg-[#F5F5F5] px-[1.62rem] py-[1.93rem] rounded-[1rem] flex flex-col gap-[0.75rem]">
            {linhasInsumos.map((linhaInsumo, linhaIndex) => {
              const produto = produtos.find((produto) => produto.id === linhaInsumo.produtoId);
              const unidadeProduto = produto?.unidadeBase ?? "UN";

              return (
                <div key={linhaIndex} className="flex flex-row items-center gap-[0.75rem]">
                  <select className="border-2 border-[#4A4B51] rounded-xl pl-3 w-[14rem] h-[2.5rem] bg-white outline-none" value={linhaInsumo.produtoId ?? ""}
                    onChange={(event) =>
                      atualizarLinhaInsumo(linhaIndex, {
                        produtoId: event.target.value === "" ? undefined : Number(event.target.value),
                      })
                    }>

                    <option value="">Selecione</option>
                    {produtos.map((produto) => (
                      <option key={produto.id} value={produto.id}>{produto.nome}</option>
                    ))}
                  </select>

                  <input className="border-2 border-[#4A4B51] rounded-xl pl-3 w-[9rem] h-[2.5rem] bg-white outline-none"
                    placeholder={unidadeProduto === "G" ? "500 (g)" : unidadeProduto === "ML" ? "500 (ml)" : "2 (un)"}
                    value={linhaInsumo.qtdInput ?? ""}
                    onChange={(event) =>
                      atualizarLinhaInsumo(linhaIndex, { qtdInput: event.target.value, })
                    } />

                  <button type="button" onClick={() => removerLinhaInsumo(linhaIndex)} className="text-[#D13B3B] font-inter font-semibold text-[0.95rem]">Remover</button>

                </div>
              );
            })}

            <button type="button" onClick={adicionarLinhaInsumo} className="text-white bg-[linear-gradient(139deg,_#114114_-40.56%,_#00C000_279.19%)] rounded-md px-6 my-3 py-2 text-[1rem] font-bold font-inter hover:opacity-90" >+ Adicionar insumo</button>

            <div className="flex flex-row gap-[0.75rem]">
              <input className="border-2 border-[#4A4B51] rounded-xl pl-3 w-[15rem] h-[2.5rem] bg-white outline-none"
                placeholder="Margem %"
                type="number"
                value={margemPercentual}
                onChange={(event) =>
                  setMargemPercentual(
                    event.target.value === "" ? "" : Number(event.target.value))} />

              <input className="border-2 border-[#4A4B51] rounded-xl pl-3 w-[15rem] h-[2.5rem] bg-white outline-none"
                placeholder="Unidades Produzidas"
                type="number"
                value={unidadesProduzidas}
                onChange={(event) =>
                  setUnidadesProduzidas(
                    event.target.value === "" ? "" : Number(event.target.value))} />
            </div>
            <div className="flex flex-col gap-[0.75rem] mt-3">
              <div className="flex flex-row justify-between font-inter text-[#656565] bg-[#E2E2E2] rounded-[0.9375rem] py-[0.875rem] px-[1.0625rem]">
                <h3>Custo Total:</h3>
                <p className="text-[#3a3a3a] font-medium">R$ {custoTotalInsumos.toFixed(2)}</p>
              </div>
              <div className="flex flex-row justify-between font-inter text-[#656565] bg-[#E2E2E2] rounded-[0.9375rem] py-[0.875rem] px-[1.0625rem]">
                <h3>Preço unitário com {margemPercentual}% de margem:</h3>
                <p className="text-[#3a3a3a] font-medium">R$ {precoUnitarioSugerido.toFixed(2)}</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpenModalProdutoFinal(true)} className="text-white bg-[linear-gradient(139deg,_#114114_-40.56%,_#00C000_279.19%)] rounded-md px-6 my-3 py-2 text-[1rem] font-bold font-inter hover:opacity-90">Acrescentar Produtos no Estoque</button>

          </div>
        </div>
      </section>

      <Modal open={openModalProdutoFinal} onClose={() => setOpenModalProdutoFinal(false)}>
        <div className="container flex flex-col gap-4 font-inter">
          <h2 className="text-[1.3rem] font-semibold">Nome do produto que será criado no estoque</h2>

          <input className="border-2 border-[#4A4B51] rounded-xl px-4 py-2 outline-none focus:border-[#407B6A]" placeholder="Ex: Panetone" value={nomeProdutoFinal} onChange={(event) => setNomeProdutoFinal(event.target.value)} />

          <div className="mt-4 flex gap-4 justify-end">
            <button type="button" onClick={() => setOpenModalProdutoFinal(false)} className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter">Cancelar</button>
            <button type="button" onClick={handleConfirmarProdutoFinal} className="text-white bg-[#308021] rounded-md px-6 py-2 text-[1rem] font-bold font-inter hover:opacity-90">Confirmar</button>
          </div>
        </div>
      </Modal>
    </>
  );
}