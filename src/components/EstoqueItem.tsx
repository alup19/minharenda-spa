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
  categoria?: string;
};

export default function EstoqueItem({
  produto,
  produtos,
  setProdutos,
}: listaProdutoProps) {
  const { usuario } = useUsuarioStore();

  const [OpenAlterarProduto, setOpenAlterarProduto] = useState(false);
  const [OpenExcluirProduto, setOpenExcluirProduto] = useState(false);
  const [openPreviewAnexo, setOpenPreviewAnexo] = useState(false);

  // Modal de alteração de quantidade (saída)
  const [openAlterarQuantidade, setOpenAlterarQuantidade] = useState(false);
  const [qtdRemover, setQtdRemover] = useState<string>("");

  const [imgErro, setImgErro] = useState(false);
  const { register, handleSubmit, reset } = useForm<Inputs>();

  async function getProdutos() {
    const response = await fetch(`${apiUrl}/produtos/${usuario.id}`, {
      headers: usuario?.token ? { Authorization: `Bearer ${usuario.token}` } : {},
    });
    const dados = await response.json();
    setProdutos(dados);
  }

  useEffect(() => {
    if (OpenAlterarProduto) {
      reset({
        nome: produto.nome,
        categoria: (produto as any).categoria ?? "",
      });
    }
  }, [OpenAlterarProduto, produto, reset]);

  async function atualizarProduto(data: Inputs) {
    try {
      const body: any = {
        nome: data.nome,
        categoria:
          data.categoria && data.categoria.length > 0
            ? data.categoria
            : null,
      };

      const resp = await fetch(`${apiUrl}/produtos/${produto.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(usuario?.token ? { Authorization: `Bearer ${usuario.token}` } : {}),
        },
        body: JSON.stringify(body),
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

  // Arquivar / inativar produto (soft delete)
  async function arquivarProduto() {
    try {
      const resp = await fetch(`${apiUrl}/produtos/${produto.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(usuario?.token ? { Authorization: `Bearer ${usuario.token}` } : {}),
        },
        body: JSON.stringify({ ativo: false }),
      });

      if (resp.ok) {
        const restante = produtos.filter((x) => x.id !== produto.id);
        setProdutos(restante);
        toast.success("Produto arquivado. Ele não aparecerá mais no estoque.");
        setOpenExcluirProduto(false);
      } else {
        const t = await resp.text();
        console.error(t);
        toast.error("Erro... Produto não foi arquivado.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Erro... Produto não foi arquivado.");
    }
  }

  // Dados vindos da API para exibição
  const preco = Number((produto as any).precoMedioDisplay ?? 0);
  const unidadeDisplay = (produto as any).unidadeDisplay ?? "un";
  const saldoDisplay = Number((produto as any).saldoDisplay ?? 0);

  // Dados em unidade base para cálculo
  const unidadeBase = (produto as any).unidadeBase as string | undefined;
  const saldoBase = Number((produto as any).saldoBase ?? 0);
  const custoMedio = Number((produto as any).custoMedio ?? 0);

  const categoriaBadge =
    (produto as any).categoria?.toString().replaceAll("_", " ") ?? "-";

  const anexoUrl = useMemo(() => {
    const url = (produto as any).anexo as string | null;
    return url && url.trim().length > 0 ? url.trim() : null;
  }, [produto]);

  function abrirPreview() {
    if (!anexoUrl) {
      toast.info("Este item não possui anexo.");
      return;
    }
    setImgErro(false);
    setOpenPreviewAnexo(true);
  }

  const unidadeInputLabel =
    unidadeBase === "G" ? "g" : unidadeBase === "ML" ? "ml" : "un";

  async function onSubmitAlterarQuantidade(e: React.FormEvent) {
    e.preventDefault();

    const valorStr = qtdRemover.replace(",", ".").trim();
    const qtdDigitada = Number(valorStr);

    if (!qtdDigitada || isNaN(qtdDigitada) || qtdDigitada <= 0) {
      toast.error("Informe uma quantidade válida para remover.");
      return;
    }

    // valor já em unidade base (g/ml/un)
    const qtdBaseRemover = +qtdDigitada.toFixed(6);

    if (qtdBaseRemover > saldoBase) {
      toast.error("Você não pode remover mais do que o saldo atual.");
      return;
    }

    const novoSaldoBase = +(saldoBase - qtdBaseRemover).toFixed(6);
    const novoCustoMedio = novoSaldoBase > 0 ? custoMedio : 0;

    try {
      const body: any = {
        saldoBase: novoSaldoBase,
        custoMedio: novoCustoMedio,
      };

      const resp = await fetch(`${apiUrl}/produtos/${produto.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(usuario?.token ? { Authorization: `Bearer ${usuario.token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (resp.ok) {
        toast.success("Quantidade atualizada com sucesso!");
        setOpenAlterarQuantidade(false);
        setQtdRemover("");
        getProdutos();
      } else {
        const t = await resp.text();
        console.error(t);
        toast.error("Erro ao atualizar quantidade do produto.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar quantidade do produto.");
    }
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
            className={`inline-flex ${
              anexoUrl ? "" : "opacity-40 cursor-not-allowed"
            }`}
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

              <DropdownMenuItem
                onClick={() => setOpenAlterarQuantidade(true)}
              >
                Alterar Quantidade
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setOpenAlterarProduto(true)}>
                Alterar Dados
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setOpenExcluirProduto(true)}
                className="text-[#c02424]"
              >
                Arquivar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Modal ALTERAR PRODUTO – sem poder mudar unidade base */}
      <Modal
        open={OpenAlterarProduto}
        onClose={() => setOpenAlterarProduto(false)}
      >
        <form className="container" onSubmit={handleSubmit(atualizarProduto)}>
          <div className="container flex flex-col items-start">
            <div className="flex flex-row items-center gap-[0.7rem] justify-center">
              <img src="/tabela.svg" className="w-[1.5rem] h-[1.5rem]" alt="" />
              <h2 className="text-center text-[1.4rem] font-inter font-semibold">
                Alterar Item do Estoque
              </h2>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <div className="relative">
              <label className="absolute -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.72rem] font-semibold">
                NOME DO PRODUTO
              </label>
              <input
                {...register("nome")}
                className="w-[20rem] border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.72rem] font-semibold">
                CATEGORIA
              </label>
              <select
                {...register("categoria")}
                className="w-[20rem] border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]"
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

          <div className="mt-6 flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => setOpenAlterarProduto(false)}
              className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="text-white bg-[#308021] rounded-md px-6 py-2 text-[1rem] font-bold font-inter hover:opacity-90"
            >
              Salvar alterações
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal ARQUIVAR PRODUTO */}
      <Modal
        open={OpenExcluirProduto}
        onClose={() => setOpenExcluirProduto(false)}
      >
        <div className="container flex flex-col gap-4 font-inter">
          <h2 className="text-[1.3rem] font-semibold">
            Arquivar produto do estoque?
          </h2>
          <p className="text-sm text-[#4A4B51]">
            {produto.nome} – {saldoDisplay} {unidadeDisplay}
          </p>
          <p className="text-xs text-[#4A4B51]">
            Ele não será excluído das vendas já realizadas, apenas deixará de
            aparecer no estoque e nas próximas entradas.
          </p>

          <div className="mt-4 flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => setOpenExcluirProduto(false)}
              className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={arquivarProduto}
              className="text-white bg-[#c02424] rounded-md px-6 py-2 text-[1rem] font-bold font-inter hover:opacity-90"
            >
              Arquivar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal PREVIEW ANEXO */}
      <Modal open={openPreviewAnexo} onClose={() => setOpenPreviewAnexo(false)}>
        <div className="flex flex-col items-center gap-3">
          <h2 className="font-inter font-semibold text-[1.1rem]">
            Anexo do produto
          </h2>
          {anexoUrl && !imgErro ? (
            <img
              src={anexoUrl}
              alt="Anexo"
              className="max-h-[60vh] max-w-full rounded-lg"
              onError={() => setImgErro(true)}
            />
          ) : (
            <p className="text-sm text-[#4A4B51]">
              Não foi possível carregar a imagem.
            </p>
          )}
        </div>
      </Modal>

      {/* Modal ALTERAR QUANTIDADE (saída) */}
      <Modal
        open={openAlterarQuantidade}
        onClose={() => setOpenAlterarQuantidade(false)}
      >
        <form
          className="container flex flex-col items-center gap-4 font-inter"
          onSubmit={onSubmitAlterarQuantidade}
        >
          <h2 className="text-[1.3rem] font-semibold">
            Alterar Quantidade do Estoque
          </h2>
          <div className="flex flex-row gap-8">
            <p className="text-[1rem] text-[#4A4B51]">
              Produto: <strong>{produto.nome}</strong>
            </p>
            <p className="text-[1rem] text-[#4A4B51]">
              Estoque atual:{" "}
              <strong>
                {saldoDisplay} {unidadeDisplay}
              </strong>
            </p>
          </div>
          <div className="relative mt-2">
            <label className="absolute -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.72rem] font-semibold">
              QUANTIDADE A REMOVER ({unidadeInputLabel})
            </label>
            <input
              type="number"
              step="0.001"
              min={0}
              value={qtdRemover}
              onChange={(e) => setQtdRemover(e.target.value)}
              className="w-[20rem] border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]"
              placeholder="Ex: 400"
            />
          </div>

          <div className="mt-2 flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => setOpenAlterarQuantidade(false)}
              className="text-white bg-[#292727] rounded-md px-6 py-2 text-[0.95rem] hover:bg-[#3a3939] font-bold font-inter"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="text-white bg-[#c08324] rounded-md px-6 py-2 text-[0.95rem] font-bold font-inter hover:opacity-90"
            >
              Confirmar saída
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
