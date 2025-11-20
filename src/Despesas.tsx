import { useEffect, useState } from "react";
import Titulo from "./components/Titulo.js";
import Modal from "./components/Modal.js";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUsuarioStore } from "./context/UsuarioContext.js";
import DespesaItem from "./components/DespesaItem.js";

const apiUrl = import.meta.env.VITE_API_URL;

type Inputs = {
  descricao: string;
  valor: number;
  categoria: string;
  anexo?: string;
  data: string | Date;
  usuarioId: string;
};

export default function Despesas() {
  const { usuario } = useUsuarioStore();
  const [openAdicionarDespesas, setOpenAdicionarDespesas] = useState(false);
  const [despesas, setDespesas] = useState<any[]>([]);

  const { register, handleSubmit, reset } = useForm<Inputs>({
    defaultValues: {
      data: new Date().toISOString().slice(0, 10),
    },
  });

  async function getDespesas() {
    try {
      const resp = await fetch(`${apiUrl}/despesas/${usuario.id}`, {
        headers: { Authorization: `Bearer ${usuario.token}` },
      });
      const data = await resp.json();
      setDespesas(Array.isArray(data) ? data : data.despesas ?? []);
    } catch (error) {
      toast.error("Não foi possível carregar despesas.");
    }
  }

  useEffect(() => {
    getDespesas();
  }, [usuario.id]);

  async function incluirDespesa(data: Inputs) {
    const dataISO =
      typeof data.data === "string" ? data.data : new Date(data.data).toISOString().slice(0, 10);

    const payloadDespesa: Inputs = {
      descricao: data.descricao,
      valor: Number(data.valor),
      categoria: data.categoria,
      anexo: data.anexo,
      data: dataISO,
      usuarioId: usuario.id,
    };

    try {
      const resp = await fetch(`${apiUrl}/despesas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", Authorization: `Bearer ${usuario.token}`,
        },
        body: JSON.stringify(payloadDespesa),
      });

      if (resp.status === 201) {
        toast.success("Despesa criada com sucesso!");
        reset();
        setOpenAdicionarDespesas(false);
        getDespesas();
      } else {
        toast.error("Erro ao criar despesa.");
      }
    } catch (error) {
      toast.error("Erro ao criar despesa.");
    }
  }

  const listaDespesas = despesas.map((despesa: any) => (
    <DespesaItem
      key={despesa.id}
      despesa={despesa}
      despesas={despesas}
      setDespesas={setDespesas}
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
              <h2 className="text-center text-[2rem] font-inter font-semibold">Despesas</h2>
            </div>
            <button onClick={() => setOpenAdicionarDespesas(true)} className="flex text-white items-center justify-center rounded-[0.5rem] bg-[linear-gradient(139deg,_#114114_-40.56%,_#00C000_279.19%)] w-[12rem] h-[2.7rem] text-[1.25rem] font-roboto font-normal">Adicionar
            </button>
          </div>

          <div className="bg-[#F5F5F5] px-[1.62rem] py-[1.93rem] rounded-[1rem] flex flex-col gap-[1.44rem]">
            <div className="flex flex-col gap-[1.44rem]">
              <div className="flex flex-row justify-between">
                <div className="flex flex-row items-center gap-[1.125rem]">
                  <img src="/arrow_l.svg" alt="" />
                  <h3 className="text-[1.5rem] font-inter font-semibold">Setembro</h3>
                  <img src="/arrow_r.svg" alt="" />
                </div>
                <div className="relative">
                  <label className="absolute font-inter -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.6875rem] font-semibold tracking-wide">
                    CATEGORIA
                  </label>
                  <input type="text" placeholder="Selecionar Categoria" className="border-2 border-[#4A4B51] rounded-xl font-inter pl-5 w-[14.6875rem] h-[2.75rem] placeholder:text-[1rem] placeholder:font-normal placeholder:text-[#828386] text-[#4A4B51] text-lg font-medium bg-[#F5F5F5] outline-none focus:border-[#407B6A] transition-colors" id="filtro_categoria" />
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-between font-inter text-[1rem] font-normal mt-4">
              <h2>Data da Despesa</h2>
              <h2 className="relative right-2">Valor</h2>
              <h2 className="relative left-10">Categoria</h2>
              <h2 className="relative left-[3.5rem]">Anexo</h2>
              <h2>Opções</h2>
            </div>

            {listaDespesas}

            <div className="text-[0.95rem] text-[#4A4B51]">
              Comprou produtos/insumos? Cadastre a compra em{" "}
              <span className="font-semibold">Estoque</span> para atualizar o
              custo médio automaticamente.
            </div>
          </div>
        </div>
      </section>

      <Modal open={openAdicionarDespesas} onClose={() => setOpenAdicionarDespesas(false)}>
        <div className="container">
          <div className="container flex flex-col items-start">
            <div className="flex flex-row items-center gap-[0.7rem] justify-center">
              <img src="/tabela.svg" className="w-[1.5rem] h-[1.5rem]" alt="" />
              <h2 className="text-center text-[1.4rem] font-inter font-semibold">Adicionar Despesa</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit(incluirDespesa)} className="container flex flex-col items-center">
            <div className="flex flex-col items-center my-8 gap-8 w-[35rem]">
              <div className="relative w-full">
                <label className="absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide">
                  DESCRIÇÃO
                </label>
                <input type="text" placeholder="Ex.: Luz, aluguel, frete, marketing..." className="w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors" required {...register("descricao")}/>
              </div>

              <div className="flex flex-col gap-8">
                <div className="flex flex-row justify-between gap-12 w-[35rem]">
                  <div className="relative w-full">
                    <label className="absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide">
                      VALOR
                    </label>
                    <input type="number" step="0.01" inputMode="decimal" placeholder="R$ 0,00" className="w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors" required {...register("valor", { valueAsNumber: true })}/>
                  </div>

                  <div className="relative w-full">
                    <label className="absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide">
                      DATA
                    </label>
                    <input type="date" className="w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors" required {...register("data")}/>
                  </div>
                </div>

                <div className="flex flex-row justify-between gap-12 w-[35rem]">
                  <div className="relative w-full">
                    <label className="absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide">
                      CATEGORIA
                    </label>
                    <input type="text" placeholder="Operacional, Impostos, Serviços..." className="w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors" {...register("categoria")}
                    />
                  </div>

                  <div className="relative w-full">
                    <label className="absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide">
                      ANEXO (NF)
                    </label>
                    <input type="url" placeholder="Link / upload" className="w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors" {...register("anexo")}/>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => setOpenAdicionarDespesas(false)} className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter hover:opacity-90 transition cursor-pointer" >Cancelar
              </button>
              <button type="submit" className="text-white bg-[#308021] rounded-md px-6 py-2 text-[1rem] font-bold hover:opacity-90 font-inter transition cursor-pointer">Confirmar</button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
