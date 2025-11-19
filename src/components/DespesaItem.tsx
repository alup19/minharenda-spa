import { toast } from 'sonner'
import type { DespesaType } from "../utils/DespesaType";
import { useUsuarioStore } from '../context/UsuarioContext';
import Modal from "./Modal";
import { useEffect, useState, useMemo } from "react";
import { useForm } from 'react-hook-form';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"

interface listaDespesaProps {
    despesa: DespesaType;
    despesas: DespesaType[];
    setDespesas: React.Dispatch<React.SetStateAction<DespesaType[]>>;
}

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
    descricao: string
    valor: number
    categoria: string
    anexo?: string
    data: string | Date
    usuarioId: string
}

export default function DespesaItem({ despesa, despesas, setDespesas }: listaDespesaProps) {
    const { usuario } = useUsuarioStore()
    const [OpenAlterarDespesa, setOpenAlterarDespesas] = useState(false)
    const [OpenExcluirDespesa, setOpenExcluirDespesas] = useState(false)
    const [openPreviewAnexo, setOpenPreviewAnexo] = useState(false)
    const [imgErro, setImgErro] = useState(false)
    const { register, handleSubmit, reset, setFocus } = useForm<Inputs>()

    const anexoUrl = useMemo(() => {
        const url = (despesa as any).anexo as string | null | undefined;
        if (!url) return null;
        const urlTrim = url.trim();
        return urlTrim.length > 0 ? urlTrim : null;
    }, [despesa]);

    function abrirPreview() {
        if (!anexoUrl) {
            toast.info("Esta despesa não possui anexo.");
            return;
        }
        setImgErro(false);
        setOpenPreviewAnexo(true);
    }

    async function getDespesas() {
        const response = await fetch(`${apiUrl}/despesas/${usuario.id}`, {
            headers: { Authorization: `Bearer ${usuario.token}` },
        })
        const dados = await response.json()
        setDespesas(Array.isArray(dados) ? dados : dados.despesas ?? [])
    }

    useEffect(() => {
        if (!OpenAlterarDespesa) {
            getDespesas()
        }
    }, [OpenAlterarDespesa])

    useEffect(() => {
        if (OpenAlterarDespesa) {
            setFocus("descricao")
        }
    }, [OpenAlterarDespesa, setFocus])

    function abrirModalAlterar() {
        const d = despesa.data ? new Date(despesa.data as any) : new Date()
        const iso = d.toISOString().slice(0, 10)

        reset({
            descricao: despesa.descricao ?? "",
            valor: Number(despesa.valor ?? 0),
            categoria: despesa.categoria ?? "",
            anexo: (despesa as any).anexo ?? "",
            data: iso,
            usuarioId: usuario.id,
        })

        setOpenAlterarDespesas(true)
    }

    async function atualizarDespesa(data: Inputs) {
        const dataISO =
            typeof data.data === "string" ? data.data : new Date(data.data).toISOString().slice(0, 10)

        const payloadAtualizado: Inputs = {
            descricao: data.descricao,
            valor: Number(data.valor),
            categoria: data.categoria,
            anexo: data.anexo || undefined,
            data: dataISO,
            usuarioId: usuario.id,
        }

        const response = await fetch(`${apiUrl}/despesas/${despesa.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${usuario.token}`
            },
            body: JSON.stringify(payloadAtualizado)
        })

        if (response.status === 200) {
            const despesaAtualizada  = await response.json()

            setDespesas(despesasAnteriores =>
                despesasAnteriores.map((despesaLista: any) => (despesaLista.id === despesa.id ? { ...despesaLista, ...despesaAtualizada  } : despesaLista))
            )

            toast.success("Despesa atualizada com sucesso!")
            reset()
            setOpenAlterarDespesas(false)
        } else {
            console.log(payloadAtualizado)
            toast.error("Erro... Não foi possível atualizar esta Despesa")
        }
    }

    async function excluirDespesa() {
        const response = await fetch(`${apiUrl}/despesas/${despesa.id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${usuario.token}`
                },
            },
        )
        if (response.status === 200) {
            const despesasRestantes = despesas.filter(despesaLista => despesaLista.id !== despesa.id)
            setDespesas(despesasRestantes)
            setOpenExcluirDespesas(false)
            toast.success("Despesa excluída com sucesso")
        } else {
            setOpenExcluirDespesas(false)
            toast.error("Erro... Despesa não foi excluída")
        }
    }

    function dataDMA(data: string | Date | null | undefined) {
        if (!data) return "Data inválida"

        const d = new Date(data)
        if (Number.isNaN(d.getTime())) return "Data inválida"

        const dia = String(d.getDate()).padStart(2, "0")
        const mes = String(d.getMonth() + 1).padStart(2, "0")
        const ano = d.getFullYear()
        return `${dia}/${mes}/${ano}`
    }

    return (
        <section>
            <div key={despesa.id} className="flex flex-col gap-[0.44rem]">
                <div className="bg-[#E2E2E2] py-[0.875rem] px-[1.06rem] rounded-[0.9375rem] flex flex-row justify-between items-center">
                    <p className="text-[#656565] font-inter font-normal text-[1rem]">{dataDMA(despesa.data as any)}</p>
                    <p className="text-[#303030] font-inter font-semibold">R$ {Number(despesa.valor).toLocaleString("pt-br", { minimumFractionDigits: 2 })}</p>
                    <p className="text-[#705519] font-inter text-[0.975rem] font-medium bg-[#F6DDA6] py-[0.10rem] px-[1.06rem] rounded-[0.46875rem]">{despesa.categoria}</p>
                    <button type="button" onClick={abrirPreview} title={anexoUrl ? "Visualizar anexo" : "Sem anexo"} className={`inline-flex ${anexoUrl ? "" : "opacity-40 cursor-not-allowed"}`}><img src="/attachment.svg" alt="Anexo" /></button>
                    <DropdownMenu>
                        <DropdownMenuTrigger><img src="/options.svg" alt="opções" /></DropdownMenuTrigger>
                        <DropdownMenuContent className="font-inter">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={abrirModalAlterar}>Alterar Dados</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setOpenExcluirDespesas(true)} className="text-[#c02424]">Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Modal open={OpenAlterarDespesa} onClose={() => setOpenAlterarDespesas(false)}>
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
                                <input
                                    type="text"
                                    placeholder="Ex.: Luz, aluguel, frete, marketing..."
                                    className="w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors"
                                    required
                                    {...register("descricao")}
                                />
                            </div>

                            <div className="flex flex-col gap-8">
                                <div className="flex flex-row justify-between gap-12 w-[35rem]">
                                    <div className="relative w-full">
                                        <label className="absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide">
                                            VALOR
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            inputMode="decimal"
                                            placeholder="R$ 0,00"
                                            className="w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors"
                                            required
                                            {...register("valor", { valueAsNumber: true })}
                                        />
                                    </div>

                                    <div className="relative w-full">
                                        <label className="absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide">
                                            DATA
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors"
                                            {...register("data")}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-row justify-between gap-12 w-[35rem]">
                                    <div className="relative w-full">
                                        <label className="absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide">
                                            CATEGORIA
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Operacional, Impostos, Serviços..."
                                            className="w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors"
                                            {...register("categoria")}
                                        />
                                    </div>

                                    <div className="relative w-full">
                                        <label className="absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide">
                                            ANEXO
                                        </label>
                                        <input
                                            type="url"
                                            placeholder="Link / upload"
                                            {...register("anexo")}
                                            className="w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button type="button" onClick={() => setOpenAlterarDespesas(false)} className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter hover:opacity-90 transition cursor-pointer">Cancelar
                            </button>
                            <button type="submit" className="text-white bg-[#308021] rounded-md px-6 py-2 text-[1rem] font-bold hover:opacity-90 font-inter transition cursor-pointer">Confirmar
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            <Modal open={OpenExcluirDespesa} onClose={() => setOpenExcluirDespesas(false)}>
                <div className="container">
                    <div className="container flex flex-col items-start">
                        <div className="flex flex-row items-center gap-[0.7rem] justify-center">
                            <img src="/tabela.svg" className="w-[1.5rem] h-[1.5rem]" alt="" />
                            <h2 className="text-center text-[1.4rem] font-inter font-semibold">Excluir Despesa</h2>
                        </div>
                    </div>

                    <div className="container flex flex-col items-center">
                        <div className="flex flex-col items-center my-6">
                            <p className="font-inter">Você tem certeza que deseja apagar esta despesa?</p>
                            <p className="font-inter">Após confirmar, essa ação será irreversível.</p>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setOpenExcluirDespesas(false)} className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter hover:opacity-90 transition cursor-pointer" >Cancelar</button>
                            <button onClick={excluirDespesa} className="text-white bg-[#c02424] rounded-md px-6 py-2 text-[1rem] font-bold hover:opacity-90 font-inter transition cursor-pointer">Confirmar</button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal open={openPreviewAnexo} onClose={() => setOpenPreviewAnexo(false)}>
                <div className="flex flex-col items-center gap-3">
                    <h2 className="font-inter font-semibold text-[1.1rem]">Anexo da despesa</h2>
                    {anexoUrl && !imgErro ? (
                        <img src={anexoUrl} alt="Anexo" className="max-h-[60vh] max-w-full rounded-lg" onError={() => setImgErro(true)}/>
                    ) : (
                        <p className="text-sm text-[#4A4B51]">Não foi possível carregar a imagem.</p>
                    )}
                </div>
            </Modal>
        </section>
    )
}
