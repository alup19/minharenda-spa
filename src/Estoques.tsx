import { useEffect, useMemo, useState } from "react";
import Titulo from "./components/Titulo.js";
import Modal from "./components/Modal.js";
import EstoqueItem from "./components/EstoqueItem.js";
import { useUsuarioStore } from "./context/UsuarioContext.js";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import ItensEditor from "./components/ItensEditor.js";
import type { ItemLinha } from "./components/ItensEditor.js";
import { parseQuantidade } from "./components/units.js";
import type { Unidade } from "./components/units.js";

const apiUrl = import.meta.env.VITE_API_URL

type InputsProdutos = {
  nome: string
  unidadeBase: string
  categoria: string
  margemPadrao: number
  saldoBase: number
  custoMedio: number
  anexo: String
  data: Date
  createdAt: Date
  usuarioId: string
}

type InputsProduto = {
  nome: string
  unidadeBase: string
}

export default function Estoque() {
  const { usuario } = useUsuarioStore()
  const [openAdicionarProduto, setOpenAdicionarProduto] = useState(false);
  const [produtos, setProdutos] = useState<any[]>([]);
  const { register, handleSubmit, reset, setFocus } = useForm<Inputs>()

  async function getProdutos() {
    const response = await fetch(`${apiUrl}/produtos`)
    const dados = await response.json()
    setProdutos(dados)
  }

  useEffect(() => {
    getProdutos()
  }, [openAdicionarProduto, setFocus("nome")]);

  const total = useMemo(
    () => produtos.reduce((s, i) => s + (Number(i.subtotal) || 0), 0),
    [produtos]
  )

  function calcularBasesDoItem(i: ItemLinha) {
    const unid: Unidade = i.unidadeSelecionada ?? "UN"
    const qtdConteudoBase = parseQuantidade(i.qtdConteudoInput ?? "0", unid)
    const qtdComprada = Number(i.quantidadeComprada ?? 0)
    const subtotal =
      Number(i.subtotal ?? (Number(i.custoUnitario ?? 0) * (qtdComprada || 0))) || 0

    const qtdBase =
      i.qtdTotalBase ?? Math.max(0, qtdConteudoBase * (qtdComprada || 0))
    const custoUnitBase =
      i.custoUnitBase ?? (qtdBase > 0 ? +(subtotal / qtdBase).toFixed(6) : 0)

    return { qtdBase, custoUnitBase, subtotal }
  }

  async function adicionarProdutos(data: InputsProdutos) {

    // const payloadProdutos: Inputs = {
    //   categoria: data.categoria,
    //   anexo: data.,
    //   total,
    //   itens: produtos.map((i) => {
    //     const { qtdBase, custoUnitBase, subtotal } = calcularBasesDoItem(i)
    //     return {
    //       produtoId: i.produtoId!,
    //       qtdBase,
    //       custoUnit: custoUnitBase,
    //       subtotal,
    //     }
    //   }),
    // }

    try {
      const produto = await fetch(`${apiUrl}/produtos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${usuario.token}`,
        },
        body: JSON.stringify(payloadProduto),
      });

      if (produto.status === 201) {
        toast.success("Produtos criado com sucesso!");
        reset();
        setOpenAdicionarProduto(false);
        getProdutos();
      } else {
        console.log(payloadProduto)
        toast.error("Erro ao criar produtos.");
      }
    } catch (error) {
      console.error(error);
      console.log(payloadProduto)
      toast.error("Erro ao criar produtos.");
    }
  }


  async function adicionarProduto(data: InputsProduto) {

    const payloadProduto: InputsProduto = {
      nome: data.nome,
      unidadeBase: data.unidadeBase
    }

    try {
      const produto = await fetch(`${apiUrl}/produtos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${usuario.token}`,
        },
        body: JSON.stringify(payloadProduto),
      });

      if (produto.status === 201) {
        toast.success("Produtos criado com sucesso!");
        reset();
        getProdutos();
      } else {
        console.log(payloadProduto)
        toast.error("Erro ao criar produtos.");
      }
    } catch (error) {
      console.error(error);
      console.log(payloadProduto)
      toast.error("Erro ao criar produtos.");
    }
    setProdutos(produtos);
  }

  const listaProdutos = produtos.map((produto: any) => (
    <EstoqueItem
      key={produto.id}
      produto={produto}
      produtos={produtos}
      setProdutos={setProdutos}
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
              onClick={() => setOpenAdicionarProduto(true)}
              className="flex text-white items-center justify-center rounded-[0.5rem] bg-[linear-gradient(139deg,_#114114_-40.56%,_#00C000_279.19%)] w-[12rem] h-[2.7rem] text-[1.25rem] font-roboto font-normal"
            >
              Adicionar
            </button>
          </div>

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

            <div className="flex flex-row justify-between font-inter text-[1rem] font-normal mt-4">
              <h2>Nome</h2>
              <h2 className="relative left-[1.8rem]">Quantidade</h2>
              <h2 className="relative left-[2.4rem]">Valor/Kg</h2>
              <h2 className="relative left-[3.5rem]">Categoria</h2>
              <h2 className="relative left-[3.3rem]">Anexo</h2>
              <h2>Opções</h2>
            </div>
            {listaProdutos}
          </div>
        </div>
      </section>

      <Modal open={openAdicionarProduto} onClose={() => setOpenAdicionarProduto(false)}>
        <div className="container w-[44rem]">
          <div className="flex items-center gap-2">
            <img src="/tabela.svg" className="w-[1.5rem] h-[1.5rem]" alt="" />
            <h2 className="text-[1.4rem] font-inter font-semibold">
              Adicionar ao Estoque
            </h2>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="relative">
              <label className="absolute -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold">
                DATA
              </label>
              <input
                type="date"
                {...register("data")}
                className="w-full border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold">
                ANEXO (NF)
              </label>
              <input
                type="url"
                {...register("anexo")}
                placeholder="Link / upload"
                className="w-full border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold">
                CATEGORIA
              </label>
              <input
                placeholder="Compras"
                {...register("categoria")}
                className="w-full border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]"
              />
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-inter font-semibold mb-2">Itens comprados</h3>

            <ItensEditor
              itens={produtos}
              produtos={produtos}
              onChange={setProdutos}
              onCadastrarProdutoRapido={adicionarProduto}
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
              onClick={() => setOpenAdicionarProduto(false)}
              className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter"
            >
              Cancelar
            </button>
            <button
              type="button"
              className="text-white bg-[#308021] rounded-md px-6 py-2 text-[1rem] font-bold font-inter hover:opacity-90"
            // onClick={adicionarProdutos}
            >
              Confirmar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
