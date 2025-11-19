import { useEffect, useMemo, useState } from "react";
import Titulo from "./components/Titulo.js";
import Modal from "./components/Modal.js";
import EstoqueItem from "./components/EstoqueItem.js";
import { useUsuarioStore } from "./context/UsuarioContext.js";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import ItensEditor from "./components/ItensEditor.js";
import type { ItemLinha, ProdutoOption } from "./components/ItensEditor.js";
import { parseQuantidade } from "./components/units.js";
import type { Unidade } from "./components/units.js";

const apiUrl = import.meta.env.VITE_API_URL;

const CATEGORIAS = [
  "ALIMENTOS",
  "BEBIDAS",
  "CUIDADOS_PESSOAIS",
  "LIMPEZA",
  "OUTROS",
] as const;

type Categoria = (typeof CATEGORIAS)[number];

type InputsAdicionarCabecalho = {
  data?: string;
  anexo?: string;
  categoria?: Categoria | "";
};

type InputsProdutoRapido = {
  nome: string;
  unidadeBase: Unidade;
  usuarioId: string | undefined;
  categoria?: Categoria | null;
};

export default function Estoque() {
  const { usuario } = useUsuarioStore();
  const [openAdicionarProduto, setOpenAdicionarProduto] = useState(false);

  const [catalogo, setCatalogo] = useState<any[]>([]);

  const [filtroCategoria, setFiltroCategoria] = useState<Categoria | "">("");
  const [filtroNome, setFiltroNome] = useState<string>("");

  const [itens, setItens] = useState<ItemLinha[]>([]);

  const { register, handleSubmit, reset, watch } =
    useForm<InputsAdicionarCabecalho>();
  const categoriaCabecalho = watch("categoria");

  async function getProdutos() {
    try {
      const response = await fetch(`${apiUrl}/produtos/${usuario.id}`, {
        headers: usuario?.token
          ? { Authorization: `Bearer ${usuario.token}` }
          : {},
      });
      const dados = await response.json();

      const mapped: any[] = (dados || []).map((p: any) => ({
        id: p.id,
        nome: p.nome,
        unidadeBase: p.unidadeBase as Unidade,

        custoMedio: Number(p.custoMedio ?? 0),
        saldoBase: Number(p.saldoBase ?? 0),
        margemPadrao: p.margemPadrao ? Number(p.margemPadrao) : undefined,
        categoria: p.categoria ?? null,
        anexo: p.anexo ?? null,
        data: null,

        precoMedioDisplay: Number(p.precoMedioDisplay ?? 0),
        unidadeDisplay:
          p.unidadeDisplay ??
          (p.unidadeBase === "G"
            ? "kg"
            : p.unidadeBase === "ML"
            ? "L"
            : "un"),
        saldoDisplay: Number(p.saldoDisplay ?? 0),

        // NOVO: mapeia flag ativo (caso backend ainda não filtre)
        ativo: typeof p.ativo === "boolean" ? p.ativo : true,
      }));

      // só mantém ativos
      setCatalogo(mapped.filter((p) => p.ativo !== false));
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível carregar produtos.");
    }
  }

  useEffect(() => {
    getProdutos();
  }, [openAdicionarProduto]);

  const total = useMemo(
    () => itens.reduce((s, i) => s + (Number(i.subtotal) || 0), 0),
    [itens]
  );

  const catalogoFiltrado = useMemo(() => {
    let base = catalogo;

    if (filtroCategoria) {
      base = base.filter((p) => p.categoria === filtroCategoria);
    }
    if (filtroNome.trim().length > 0) {
      const q = filtroNome.trim().toLowerCase();
      base = base.filter((p) =>
        String(p.nome ?? "").toLowerCase().includes(q)
      );
    }
    return base;
  }, [catalogo, filtroCategoria, filtroNome]);

  function calcularBasesDoItem(i: ItemLinha) {
    const unid: Unidade = i.unidadeSelecionada ?? "UN";
    const qtdConteudoBase = parseQuantidade(i.qtdConteudoInput ?? "0", unid);
    const qtdComprada = Number(i.quantidadeComprada ?? 0);
    const subtotal =
      Number(
        i.subtotal ?? Number(i.custoUnitario ?? 0) * (qtdComprada || 0)
      ) || 0;

    const qtdBase =
      i.qtdTotalBase ?? Math.max(0, qtdConteudoBase * (qtdComprada || 0));
    const custoUnitBase =
      i.custoUnitBase ?? (qtdBase > 0 ? +(subtotal / qtdBase).toFixed(6) : 0);

    return { qtdBase, custoUnitBase, subtotal };
  }

  async function adicionarProduto(
    nome: string,
    unidadeBase: Unidade
  ): Promise<ProdutoOption> {
    const payload: InputsProdutoRapido = {
      nome,
      unidadeBase,
      usuarioId: usuario?.id,
      categoria: (categoriaCabecalho as Categoria) || null,
    };

    const resp = await fetch(`${apiUrl}/produtos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(usuario?.token
          ? { Authorization: `Bearer ${usuario.token}` }
          : {}),
      },
      body: JSON.stringify(payload),
    });

    if (resp.status !== 201) {
      const t = await resp.text();
      console.error("Erro ao criar produto:", resp.status, t);
      toast.error("Erro ao criar produto.");
      throw new Error("Criar produto falhou");
    }

    const criado = await resp.json();

    const novo: any = {
      id: criado.id,
      nome: criado.nome,
      unidadeBase: criado.unidadeBase as Unidade,
      custoMedio: Number(criado.custoMedio ?? 0),
      saldoBase: Number(criado.saldoBase ?? 0),
      margemPadrao: criado.margemPadrao
        ? Number(criado.margemPadrao)
        : undefined,
      categoria: criado.categoria ?? null,
      anexo: criado.anexo ?? null,
      data: null,
      precoMedioDisplay: Number(criado.precoMedioDisplay ?? 0),
      unidadeDisplay:
        criado.unidadeDisplay ??
        (criado.unidadeBase === "G"
          ? "kg"
          : criado.unidadeBase === "ML"
          ? "L"
          : "un"),
      saldoDisplay: Number(criado.saldoDisplay ?? 0),
      ativo: typeof criado.ativo === "boolean" ? criado.ativo : true,
    };

    setCatalogo((prev) => [...prev, novo]);
    toast.success("Produto criado!");
    return novo as ProdutoOption;
  }

  // === LISTA PARA O <ItensEditor /> ===
  const produtosParaSelect: ProdutoOption[] = useMemo(
    () =>
      catalogo.map((p: any) => ({
        id: p.id,
        nome: p.nome,
        unidadeBase: p.unidadeBase as Unidade,
        custoMedio: p.custoMedio,
        margemPadrao: p.margemPadrao,
      })),
    [catalogo]
  );

  async function cadastrarProdutoRapido(
    nome: string,
    unidade: Unidade
  ): Promise<ProdutoOption> {
    return adicionarProduto(nome, unidade);
  }

  async function confirmarEntrada(cab: InputsAdicionarCabecalho) {
    if (!itens.length) {
      toast.error("Adicione pelo menos um item.");
      return;
    }

    try {
      const catalogoAtual = [...catalogo];

      for (const i of itens) {
        if (!i.produtoId) continue;

        const { qtdBase, subtotal } = calcularBasesDoItem(i);

        const p = catalogoAtual.find((c) => c.id === i.produtoId);
        const saldoAtual = Number(p?.saldoBase ?? 0);
        const custoAtual = Number(p?.custoMedio ?? 0);

        const novoSaldo = +(saldoAtual + qtdBase).toFixed(6);
        const novoCusto =
          novoSaldo > 0
            ? +(((saldoAtual * custoAtual) + subtotal) / novoSaldo).toFixed(6)
            : 0;

        const body: any = {
          saldoBase: novoSaldo,
          custoMedio: novoCusto,
        };

        if (cab.categoria && cab.categoria.length > 0) {
          body.categoria = cab.categoria;
        }
        if (cab.anexo && cab.anexo.trim().length > 0) {
          body.anexo = cab.anexo.trim();
        }
        if (cab.data && cab.data.length > 0) {
          body.data = cab.data;
        }

        const put = await fetch(`${apiUrl}/produtos/${i.produtoId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(usuario?.token
              ? { Authorization: `Bearer ${usuario.token}` }
              : {}),
          },
          body: JSON.stringify(body),
        });

        if (!put.ok) {
          const t = await put.text();
          console.error("PUT produto falhou:", put.status, t);
          toast.error("Falha ao atualizar um dos produtos.");
        }
      }

      toast.success("Estoque atualizado!");
      setItens([]);
      reset();
      setOpenAdicionarProduto(false);
      getProdutos();
    } catch (e) {
      console.error(e);
      toast.error("Erro ao atualizar estoque.");
    }
  }

  const listaProdutos = catalogoFiltrado.map((produto: any) => (
    <EstoqueItem
      key={produto.id}
      produto={produto}
      produtos={catalogoFiltrado as any}
      setProdutos={setCatalogo as any}
    />
  ));

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
              onClick={() => {
                setItens([]);
                setOpenAdicionarProduto(true);
              }}
              className="flex text-white items-center justify-center rounded-[0.5rem] bg-[linear-gradient(139deg,_#114114_-40.56%,_#00C000_279.19%)] w-[12rem] h-[2.7rem] text-[1.25rem] font-roboto font-normal"
            >
              Adicionar
            </button>
          </div>

          <div className="bg-[#F5F5F5] px-[1.62rem] py-[1.93rem] rounded-[1rem] flex flex-col gap-[1.44rem]">
            <div className="flex flex-row gap-[1.25rem] items-center">
              <div className="relative">
                <label className="absolute font-inter -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.6875rem] font-semibold tracking-wide">
                  NOME
                </label>
                <input
                  type="text"
                  value={filtroNome}
                  onChange={(e) => setFiltroNome(e.target.value)}
                  placeholder="Filtrar por nome"
                  className="border-2 border-[#4A4B51] rounded-xl font-inter pl-4 w-[18rem] bg-[#F5F5F5] h-[2.75rem] placeholder:text-[1rem] placeholder:font-normal placeholder:text-[#828386] text-[#4A4B51] text-lg font-medium outline-none focus:border-[#407B6A] transition-colors"
                />
              </div>
              <div className="relative">
                <label className="absolute font-inter -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.6875rem] font-semibold tracking-wide">
                  CATEGORIA
                </label>
                <select
                  value={filtroCategoria}
                  onChange={(e) =>
                    setFiltroCategoria(e.target.value as Categoria | "")
                  }
                  className="border-2 border-[#4A4B51] rounded-xl font-inter pl-4 pr-8 w-[16rem] h-[2.75rem] bg-[#F5F5F5] outline-none focus:border-[#407B6A]"
                >
                  <option value="">Todas</option>
                  {CATEGORIAS.map((c) => (
                    <option key={c} value={c}>
                      {c.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-row justify-between font-inter text-[1rem] font-normal mt-4">
              <h2>Nome</h2>
              <h2 className="relative left-[1.8rem]">Quantidade</h2>
              <h2 className="relative left-[2.4rem]">Preço Médio</h2>
              <h2 className="relative left-[3.5rem]">Categoria</h2>
              <h2 className="relative left-[3.3rem]">Anexo</h2>
              <h2>Opções</h2>
            </div>

            {listaProdutos}
          </div>
        </div>
      </section>

      <Modal
        open={openAdicionarProduto}
        onClose={() => setOpenAdicionarProduto(false)}
      >
        <form
          className="container w-[44rem]"
          onSubmit={handleSubmit(confirmarEntrada)}
        >
          <div className="flex items-center gap-2">
            <img src="/tabela.svg" className="w-[1.5rem] h-[1.5rem]" alt="" />
            <h2 className="text-[1.4rem] font-inter font-semibold">
              Adicionar ao Estoque
            </h2>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6">


            <div className="relative">
              <label className="absolute -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold">
                ANEXO (NF)
              </label>
              <input
                type="url"
                {...register("anexo")}
                placeholder="Link da NF"
                className="w-full border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold">
                CATEGORIA
              </label>
              <select
                {...register("categoria")}
                className="w-full border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]"
                defaultValue=""
              >
                <option value="">Sem categoria</option>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {c.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-inter font-semibold mb-2">Itens comprados</h3>

            <ItensEditor
              modo="compra"
              itens={itens}
              produtos={produtosParaSelect}
              onChange={setItens}
              onCadastrarProdutoRapido={cadastrarProdutoRapido}
            />

            <div className="mt-4 flex justify-end font-inter">
              <div>
                <div className="text-sm text-[#4A4B51]">Total</div>
                <div className="text-lg font-semibold">
                  R$ {total.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              type="button"
              onClick={() => setOpenAdicionarProduto(false)}
              className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="text-white bg-[#308021] rounded-md px-6 py-2 text-[1rem] font-bold font-inter hover:opacity-90"
            >
              Confirmar
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
