import { toast } from 'sonner'
import type { ReceitaType } from "../utils/ReceitaType";
import { useUsuarioStore } from '../context/UsuarioContext';
import Modal from "./Modal";
import { useState } from "react";
import { useForm } from 'react-hook-form';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

// CATEGORIAS DE RECEITA
const CATEGORIAS_RECEITA = [
  "Não definido",
  "Venda",
  "Empréstimos",
  "Investimentos",
  "Outras receitas",
  "Salário",
] as const;

interface listaReceitaProps {
  receita: ReceitaType & {
    itens?: {
      id: number;
      qtdBase: number | string;
      produto?: { id: number; nome: string; unidadeBase?: string };
    }[];
  };
  receitas: ReceitaType[];
  setReceitas: React.Dispatch<React.SetStateAction<ReceitaType[]>>;
  clientes: { id: number; nome: string }[];
}

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
  descricao: string
  valor: number
  data: string
  clienteId?: number
  categoria: string
}

export default function ReceitaItem({ receita, receitas, setReceitas, clientes }: listaReceitaProps) {
  const { usuario } = useUsuarioStore()
  const [openAlterarDados, setOpenAlterarDados] = useState(false)
  const [openExcluirReceita, setOpenExcluirReceita] = useState(false)
  const [openItens, setOpenItens] = useState(false)

  const { register, handleSubmit, reset } = useForm<Inputs>()

  function abrirModalAlterar() {
    const dataRef: any = (receita as any).data ?? (receita as any).createdAt;
    const iso = dataRef ? new Date(dataRef).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);

    reset({
      descricao: receita.descricao ?? "",
      valor: Number(receita.valor ?? 0),
      data: iso,
      clienteId: (receita as any).clienteId ?? receita.cliente?.id ?? undefined,
      categoria: (receita as any).categoria ?? "Não definido",
    });

    setOpenAlterarDados(true);
  }

  async function atualizarReceita(data: Inputs) {
    const categoriaNormalizada =
      !data.categoria || data.categoria.trim() === ""
        ? "Não definido"
        : data.categoria;

    const payload = {
      descricao: data.descricao,
      valor: Number(data.valor),
      categoria: categoriaNormalizada,
      anexo: (receita as any).anexo ?? undefined,
      data: data.data,
      usuarioId: usuario.id,
      clienteId: data.clienteId ? Number(data.clienteId) : null,
    }

    const response = await fetch(`${apiUrl}/receitas/${receita.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", "Authorization": `Bearer ${usuario.token}`
      },
      body: JSON.stringify(payload)
    })

    if (response.status === 200) {
      const atualizado = await response.json()

      setReceitas((receitasAnteriores) =>
        receitasAnteriores.map((receitaLista: any) =>
          receitaLista.id === receita.id ? { ...receitaLista, ...atualizado } : receitaLista
        )
      )

      toast.success("Receita atualizada com sucesso!")
      setOpenAlterarDados(false)
    } else {
      console.log(payload)
      toast.error("Erro... Não foi possível atualizar esta receita")
    }
  }

  async function excluirReceita() {
    const response = await fetch(`${apiUrl}/receitas/${receita.id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json", Authorization: `Bearer ${usuario.token}`,
      },
    });

    if (response.ok) {
      const receitas2 = receitas.filter((x) => x.id !== receita.id);
      setReceitas(receitas2);
      setOpenExcluirReceita(false);
      toast.success("Receita excluída com sucesso");
    } else {
      setOpenExcluirReceita(false);
      toast.error("Erro... Receita não foi excluída");
    }
  }

  function dataDMA(data: string | Date | null | undefined) {
    if (!data) {
      return "Data inválida"
    }

    const dataReceita = new Date(data)
    if (Number.isNaN(dataReceita.getTime())) return "Data inválida"

    const dia = String(dataReceita.getDate()).padStart(2, "0")
    const mes = String(dataReceita.getMonth() + 1).padStart(2, "0")
    const ano = dataReceita.getFullYear()
    return `${dia}/${mes}/${ano}`
  }

  const dataRef: any = (receita as any).data ?? (receita as any).createdAt;
  const itens = (receita as any).itens ?? [];
  const valorNumero = Number(receita.valor ?? 0);
  const categoria =
    (receita as any).categoria && (receita as any).categoria.trim() !== ""
      ? (receita as any).categoria
      : "Não definido";

  return (
    <section>
      <div key={receita.id} className='flex flex-col gap-[0.44rem]'>
        {/* LINHA PRINCIPAL EM GRID */}
        <div className='bg-[#E2E2E2] py-[0.875rem] px-[1.06rem] rounded-[0.9375rem] grid grid-cols-6 items-center gap-2'>
          {/* Data */}
          <p className='text-[#656565] font-inter font-normal text-[1rem]'>
            {dataDMA(dataRef)}
          </p>

          {/* Valor */}
          <p className='text-[#303030] font-inter font-semibold text-center'>
            R$ {valorNumero.toLocaleString("pt-br", { minimumFractionDigits: 2 })}
          </p>

          {/* Cliente */}
          <p className='text-[#656565] font-inter font-normal text-center'>
            {receita.cliente?.nome ?? "Sem cliente"}
          </p>

          {/* Categoria */}
          <p className='text-[#705519] font-inter text-[0.975rem] font-medium bg-[#F6DDA6] py-[0.10rem] px-[1.06rem] rounded-[0.46875rem] text-center'>
            {categoria}
          </p>

          {/* Itens Vendidos */}
          <button
            type="button"
            onClick={() => setOpenItens(true)}
            className="flex items-center justify-center"
            title={itens.length ? "Ver itens vendidos" : "Nenhum item vinculado"}
          >
            <img src="/attachment.svg" alt="Itens vendidos" />
          </button>

          {/* Opções */}
          <div className="flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button">
                  <img src="/options.svg" alt="Opções" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="font-inter">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={abrirModalAlterar}>Alterar Dados</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setOpenExcluirReceita(true)}
                  className="text-[#c02424]"
                >
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* MODAL ITENS */}
      <Modal open={openItens} onClose={() => setOpenItens(false)}>
        <div className="container">
          <div className="container flex flex-col items-start">
            <div className="flex flex-row items-center gap-[0.7rem] justify-center">
              <img src="/tabela.svg" className="w-[1.5rem] h-[1.5rem]" alt="" />
              <h2 className="text-center text-[1.4rem] font-inter font-semibold">Itens vendidos</h2>
            </div>
          </div>

          <div className="mt-6">
            {!itens || itens.length === 0 ? (
              <p className="font-inter text-[#4A4B51]">Nenhum item vinculado a esta receita.</p>
            ) : (
              <div className="font-inter text-sm">
                <div className="grid grid-cols-5 gap-2 font-semibold mb-2">
                  <span>Produto</span>
                  <span>Quantidade</span>
                  <span>Unidades</span>
                  <span>Valor Unitário</span>
                  <span>Valor Total</span>
                </div>

                {itens.map((it: any) => {
                  const quantidadeBase = Number(it.qtdBase ?? 0);
                  const valorTotal = Number(
                    it.subtotal ??
                    (it.precoUnit && it.qtdBase
                      ? Number(it.precoUnit) * Number(it.qtdBase)
                      : 0)
                  );
                  const valorUnitario = quantidadeBase > 0 ? valorTotal / quantidadeBase : 0;

                  return (
                    <div key={it.id} className="grid grid-cols-5 gap-2 py-1 border-b border-[#E2E2E2]">
                      <span>{it.produto?.nome ?? `ID ${it.produtoId}`}</span>
                      <span>{quantidadeBase}</span>
                      <span>{it.produto?.unidadeBase ?? "-"}</span>
                      <span>R$ {valorUnitario.toFixed(2)}</span>
                      <span>R$ {valorTotal.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={() => setOpenItens(false)}
              className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter hover:opacity-90 transition cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL ALTERAR DADOS */}
      <Modal open={openAlterarDados} onClose={() => setOpenAlterarDados(false)}>
        <div className="container">
          <div className="container flex flex-col items-start">
            <div className='flex flex-row items-center gap-[0.7rem] justify-center'>
              <img src="/tabela.svg" className='w-[1.5rem] h-[1.5rem]' alt="" />
              <h2 className='text-center text-[1.4rem] font-inter font-semibold'>Alterar Dados</h2>
            </div>
          </div>
          <form onSubmit={handleSubmit(atualizarReceita)} className='container flex flex-col items-center'>
            <div className='flex flex-col items-center my-8 gap-8 w-[35rem]'>
              <div className='relative w-full'>
                <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                  DESCRIÇÃO
                </label>
                <input
                  type="text"
                  placeholder='Vendi duas camisetas M do Senac'
                  className='w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                  id="descricao"
                  {...register("descricao")}
                  required
                />
              </div>
              <div className='flex flex-col gap-8'>
                <div className='flex flex-row justify-between gap-12 w-[35rem]'>
                  <div className='relative w-full'>
                    <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                      VALOR
                    </label>
                    <input
                      type="number"
                      placeholder='R$800,00'
                      className='w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                      id="valor"
                      {...register("valor", { valueAsNumber: true })}
                      required
                    />
                  </div>
                  <div className='relative w-full'>
                    <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                      DATA
                    </label>
                    <input
                      type="date"
                      className='w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                      id="data"
                      {...register("data")}
                      required
                    />
                  </div>
                </div>
                <div className='flex flex-row justify-between gap-12 w-[35rem]'>
                  <div className='relative w-full'>
                    <label className='absolute font-inter -top-2 left-4 bg:white bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                      CLIENTE
                    </label>
                    <select
                      className='w-full border-2 border-[#4A4B51] rounded-xl bg:white bg-white font-inter px-5 py-3 text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                      id="cliente"
                      {...register("clienteId", { valueAsNumber: true })}
                    >
                      <option value="">Sem cliente</option>
                      {clientes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='relative w-full'>
                    <label className='absolute font-inter -top-2 left-4 bg:white bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                      CATEGORIA
                    </label>
                    <select
                      className='w-full border-2 border-[#4A4B51] rounded-xl bg:white bg-white font-inter px-5 py-3 text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                      id="categoria"
                      {...register("categoria")}
                    >
                      {CATEGORIAS_RECEITA.map((categoria) => (
                        <option key={categoria} value={categoria}>
                          {categoria}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setOpenAlterarDados(false)}
                className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter hover:opacity-90 transition cursor-pointer"
              >
                Cancelar
              </button>
              <input
                type="submit"
                value="Confirmar"
                className="text-white bg-[#308021] rounded-md px-6 py-2 text-[1rem] font-bold hover:opacity-90 font-inter transition cursor-pointer"
              />
            </div>
          </form>
        </div>
      </Modal>

      {/* MODAL EXCLUIR */}
      <Modal open={openExcluirReceita} onClose={() => setOpenExcluirReceita(false)}>
        <div className="container">
          <div className="container flex flex-col items-start">
            <div className='flex flex-row items-center gap-[0.7rem] justify-center'>
              <img src="/tabela.svg" className='w-[1.5rem] h-[1.5rem]' alt="" />
              <h2 className='text-center text-[1.4rem] font-inter font-semibold'>Excluir Receita</h2>
            </div>
          </div>
          <div className='container flex flex-col items-center'>
            <div className='flex flex-col items-center my-6'>
              <p className='font-inter'>Você tem certeza que deseja apagar esta receita?</p>
              <p className='font-inter'>Após confirmar, essa ação será irreversível.</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setOpenExcluirReceita(false)}
                className="text:white text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter hover:opacity-90 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={excluirReceita}
                className="text-white bg-[#c02424] rounded-md px-6 py-2 text-[1rem] font-bold hover:opacity-90 font-inter transition cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  )
}
