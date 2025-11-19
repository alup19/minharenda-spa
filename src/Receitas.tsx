import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import Titulo from "./components/Titulo.js";
import Modal from "./components/Modal.js";
import ReceitaItem from "./components/ReceitaItem";
import { useUsuarioStore } from "./context/UsuarioContext.js";

import ItensEditor from "./components/ItensEditor.js";
import type { ItemLinha, ProdutoOption } from "./components/ItensEditor.js";

const apiUrl = import.meta.env.VITE_API_URL;

type Inputs = {
  descricao: string;
  valor: number;
  categoria: string;
  anexo?: string;
  data: string | Date;
  usuarioId: string;
  clienteId?: number;
};

export default function Receitas() {
  const { usuario } = useUsuarioStore();

  const { register, handleSubmit, reset, setValue, getValues } = useForm<Inputs>({
    defaultValues: {
      data: new Date().toISOString().slice(0, 10),
      categoria: "Vendas",
    },
  });

  const [receitas, setReceitas] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [openCriar, setOpenCriar] = useState(false);
  const [modo, setModo] = useState<"rapida" | "itens">("rapida");

  const [itensVenda, setItensVenda] = useState<ItemLinha[]>([]);
  const [produtos, setProdutos] = useState<ProdutoOption[]>([]);

  const totalItens = useMemo(
    () =>
      itensVenda.reduce(
        (total, item) => total + (Number(item.subtotal) || 0),
        0
      ),
    [itensVenda]
  );

  async function getReceitas() {
    if (!usuario?.id) return;

    try {
      const responseReceitas = await fetch(`${apiUrl}/receitas/${usuario.id}`, {
        headers: { Authorization: `Bearer ${usuario.token}` },
      });
      const data = await responseReceitas.json();
      setReceitas(Array.isArray(data) ? data : data.receitas ?? []);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível carregar receitas.");
    }
  }

  async function getClientes() {
    try {
      const responseClientes = await fetch(`${apiUrl}/clientes/${usuario.id}`, {
        headers: { Authorization: `Bearer ${usuario.token}` },
      });
      const data = await responseClientes.json();
      setClientes(Array.isArray(data) ? data : data.clientes ?? []);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível carregar clientes.");
    }
  }

  async function getProdutos() {
    try {
      const responseProdutos = await fetch(`${apiUrl}/produtos/${usuario.id}`, {
        headers: { Authorization: `Bearer ${usuario.token}` },
      });
      const data = await responseProdutos.json();
      setProdutos(Array.isArray(data) ? data : data.produtos ?? []);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível carregar produtos do estoque.");
    }
  }

  useEffect(() => {
    getReceitas();
    getClientes();
  }, []);

  useEffect(() => {
    if (openCriar && modo === "itens") getProdutos();
  }, [openCriar, modo]);

  async function incluirReceita(formData: Inputs) {
    const payload = {
      descricao: formData.descricao,
      valor: Number(formData.valor),
      categoria: formData.categoria,
      anexo: formData.anexo || undefined,
      data: formData.data || new Date().toISOString().slice(0, 10),
      usuarioId: usuario.id,
      clienteId: formData.clienteId ? Number(formData.clienteId) : undefined,
    };

    try {
      const responseCriarReceita = await fetch(`${apiUrl}/receitas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${usuario.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (responseCriarReceita.status === 201) {
        toast.success("Receita criada com sucesso!");
        reset();
        setOpenCriar(false);
        setItensVenda([]);
        getReceitas();
      } else {
        toast.error("Erro ao criar receita.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar receita.");
    }
  }

  async function incluirReceitaComItens() {
    if (!itensVenda.length) return toast.error("Adicione pelo menos um item.");

    const itensInvalidos = itensVenda.some(
      (item) =>
        !item.produtoId ||
        !item.qtdTotalBase ||
        item.qtdTotalBase <= 0 ||
        item.subtotal == null ||
        Number.isNaN(Number(item.subtotal))
    );

    const itensComEstoqueInsuficiente = itensVenda.some((item) => {
      const produto = produtos.find((produto) => produto.id === item.produtoId);
      if (!produto || produto.saldoBase == null || item.qtdTotalBase == null) return false;

      return Number(item.qtdTotalBase) > Number(produto.saldoBase);
    });

    if (itensInvalidos || itensComEstoqueInsuficiente) {
      toast.error(
        "Verifique os itens: campos obrigatórios e quantidade não pode ser maior que o estoque."
      );
      return;
    }

    const formularioCabecalho = getValues();
    const payloadCabecalho = {
      descricao: formularioCabecalho.descricao || "Venda",
      valor: totalItens,
      categoria: formularioCabecalho.categoria || "Vendas",
      anexo: formularioCabecalho.anexo,
      data: formularioCabecalho.data || new Date().toISOString().slice(0, 10),
      usuarioId: usuario.id,
      clienteId: Number(formularioCabecalho.clienteId || 0) || undefined,
    };

    try {
      const respostaCriarReceita = await fetch(`${apiUrl}/receitas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${usuario.token}`,
        },
        body: JSON.stringify(payloadCabecalho),
      });

      if (respostaCriarReceita.status !== 201) {
        toast.error("Não foi possível criar a Receita.");
        return;
      }

      const receitaCriada = await respostaCriarReceita.json();
      const receitaId = receitaCriada.id ?? receitaCriada.receita?.id;

      const itensPayload = itensVenda.map((item) => {
        const qtdBase = Number(item.qtdTotalBase!);
        const subtotal = Number(item.subtotal || 0);
        const precoUnitario =
          qtdBase > 0 ? Number((subtotal / qtdBase).toFixed(6)) : 0;
        return { produtoId: item.produtoId!, qtdBase, precoUnit: precoUnitario, subtotal };
      });

      const respostaCriarItens = await fetch(`${apiUrl}/receitas/${receitaId}/itens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${usuario.token}`,
        },
        body: JSON.stringify({ itens: itensPayload }),
      });

      if (respostaCriarItens.status !== 201 && respostaCriarItens.status !== 200) {
        toast.error("Receita criada, mas houve erro ao salvar os itens.");
        return;
      }

      for (const item of itensPayload) {
        const produto = (produtos as any[]).find(
          (produto) => produto.id === item.produtoId
        );
        const saldoAtual = Number(produto?.saldoBase ?? 0);
        const novoSaldo = Math.max(0, saldoAtual - item.qtdBase);

        try {
          await fetch(`${apiUrl}/produtos/${item.produtoId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${usuario.token}`,
            },
            body: JSON.stringify({
              saldoBase: novoSaldo,
            }),
          });
        } catch (error) {
          console.error("Erro ao baixar estoque do produto", item.produtoId, error);
        }
      }

      toast.success("Venda com itens registrada!");
      setOpenCriar(false);
      reset();
      setItensVenda([]);
      getReceitas();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao registrar a venda com itens.");
    }
  }

  const listaReceitas = receitas.map((receita: any) => (
    <ReceitaItem
      key={receita.id}
      receita={receita}
      receitas={receitas}
      setReceitas={setReceitas}
      clientes={clientes}
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
              <h2 className="text-center text-[2rem] font-inter font-semibold">Receitas</h2>
            </div>
            <button
              onClick={() => { setOpenCriar(true); setModo("rapida"); setValue("data", new Date().toISOString().slice(0, 10));}}
              className="flex text-white items-center justify-center rounded-[0.5rem] bg-[linear-gradient(139deg,_#114114_-40.56%,_#00C000_279.19%)] w-[12rem] h-[2.7rem] text-[1.25rem] font-roboto font-normal">Adicionar</button>
          </div>

          <div className="bg-[#F5F5F5] px-[1.62rem] py-[1.93rem] rounded-[1rem] flex flex-col gap-[1.44rem]">
            <div className="flex flex-row justify-between font-inter text-[1rem] font-normal mt-4">
              <h2>Data da Receita</h2>
              <h2 className="relative right-4">Valor</h2>
              <h2 className="relative left-1">Cliente</h2>
              <h2 className="relative left-[3.5rem]">Categoria</h2>
              <h2 className="relative left-[4.2rem]">Itens Vendidos</h2>
              <h2>Opções</h2>
            </div>

            {listaReceitas}
          </div>
        </div>
      </section>

      <Modal open={openCriar} onClose={() => setOpenCriar(false)}>
        <div className="container w-[44rem]">
          <div className="flex items-center gap-2">
            <img src="/tabela.svg" className="w-[1.5rem] h-[1.5rem]" alt="" />
            <h2 className="text-[1.4rem] font-inter font-semibold">Adicionar Receita (Venda)</h2>
          </div>

          <div className="mt-4 flex gap-3">
            <button className={`px-3 py-1 rounded ${ modo === "rapida" ? "bg-[#E8F5EA] text-[#407B6A]" : "bg-[#F5F5F5]"}`} onClick={() => setModo("rapida")} type="button">Venda rápida</button>
            <button className={`px-3 py-1 rounded ${ modo === "itens" ? "bg-[#E8F5EA] text-[#407B6A]" : "bg-[#F5F5F5]" }`} onClick={() => { setModo("itens"); getProdutos(); }} type="button">Com itens</button>
          </div>

          <form className="mt-4" onSubmit={handleSubmit(incluirReceita)}>
            <div className="grid grid-cols-2 gap-6">
              <div className="relative">
                <label className="absolute -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold">
                  DESCRIÇÃO
                </label>
                <input
                  className="w-full border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]"
                  placeholder="Venda balcão"
                  {...register("descricao")}/>
              </div>
              <div className="relative">
                <label className="absolute -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold">
                  DATA
                </label>
                <input
                  type="date"
                  className="w-full border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]"
                  {...register("data")}/>
              </div>
              <div className="relative">
                <label className="absolute -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold">
                  CLIENTE (opcional)
                </label>
                <select className="w-full border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]" {...register("clienteId", { valueAsNumber: true })}>
                  <option value="">Sem cliente</option>
                  {clientes.map((cliente: any) => (
                    <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <label className="absolute -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold">
                  CATEGORIA
                </label>
                <input
                  className="w-full border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]"
                  placeholder="Vendas"
                  {...register("categoria")}
                />
              </div>
            </div>

            {modo === "rapida" && (
              <div className="mt-6 grid grid-cols-2 gap-6">
                <div className="relative">
                  <label className="absolute -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold">
                    VALOR RECEBIDO
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full border-2 border-[#4A4B51] rounded-xl bg-white px-4 py-2 outline-none focus:border-[#407B6A]"
                    placeholder="R$"
                    {...register("valor", { valueAsNumber: true })}
                  />
                </div>
              </div>
            )}

            {modo === "itens" && (
              <div className="mt-6">
                <h3 className="font-inter font-semibold mb-2">Itens vendidos</h3>

                <ItensEditor modo="venda" itens={itensVenda} produtos={produtos} onChange={setItensVenda}/>

                {produtos.length === 0 && (
                  <p className="text-sm text-[#4A4B51] mt-2">
                    Nenhum produto encontrado. Cadastre itens em <b>Estoque</b>{" "}
                    para poder vendê-los aqui.
                  </p>
                )}

                <div className="mt-4 flex justify-end font-inter">
                  <div>
                    <div className="text-sm text-[#4A4B51]">Total</div>
                    <div className="text-lg font-semibold">R$ {totalItens.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-4">
              <button type="button" onClick={() => { setOpenCriar(false); setItensVenda([]); }} className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter">Cancelar
              </button>

              {modo === "rapida" ? (
                <button type="submit" className="text-white bg-[#308021] rounded-md px-6 py-2 text-[1rem] font-bold font-inter hover:opacity-90">Salvar</button>
              ) : (
                <button type="button" onClick={incluirReceitaComItens} className="text-white bg-[#308021] rounded-md px-6 py-2 text-[1rem] font-bold font-inter hover:opacity-90">Salvar com itens</button>
              )}
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}