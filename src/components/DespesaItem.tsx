import { toast } from "sonner";
import type { DespesaType } from "../utils/DespesaType";
import { useUsuarioStore } from "../context/UsuarioContext";
import Modal from "./Modal";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const apiUrl = import.meta.env.VITE_API_URL;

const CATEGORIAS_DESPESA = [
    "Não definido",
    "Alimentação",
    "Assinaturas e serviços",
    "Bares e restaurantes",
    "Casas",
    "Compras",
    "Cuidados pessoais",
    "Dívidas e empréstimos",
    "Educação",
    "Família e filhos",
    "Impostos e Taxas",
    "Investimentos",
    "Lazer e hobbies",
    "Mercado",
    "Outros",
    "Pets",
    "Presentes e doações",
    "Roupas",
    "Saúde",
    "Trabalho",
    "Transporte",
    "Viagem",
] as const;



interface ListaDespesaProps {
    despesa: DespesaType & {
        anexo?: string | null;
    };
    despesas: DespesaType[];
    setDespesas: React.Dispatch<React.SetStateAction<DespesaType[]>>;
}

type Inputs = {
    descricao: string;
    valor: number;
    data: string;
    categoria: string;
    anexo?: string;
};

function dataDMA(data: string | Date | null | undefined) {
    if (!data) return "Data inválida";
    const d = new Date(data);
    if (Number.isNaN(d.getTime())) return "Data inválida";
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

export default function DespesaItem({
    despesa,
    despesas,
    setDespesas,
}: ListaDespesaProps) {
    const { usuario } = useUsuarioStore();

    const [openAlterarDespesa, setOpenAlterarDespesa] = useState(false);
    const [openExcluirDespesa, setOpenExcluirDespesa] = useState(false);
    const [openPreviewAnexo, setOpenPreviewAnexo] = useState(false);
    const [anexoUrl, setAnexoUrl] = useState<string | null>(null);
    const [imgErro, setImgErro] = useState(false);

    const { register, handleSubmit, reset } = useForm<Inputs>();

    function abrirModalAlterar() {
        const dataRef: any = (despesa as any).data ?? (despesa as any).createdAt;
        const iso = dataRef
            ? new Date(dataRef).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10);

        reset({
            descricao: (despesa as any).descricao ?? "",
            valor: Number((despesa as any).valor ?? 0),
            data: iso,
            categoria: (despesa as any).categoria ?? "Não definido",
            anexo: (despesa as any).anexo ?? "",
        });

        setOpenAlterarDespesa(true);
    }

    function abrirPreviewAnexo() {
        const url = (despesa as any).anexo as string | undefined;
        if (!url) {
            toast.error("Esta despesa não possui anexo.");
            return;
        }
        setImgErro(false);
        setAnexoUrl(url);
        setOpenPreviewAnexo(true);
    }

    async function atualizarDespesa(data: Inputs) {
        if (!usuario) return;

        const categoriaNormalizada =
            !data.categoria || data.categoria.trim() === ""
                ? "Não definido"
                : data.categoria;

        const payloadAtualizado = {
            descricao: data.descricao,
            valor: Number(data.valor),
            categoria: categoriaNormalizada,
            anexo: data.anexo || undefined,
            data: data.data,
            usuarioId: usuario.id,
        };

        const response = await fetch(`${apiUrl}/despesas/${despesa.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${usuario.token}`,
            },
            body: JSON.stringify(payloadAtualizado),
        });

        if (response.status === 200) {
            const despesaAtualizada = await response.json();

            setDespesas((despesasAnteriores) =>
                despesasAnteriores.map((despesaLista: any) =>
                    despesaLista.id === despesa.id
                        ? { ...despesaLista, ...despesaAtualizada }
                        : despesaLista
                )
            );

            toast.success("Despesa atualizada com sucesso!");
            reset();
            setOpenAlterarDespesa(false);
        } else {
            toast.error("Erro... Não foi possível atualizar esta despesa");
        }
    }

    async function excluirDespesa() {
        if (!usuario) return;

        const response = await fetch(`${apiUrl}/despesas/${despesa.id}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${usuario.token}`,
            },
        });

        if (response.ok) {
            const despesas2 = despesas.filter((x) => x.id !== despesa.id);
            setDespesas(despesas2);
            setOpenExcluirDespesa(false);
            toast.success("Despesa excluída com sucesso");
        } else {
            setOpenExcluirDespesa(false);
            toast.error("Erro... Despesa não foi excluída");
        }
    }

    const dataRef: any = (despesa as any).data ?? (despesa as any).createdAt;
    const valorNumero = Number((despesa as any).valor ?? 0);
    const categoria =
        (despesa as any).categoria && (despesa as any).categoria.trim() !== ""
            ? (despesa as any).categoria
            : "Não definido";

    const temAnexo = !!(despesa as any).anexo;

    return (
        <section>
            <div className="flex flex-col gap-[0.44rem]">
                <div className="bg-[#E2E2E2] py-[0.875rem] px-[1.06rem] rounded-[0.9375rem] grid grid-cols-5 items-center gap-2">
                    <p className="text-[#656565] font-inter font-normal text-[1rem]">
                        {dataDMA(dataRef)}
                    </p>

                    <p className="text-[#303030] font-inter font-semibold text-center">
                        R${" "}
                        {valorNumero.toLocaleString("pt-br", {
                            minimumFractionDigits: 2,
                        })}
                    </p>

                    <p className="text-[#705519] font-inter text-center text-[0.975rem] font-medium bg-[#F6DDA6] py-[0.10rem] px-[1.06rem] rounded-[0.46875rem]">
                        {categoria}
                    </p>

                    <button type="button" onClick={abrirPreviewAnexo} title={temAnexo ? "Visualizar anexo" : "Sem anexo"} className={`flex items-center justify-center ${temAnexo ? "" : "opacity-40 cursor-not-allowed"}`}>
                        <img src="/attachment.svg" alt="Anexo" />
                    </button>


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
                                <DropdownMenuItem onClick={abrirModalAlterar}>
                                    Alterar Dados
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setOpenExcluirDespesa(true)} className="text-[#c02424]">
                                    Excluir
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            <Modal open={openAlterarDespesa} onClose={() => setOpenAlterarDespesa(false)}>
                <div className="container">
                    <div className="container flex flex-col items-start">
                        <div className="flex flex-row items-center gap-[0.7rem] justify-center">
                            <img src="/tabela.svg" className="w-[1.5rem] h-[1.5rem]" alt="" />
                            <h2 className="text-center text-[1.4rem] font-inter font-semibold">
                                Alterar Despesa
                            </h2>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(atualizarDespesa)} className="container flex flex-col items-center">
                        <div className="flex flex-col items-center my-8 gap-8 w-[35rem]">
                            <div className="relative w-full">
                                <label className="absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide">
                                    DESCRIÇÃO
                                </label>
                                <input type="text" placeholder="Ex: Aluguel, Conta de luz, Compra de material..." className="w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors" id="descricao" {...register("descricao")} required />
                            </div>

                            <div className="flex flex-col gap-8">
                                <div className="flex flex-row justify-between gap-12 w-[35rem]">
                                    <div className="relative w-full">
                                        <label className="absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide">
                                            VALOR
                                        </label>
                                        <input type="number" placeholder="R$ 0,00" className="w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors" id="valor" {...register("valor", { valueAsNumber: true })} required />
                                    </div>

                                    <div className="relative w-full">
                                        <label className="absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide">
                                            DATA
                                        </label>
                                        <input type="date" className="w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors" id="data" {...register("data")} required />
                                    </div>
                                </div>

                                <div className="flex flex-row justify-between gap-12 w-[35rem]">
                                    <div className="relative w-full">
                                        <label className="absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide">
                                            CATEGORIA
                                        </label>
                                        <select className="w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors" id="categoria" {...register("categoria")}>
                                            {CATEGORIAS_DESPESA.map((categoria) => (
                                                <option key={categoria} value={categoria}>
                                                    {categoria}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="relative w-full">
                                        <label className="absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide">
                                            ANEXO (URL)
                                        </label>
                                        <input type="text" placeholder="https://..." className="w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors" id="anexo" {...register("anexo")} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button type="button" onClick={() => setOpenAlterarDespesa(false)} className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter hover:opacity-90 transition cursor-pointer">
                                Cancelar
                            </button>
                            <input type="submit" value="Confirmar" className="text-white bg-[#308021] rounded-md px-6 py-2 text-[1rem] font-bold hover:opacity-90 font-inter transition cursor-pointer" />
                        </div>
                    </form>
                </div>
            </Modal>

            <Modal open={openExcluirDespesa} onClose={() => setOpenExcluirDespesa(false)}>
                <div className="container">
                    <div className="container flex flex-col items-start">
                        <div className="flex flex-row items-center gap-[0.7rem] justify-center">
                            <img src="/tabela.svg" className="w-[1.5rem] h-[1.5rem]" alt="" />
                            <h2 className="text-center text-[1.4rem] font-inter font-semibold">
                                Excluir Despesa
                            </h2>
                        </div>
                    </div>

                    <div className="container flex flex-col items-center">
                        <div className="flex flex-col items-center my-6">
                            <p className="font-inter">
                                Você tem certeza que deseja apagar esta despesa?
                            </p>
                            <p className="font-inter">
                                Após confirmar, essa ação será irreversível.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button type="button" onClick={() => setOpenExcluirDespesa(false)} className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter hover:opacity-90 transition cursor-pointer">
                                Cancelar
                            </button>
                            <button onClick={excluirDespesa} className="text-white bg-[#c02424] rounded-md px-6 py-2 text-[1rem] font-bold hover:opacity-90 font-inter transition cursor-pointer">
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal open={openPreviewAnexo} onClose={() => setOpenPreviewAnexo(false)}>
                <div className="flex flex-col items-center gap-3">
                    <h2 className="font-inter font-semibold text-[1.1rem]">
                        Anexo da despesa
                    </h2>
                    {anexoUrl && !imgErro ? (
                        <img src={anexoUrl} alt="Anexo" className="max-h-[60vh] max-w-full rounded-lg" onError={() => setImgErro(true)}/>
                    ) : (
                        <p className="text-sm text-[#4A4B51]">
                            Não foi possível carregar a imagem.
                        </p>
                    )}
                </div>
            </Modal>
        </section>
    );
}
