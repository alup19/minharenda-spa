import { toast } from 'sonner'
import type { DespesaType } from "../utils/DespesaType";
import { useUsuarioStore } from '../context/UsuarioContext';
import Modal from "./Modal";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';

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

export default function UltimasDespesas({ despesa, despesas, setDespesas }: listaDespesaProps) {
    const { usuario } = useUsuarioStore()

    const [OpenAlterarDespesa, setOpenAlterarDespesas] = useState(false)

    const [openPreviewAnexo, setOpenPreviewAnexo] = useState(false);
    const [anexoUrl, setAnexoUrl] = useState<string | null>(null);
    const [imgErro, setImgErro] = useState(false);

    const { setFocus } = useForm<Inputs>()

    async function getDespesas() {
        const response = await fetch(`${apiUrl}/despesas/${usuario.id}`, {
            headers: { Authorization: `Bearer ${usuario.token}` },
        })
        const dados = await response.json()
        setDespesas(Array.isArray(dados) ? dados : dados.despesas ?? [])
    }

    useEffect(() => {
        getDespesas()
        if (OpenAlterarDespesa) {
            setFocus("descricao")
        }
    }, [OpenAlterarDespesa, setFocus])

    function formatarData(dataStr: string) {
        const d = new Date(dataStr);

        return d
            .toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
            })
            .replace(" de ", " ");
    }

    const temAnexo = !!(despesa as any).anexo;

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

    return (
        <section>
            <div key={despesa.id} className="flex flex-col gap-[0.5rem]">
                <div className="flex items-center bg-[#E2E2E2] px-[1.0625rem] py-[0.875rem] rounded-[0.9375rem] gap-4">
                    <div className="flex items-center gap-[0.81rem]">
                        <img className="rotate-180" src="/launch.svg" alt="" />
                        <p className="text-[#656565] font-inter font-normal text-[1rem]">
                            {formatarData(despesa.data as any)}
                        </p>
                    </div>

                    <p className="flex-1 text-center font-inter font-semibold text-[#303030]">
                        R$ {Number(despesa.valor).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
                    </p>

                    <p className="flex-1 text-center text-[#705519] font-inter text-[0.875rem] py-[0.25rem] px-[1.0625rem] font-medium bg-[#F6DDA6] rounded-[0.46875rem]">
                        {despesa.categoria}
                    </p>

                    <button type="button" onClick={abrirPreviewAnexo} className={`ml-auto flex items-center justify-center ${temAnexo ? "" : "opacity-40 cursor-not-allowed"}`}>
                        <img src="/attachment.svg" alt="Anexo" />
                    </button>
                </div>

            </div>

            <Modal open={openPreviewAnexo} onClose={() => setOpenPreviewAnexo(false)}>
                <div className="flex flex-col items-center gap-3">
                    <h2 className="font-inter font-semibold text-[1.1rem]">
                        Anexo da despesa
                    </h2>
                    {anexoUrl && !imgErro ? (
                        <img src={anexoUrl} alt="Anexo" className="max-h-[60vh] max-w-full rounded-lg" onError={() => setImgErro(true)} />
                    ) : (
                        <p className="text-sm text-[#4A4B51]">
                            Não foi possível carregar a imagem.
                        </p>
                    )}
                </div>
            </Modal>
        </section>
    )
}
