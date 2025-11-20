import { toast } from 'sonner'
import Modal from "./components/Modal";
import { useEffect, useMemo, useState } from "react";
import Titulo from './components/Titulo'
import { useUsuarioStore } from './context/UsuarioContext';
import ClienteItem from './components/ClienteItem';
import { useForm } from 'react-hook-form';

const apiUrl = import.meta.env.VITE_API_URL;

type Inputs = {
  nome: string
  endereco: string
  telefone: string
  notas: string
  usuarioId: string
};

export default function Clientes() {
  const { usuario } = useUsuarioStore();
  const { register, handleSubmit, reset } = useForm<Inputs>()

  const [openAdicionarCliente, setOpenAdicionarCliente] = useState(false)
  const [clientes, setClientes] = useState<any[]>([]);

  const [filtroNome, setFiltroNome] = useState<string>("")
  const [filtroOrdem, setFiltroOrdem] = useState<string>("")

  async function getClientes() {
    try {
      const resp = await fetch(`${apiUrl}/clientes/${usuario.id}`, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
        },
      });

      if (!resp.ok) {
        throw new Error("Erro ao buscar clientes");
      }

      const data = await resp.json();
      const clientesBrutos = Array.isArray(data) ? data : data.clientes ?? [];

      const clientesComTotais = clientesBrutos.map((cliente: any) => {
        const receitas = Array.isArray(cliente.receitas) ? cliente.receitas : [];

        const totalCompras = cliente.totalCompras ?? receitas.length;

        const totalGasto =
          cliente.totalGasto ??
          receitas.reduce((soma: number, receita: any) => {
            const valor = receita.valorTotal ?? receita.valor ?? 0;
            return soma + Number(valor);
          }, 0);

        return { ...cliente, totalGasto, totalCompras };
      });

      setClientes(clientesComTotais);
    } catch (error) {
      toast.error("Não foi possível carregar clientes.");
    }
  }

  useEffect(() => {
    if (usuario?.id) {
      getClientes();
    }
  }, [usuario?.id]);

  async function incluirCliente(data: Inputs) {
    const payload: Inputs = {
      nome: data.nome,
      endereco: data.endereco,
      telefone: data.telefone,
      notas: data.notas,
      usuarioId: usuario.id
    };

    try {
      const resp = await fetch(`${apiUrl}/clientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${usuario.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (resp.status === 201) {
        toast.success("Cliente criado com sucesso!");
        reset();
        setOpenAdicionarCliente(false);
        getClientes();
      } else {
        toast.error("Erro ao criar cliente.");
      }
    } catch (error) {
      toast.error("Erro ao criar cliente.");
    }
  }

  const clientesFiltrados = useMemo(() => {
    let base = [...clientes];

    if (filtroNome.trim().length > 0) {
      const q = filtroNome.toLowerCase();
      base = base.filter(c => c.nome.toLowerCase().includes(q));
    }

    switch (filtroOrdem) {
      case "gasto_maior":
        base.sort((clienteA, clienteB) => (clienteB.totalGasto ?? 0) - (clienteA.totalGasto ?? 0));
        break;
      case "gasto_menor":
        base.sort((clienteA, clienteB) => (clienteA.totalGasto ?? 0) - (clienteB.totalGasto ?? 0));
        break;
      case "compras_maior":
        base.sort((clienteA, clienteB) => (clienteB.totalCompras ?? 0) - (clienteA.totalCompras ?? 0));
        break;
      case "compras_menor":
        base.sort((clienteA, clienteB) => (clienteA.totalCompras ?? 0) - (clienteB.totalCompras ?? 0));
        break;
    }

    return base;
  }, [clientes, filtroNome, filtroOrdem]);

  const listaClientes = clientesFiltrados.length > 0
    ? clientesFiltrados.map((cliente: any) => (
      <ClienteItem
        key={cliente.id}
        cliente={cliente}
        clientes={clientes}
        setClientes={setClientes}
      />
    ))
    : <p>Não há clientes para exibir.</p>;

  return (
    <>
      <Titulo />
      <section className='mt-[3rem] mb-[2rem] flex flex-col justify-center items-center'>
        <div className='w-[85.6875rem] flex flex-col gap-[1.44rem]'>
          <div className='flex flex-row items-center justify-between'>
            <div className='flex flex-row items-center gap-[0.7rem] justify-center'>
              <img src="/tabela.svg" className='w-[2rem] h-[2rem]' alt="" />
              <h2 className='text-center text-[2rem] font-inter font-semibold'>Clientes</h2>
            </div>
            <button onClick={() => setOpenAdicionarCliente(true)} className='flex text-white items-center justify-center rounded-[0.5rem] bg-[linear-gradient(139deg,_#114114_-40.56%,_#00C000_279.19%)] w-[12rem] h-[2.7rem] text-[1.25rem] font-roboto font-normal'>Adicionar
            </button>
          </div>

          <div className='bg-[#F5F5F5] px-[1.62rem] py-[1.93rem] rounded-[1rem] flex flex-col gap-[1.44rem]'>
            <div className='flex flex-row gap-[1.25rem] items-center'>
              <div className='relative'>
                <label className='absolute font-inter -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.6875rem] font-semibold tracking-wide'>
                  NOME
                </label>
                <input
                  type="text"
                  value={filtroNome}
                  onChange={(e) => setFiltroNome(e.target.value)}
                  placeholder="Filtrar por nome"
                  className='border-2 border-[#4A4B51] rounded-xl font-inter pl-4 w-[18rem] h-[2.75rem] placeholder:text-[1rem] placeholder:font-normal placeholder:text-[#828386] text-[#4A4B51] text-lg font-medium bg-[#F5F5F5] outline-none focus:border-[#407B6A] transition-colors'
                />
              </div>

              <div className='relative'>
                <label className='absolute font-inter -top-2 left-4 bg-[#F5F5F5] px-2 text-[#4A4B51] text-[0.6875rem] font-semibold tracking-wide'>
                  FILTRAR POR
                </label>
                <select value={filtroOrdem} onChange={(e) => setFiltroOrdem(e.target.value)} className='border-2 border-[#4A4B51] rounded-xl font-inter pl-4 pr-8 w-[16rem] h-[2.75rem] bg-[#F5F5F5] outline-none focus:border-[#407B6A]'>
                  <option value="">Nenhum</option>
                  <option value="gasto_maior">Total Gasto Maior</option>
                  <option value="gasto_menor">Total Gasto Menor</option>
                  <option value="compras_maior">Total Compras Maior</option>
                  <option value="compras_menor">Total Compras Menor</option>
                </select>
              </div>
            </div>

            <div className='flex flex-row justify-between font-inter text-[1rem] font-normal mt-4'>
              <h2>Nome</h2>
              <h2 className='relative left-[6.8rem]'>Total Gasto</h2>
              <h2 className='relative left-[5.6rem]'>Nº de Compras</h2>
              <h2 className='relative left-[5.7rem]'>Notas</h2>
              <h2 className='relative left-[2.5rem]'>Vendas Vinc.</h2>
              <h2 className=''>Opções</h2>
            </div>

            {listaClientes}
          </div>
        </div>
      </section >

      <Modal open={openAdicionarCliente} onClose={() => setOpenAdicionarCliente(false)}>
        <div className="container">
          <div className="container flex flex-col items-start">
            <div className='flex flex-row items-center gap-[0.7rem] justify-center'>
              <img src="/tabela.svg" className='w-[1.5rem] h-[1.5rem]' alt="" />
              <h2 className='text-center text-[1.4rem] font-inter font-semibold'>Adicionar Cliente</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit(incluirCliente)} className='container flex flex-col items-center'>
            <div className='flex flex-col items-center my-8 gap-8 w-[35rem]'>
              <div className='relative w-full'>
                <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                  NOME DO CLIENTE
                </label>
                <input
                  type="text"
                  placeholder='José Almeida'
                  className='w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                  id="nome"
                  required
                  {...register("nome")}
                />
              </div>

              <div className='relative w-full'>
                <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                  NOTAS
                </label>
                <input
                  type="text"
                  placeholder='Bom pagador.'
                  className='w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                  id="notas"
                  {...register("notas")}
                />
              </div>

              <div className='relative w-full'>
                <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                  ENDEREÇO
                </label>
                <input
                  type="text"
                  placeholder='R. Das Flores, 105 - Centro'
                  className='w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                  id="endereco"
                  {...register("endereco")}
                />
              </div>

              <div className='relative w-full'>
                <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                  TELEFONE
                </label>
                <input
                  type="text"
                  placeholder='Digite o Telefone'
                  className='w-full border-2 border-[#4A4B51] rounded-xl bg-white font-inter px-5 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-normal outline-none focus:border-[#407B6A] transition-colors'
                  id="telefone"
                  {...register("telefone")}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => setOpenAdicionarCliente(false)} className="text-white bg-[#292727] rounded-md px-6 py-2 text-[1rem] hover:bg-[#3a3939] font-bold font-inter hover:opacity-90 transition cursor-pointer">Cancelar</button>
              <button type='submit' className="text-white bg-[#308021] rounded-md px-6 py-2 text-[1rem] font-bold hover:opacity-90 font-inter transition cursor-pointer">Confirmar</button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  )
}