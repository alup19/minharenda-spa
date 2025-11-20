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
      const responseProdutos = await fetch(`${apiUrl}/produtos/${usuario.id}`, {
        headers: usuario?.token ? { Authorization: `Bearer ${usuario.token}` } : {},
      });
      const dataProdutos = await responseProdutos.json();

      const produtosMapeados: any[] = (dataProdutos || []).map(
        (produto: any) => ({
          id: produto.id,
          nome: produto.nome,
          unidadeBase: produto.unidadeBase as Unidade,

          custoMedio: Number(produto.custoMedio ?? 0),
          saldoBase: Number(produto.saldoBase ?? 0),
          margemPadrao: produto.margemPadrao ? Number(produto.margemPadrao) : undefined,
          categoria: produto.categoria ?? null,
          anexo: produto.anexo ?? null,
          data: null,

          precoMedioDisplay: Number(produto.precoMedioDisplay ?? 0),
          unidadeDisplay: produto.unidadeDisplay ?? (produto.unidadeBase === "G" ? "kg" : produto.unidadeBase === "ML" ? "L" : "un"),
          saldoDisplay: Number(produto.saldoDisplay ?? 0),

          ativo: typeof produto.ativo === "boolean" ? produto.ativo : true,
        })
      );

      setCatalogo(produtosMapeados.filter((produto) => produto.ativo !== false));
    } catch (error) {
      toast.error("Não foi possível carregar produtos.");
    }
  }

  useEffect(() => {
    getProdutos();
  }, [openAdicionarProduto]);

  const total = useMemo(
    () => itens.reduce((soma, item) => soma + (Number(item.subtotal) || 0), 0), [itens]
  );

  const catalogoFiltrado = useMemo(() => {
    let base = catalogo;

    if (filtroCategoria) {
      base = base.filter((produto) => produto.categoria === filtroCategoria);
    }

    if (filtroNome.trim().length > 0) {
      const termoBusca = filtroNome.trim().toLowerCase();
      base = base.filter((produto) => String(produto.nome ?? "").toLowerCase().includes(termoBusca));
    }
    return base;
  }, [catalogo, filtroCategoria, filtroNome]);

  function calcularBasesDoItem(item: ItemLinha) {
    const unidadeItem: Unidade = item.unidadeSelecionada ?? "UN";
    const quantidadeConteudoBase = parseQuantidade(item.qtdConteudoInput ?? "0", unidadeItem);
    const quantidadeComprada = Number(item.quantidadeComprada ?? 0);
    const subtotal = Number(item.subtotal ?? Number(item.custoUnitario ?? 0) * (quantidadeComprada || 0)) || 0;

    const quantidadeBase = item.qtdTotalBase ?? Math.max(0, quantidadeConteudoBase * (quantidadeComprada || 0));
    const custoUnitarioBase = item.custoUnitBase ?? (quantidadeBase > 0 ? +(subtotal / quantidadeBase).toFixed(6) : 0);

    return { qtdBase: quantidadeBase, custoUnitBase: custoUnitarioBase, subtotal };
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

    const responseCreateProduct = await fetch(`${apiUrl}/produtos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(usuario?.token ? { Authorization: `Bearer ${usuario.token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (responseCreateProduct.status !== 201) {
      toast.error("Erro ao criar produto.");
      throw new Error("Criar produto falhou");
    }

    const produtoCriado = await responseCreateProduct.json();

    const novoProduto: any = {
      id: produtoCriado.id,
      nome: produtoCriado.nome,
      unidadeBase: produtoCriado.unidadeBase as Unidade,
      custoMedio: Number(produtoCriado.custoMedio ?? 0),
      saldoBase: Number(produtoCriado.saldoBase ?? 0),
      margemPadrao: produtoCriado.margemPadrao ? Number(produtoCriado.margemPadrao) : undefined,
      categoria: produtoCriado.categoria ?? null,
      anexo: produtoCriado.anexo ?? null,
      data: null,
      precoMedioDisplay: Number(produtoCriado.precoMedioDisplay ?? 0),
      unidadeDisplay:
        produtoCriado.unidadeDisplay ??
        (produtoCriado.unidadeBase === "G" ? "kg" : produtoCriado.unidadeBase === "ML" ? "L" : "un"),

      saldoDisplay: Number(produtoCriado.saldoDisplay ?? 0),
      ativo: typeof produtoCriado.ativo === "boolean" ? produtoCriado.ativo : true,
    };

    setCatalogo((catalogoAnterior) => [...catalogoAnterior, novoProduto]);
    toast.success("Produto criado!");
    return novoProduto as ProdutoOption;
  }

  const produtosParaSelect: ProdutoOption[] = useMemo(
    () =>
      catalogo.map((produto: any) => ({
        id: produto.id,
        nome: produto.nome,
        unidadeBase: produto.unidadeBase as Unidade,
        custoMedio: produto.custoMedio,
        margemPadrao: produto.margemPadrao,
      })),
    [catalogo]
  );

  async function cadastrarProdutoRapido(
    nome: string,
    unidade: Unidade
  ): Promise<ProdutoOption> {
    return adicionarProduto(nome, unidade);
  }

  async function confirmarEntrada(cabecalho: InputsAdicionarCabecalho) {
    if (!itens.length) {
      toast.error("Adicione pelo menos um item.");
      return;
    }

    try {
      const catalogoAtual = [...catalogo];

      for (const item of itens) {
        if (!item.produtoId) continue;

        const { qtdBase, subtotal } = calcularBasesDoItem(item);

        const produtoAtual = catalogoAtual.find((produto) => produto.id === item.produtoId);
        const saldoAtual = Number(produtoAtual?.saldoBase ?? 0);
        const custoAtual = Number(produtoAtual?.custoMedio ?? 0);

        const novoSaldo = +(saldoAtual + qtdBase).toFixed(6);
        const novoCusto = novoSaldo > 0 ? +(((saldoAtual * custoAtual) + subtotal) / novoSaldo).toFixed(6) : 0;

        const body: any = {
          saldoBase: novoSaldo,
          custoMedio: novoCusto,
        };

        if (cabecalho.categoria && cabecalho.categoria.length > 0) {
          body.categoria = cabecalho.categoria;
        }
        if (cabecalho.anexo && cabecalho.anexo.trim().length > 0) {
          body.anexo = cabecalho.anexo.trim();
        }
        if (cabecalho.data && cabecalho.data.length > 0) {
          body.data = cabecalho.data;
        }

        const responseUpdateProduct = await fetch(
          `${apiUrl}/produtos/${item.produtoId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...(usuario?.token ? { Authorization: `Bearer ${usuario.token}` } : {}),
            },
            body: JSON.stringify(body),
          }
        );

        if (!responseUpdateProduct.ok) {
          toast.error("Falha ao atualizar um dos produtos.");
        }
      }

      toast.success("Estoque atualizado!");
      setItens([]);
      reset();
      setOpenAdicionarProduto(false);
      getProdutos();
    } catch (error) {
      toast.error("Erro ao atualizar estoque.");
    }
  }

  const listaProdutos = catalogoFiltrado.map((produto: any) => (
    <EstoqueItem key={produto.id} produto={produto} produtos={catalogoFiltrado as any} setProdutos={setCatalogo as any}/>
  ));

  return (
    <>
      <Titulo />
      <section className="mt-[3rem] mb-[2rem] flex flex-col justify-center items-center">
        <div className="w-[85.6875rem] flex flex-col gap-[1.44rem]">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-[0.7rem] justify-center">
              <img src="/tabela.svg" className="w-[2rem] h-[2rem]" alt="" />
              <h2 className="text-center text-[2rem] font-inter font-semibold">Estoque</h2>
            </div>
            <button onClick={() => { setItens([]); setOpenAdicionarProduto(true); }} className="flex text-white items-center justify-center rounded-[0.5rem] bg-[linear-gradient(139deg,_#114114_-40.56%,_#00C000_279.19%)] w-[12rem] h-[2.7rem] text-[1.25rem] font-roboto font-normal">Adicionar</button>
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
                  onChange={(event) => setFiltroNome(event.target.value)}
                  placeholder="Filtrar por nome"
                  className="border-2 border-[#4A4B51] rounded-xl font-inter pl-4 w-[18rem] bg-[#F5F5F5] h-[2.75rem] placeholder:text-[1rem] placeholder:font-normal placeholder:text-[#828386] text-[#4A4B51] text-lg font-medium outline-none focus:border-[#407B6A] transition-colors"/>
              </div>
              <div className="relative">
                <label className="absolute font-inter -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.6875rem] font-semibold tracking-wide">
                  CATEGORIA
                </label>
                <select value={filtroCategoria} onChange={(event) => setFiltroCategoria(event.target.value as Categoria | "")} className="border-2 border-[#4A4B51] rounded-xl font-inter pl-4 pr-8 w-[16rem] h-[2.75rem] bg-[#F5F5F5] outline-none focus:border-[#407B6A]">
                  <option value="">Todas</option>
                  {CATEGORIAS.map((categoria) => (
                    <option key={categoria} value={categoria}>{categoria.replaceAll("_", " ")}</option>
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

      <Modal open={openAdicionarProduto} onClose={() => setOpenAdicionarProduto(false)}>
        <form className="container w-[44rem]" onSubmit={handleSubmit(confirmarEntrada)}>
          <div className="flex items-center gap-2">
            <img src="/tabela.svg" className="w-[1.5rem] h-[1.5rem]" alt="" />
            <h2 className="text-[1.4rem] font-inter font-semibold">Adicionar ao Estoque</h2>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="relative">
              <label className="absolute -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold">
                ANEXO (NF)
              </label>
              <input type="url" {...register("anexo")} placeholder="Link da NF" className="w-full border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]"/>
            </div>

            <div className="relative">
              <label className="absolute -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold">
                CATEGORIA
              </label>
              <select {...register("categoria")} className="w-full border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]" defaultValue="">
                <option value="">Sem categoria</option>
                {CATEGORIAS.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-inter font-semibold mb-2">Itens comprados</h3>

            <ItensEditor modo="compra" itens={itens} produtos={produtosParaSelect} onChange={setItens} onCadastrarProdutoRapido={cadastrarProdutoRapido}/>

            <div className="mt-4 flex justify-end font-inter">
              <div>
                <div className="text-sm text-[#4A4B51]">Total</div>
                <div className="text-lg font-semibold">R$ {total.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button type="button" onClick={() => setOpenAdicionarProduto(false)} className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter" >Cancelar</button>
            <button type="submit" className="text-white bg-[#308021] rounded-md px-6 py-2 text-[1rem] font-bold font-inter hover:opacity-90">Confirmar</button>
          </div>
        </form>
      </Modal>
    </>
  );
}