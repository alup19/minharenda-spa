import { toast } from "sonner";
import type { ProdutoType } from "../utils/ProdutoType";
import { useUsuarioStore } from "../context/UsuarioContext";
import Modal from "./Modal";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const CATEGORIAS = [
  "ALIMENTOS",
  "BEBIDAS",
  "CUIDADOS_PESSOAIS",
  "LIMPEZA",
  "OUTROS",
] as const;

interface listaProdutoProps {
  produto: ProdutoType | any;
  produtos: (ProdutoType | any)[];
  setProdutos: React.Dispatch<React.SetStateAction<(ProdutoType | any)[]>>;
}

const apiUrl = import.meta.env.VITE_API_URL;

type Inputs = {
  nome: string;
  unidadeBase: "UN" | "G" | "ML";
  categoria?: string;
};

export default function EstoqueItem({ produto, produtos, setProdutos }: listaProdutoProps) {
  const { usuario } = useUsuarioStore();
  const [OpenAlterarProduto, setOpenAlterarProduto] = useState(false);
  const [OpenExcluirProduto, setOpenExcluirProduto] = useState(false);
  const [openPreviewAnexo, setOpenPreviewAnexo] = useState(false);
  const [imgErro, setImgErro] = useState(false);
  const { register, handleSubmit, reset } = useForm<Inputs>();

  async function getProdutos() {
    const response = await fetch(`${apiUrl}/produtos`, {
      headers: usuario?.token ? { Authorization: `Bearer ${usuario.token}` } : {},
    });
    const dados = await response.json();
    setProdutos(dados);
  }

  useEffect(() => {
    if (OpenAlterarProduto) {
      reset({
        nome: produto.nome,
        unidadeBase: (produto as any).unidadeBase ?? "UN",
        categoria: (produto as any).categoria ?? "",
      });
    }
  }, [OpenAlterarProduto, produto, reset]);

  async function atualizarProduto(data: Inputs) {
    try {
      const resp = await fetch(`${apiUrl}/produtos/${produto.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(usuario?.token ? { Authorization: `Bearer ${usuario.token}` } : {}),
        },
        body: JSON.stringify({
          nome: data.nome,
          unidadeBase: data.unidadeBase,
          categoria: data.categoria && data.categoria.length > 0 ? data.categoria : null,
        }),
      });

      if (resp.ok) {
        toast.success("Produto atualizado!");
        setOpenAlterarProduto(false);
        getProdutos();
      } else {
        const t = await resp.text();
        console.error(t);
        toast.error("Erro ao atualizar produto.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Erro ao atualizar produto.");
    }
  }

  async function excluirProduto() {
    try {
      const resp = await fetch(`${apiUrl}/produtos/${produto.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(usuario?.token ? { Authorization: `Bearer ${usuario.token}` } : {}),
        },
      });

      if (resp.ok) {
        const restante = produtos.filter((x) => x.id !== produto.id);
        setProdutos(restante);
        toast.success("Produto excluído com sucesso!");
        setOpenExcluirProduto(false);
      } else {
        const t = await resp.text();
        console.error(t);
        toast.error("Erro... Produto não foi excluído.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Erro... Produto não foi excluído.");
    }
  }

  const preco = Number((produto as any).precoMedioDisplay ?? 0);
  const unidadeDisplay = (produto as any).unidadeDisplay ?? "un";
  const saldoDisplay = Number((produto as any).saldoDisplay ?? 0);

  const categoriaBadge =
    (produto as any).categoria?.toString().replaceAll("_", " ") ?? "-";

  const anexoUrl = useMemo(() => {
    const url = (produto as any).anexo as string | null;
    return (url && url.trim().length > 0) ? url.trim() : null;
  }, [produto]);

  function abrirPreview() {
    if (!anexoUrl) {
      toast.info("Este item não possui anexo.");
      return;
    }
    setImgErro(false);
    setOpenPreviewAnexo(true);
  }

  return (
    <section>
      <div className="flex flex-col gap-[0.44rem]">
        <div className="bg-[#E2E2E2] py-[0.875rem] px-[1.06rem] rounded-[0.9375rem] flex flex-row justify-between items-center">
          <p className="text-[#656565] font-inter font-normal text-[1rem]">
            {produto.nome}
          </p>

          <p className="text-[#303030] font-inter font-semibold">
            {saldoDisplay} {unidadeDisplay}
          </p>

          <p className="text-[#656565] font-inter font-normal">
            R$ {preco.toFixed(2)} /{unidadeDisplay}
          </p>

          <p className="text-[#705519] font-inter text-[0.975rem] font-medium bg-[#F6DDA6] py-[0.10rem] px-[1.06rem] rounded-[0.46875rem] ">
            {categoriaBadge}
          </p>

          <button
            type="button"
            onClick={abrirPreview}
            title={anexoUrl ? "Visualizar anexo" : "Sem anexo"}
            className={`inline-flex ${anexoUrl ? "" : "opacity-40 cursor-not-allowed"}`}
          >
            <img src="/attachment.svg" alt="Anexo" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <img src="/options.svg" alt="opções" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="font-inter">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setOpenAlterarProduto(true)}>
                Alterar Dados
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setOpenExcluirProduto(true)}
                className="text-[#c02424]"
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Modal open={OpenAlterarProduto} onClose={() => setOpenAlterarProduto(false)}>
        <form className="container" onSubmit={handleSubmit(atualizarProduto)}>
          <div className="container flex flex-col items-start">
            <div className="flex flex-row items-center gap-[0.7rem] justify-center">
              <img src="/tabela.svg" className="w-[1.5rem] h-[1.5rem]" alt="" />
              <h2 className="text-center text-[1.4rem] font-inter font-semibold">
                Alterar Item do Estoque
              </h2>
            </div>
          </div>

          <div className="my-6 grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="absolute -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold">
                NOME
              </label>
              <input
                className="w-full border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]"
                {...register("nome")}
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold">
                UNIDADE BASE
              </label>
              <select
                className="w-full border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]"
                {...register("unidadeBase")}
                defaultValue={(produto as any).unidadeBase ?? "UN"}
              >
                <option value="UN">UN</option>
                <option value="G">G</option>
                <option value="ML">ML</option>
              </select>
            </div>

            <div className="relative">
              <label className="absolute -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold">
                CATEGORIA
              </label>
              <select
                className="w-full border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]"
                {...register("categoria")}
                defaultValue={(produto as any).categoria ?? ""}
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

          <div className="container flex flex-col items-center">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setOpenAlterarProduto(false)}
                className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter hover:opacity-90 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="text-white bg-[#308021] rounded-md px-6 py-2 text-[1rem] font-bold hover:opacity-90 font-inter transition cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal open={OpenExcluirProduto} onClose={() => setOpenExcluirProduto(false)}>
        <div className="container">
          <div className="container flex flex-col items-start">
            <div className="flex flex-row items-center gap-[0.7rem] justify-center">
              <img src="/tabela.svg" className="w-[1.5rem] h-[1.5rem]" alt="" />
              <h2 className="text-center text-[1.4rem] font-inter font-semibold">
                Excluir Item do Estoque
              </h2>
            </div>
          </div>

          <div className="container flex flex-col items-center">
            <div className="flex flex-col items-center my-6">
              <p className="font-inter">
                Você tem certeza que deseja apagar este item do estoque?
              </p>
              <p className="font-inter">
                Após confirmar, essa ação será irreversível.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setOpenExcluirProduto(false)}
                className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter hover:opacity-90 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={excluirProduto}
                className="text-white bg-[#c02424] rounded-md px-6 py-2 text-[1rem] font-bold hover:opacity-90 font-inter transition cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={openPreviewAnexo} onClose={() => setOpenPreviewAnexo(false)}>
        <div className="w-[80vw] max-w-[800px]">
          <h2 className="text-center text-[1.2rem] font-inter font-semibold mb-3">
            Anexo do produto
          </h2>

          {anexoUrl && !imgErro ? (
            <div className="w-full h-[65vh] bg-white flex items-center justify-center rounded-lg overflow-hidden border">
              <img
                src={anexoUrl}
                alt="Anexo"
                className="max-w-full max-h-full object-contain"
                onError={() => setImgErro(true)}
              />
            </div>
          ) : (
            <div className="w-full h-[50vh] bg-white flex flex-col gap-3 items-center justify-center rounded-lg border">
              <p className="font-inter text-[#4A4B51] px-6 text-center">
                Não foi possível exibir a imagem do anexo.
              </p>
              {anexoUrl && (
                <a
                  href={anexoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#308021] text-white rounded-md font-inter hover:opacity-90"
                >
                  Abrir em nova guia
                </a>
              )}
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setOpenPreviewAnexo(false)}
              className="px-5 py-2 bg-[#292727] text-white rounded-md font-inter hover:opacity-90"
            >
              Fechar
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
