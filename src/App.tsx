import './tailwind.css'
import Titulo from './components/Titulo.js'
import Dashboard from './components/Dashboard.js'
import TopProdutos from './components/TopProdutos.js'
import TopClientes from './components/TopClientes.js'
import UltimasReceitas from './components/UltimasReceitas.js'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useUsuarioStore } from './context/UsuarioContext.js'
import UltimasDespesas from './components/UltimasDespesas.js'

const apiUrl = import.meta.env.VITE_API_URL;

export default function App() {
  const { usuario } = useUsuarioStore();

  const [receitas, setReceitas] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [despesas, setDespesas] = useState<any[]>([]);

  async function getReceitas() {
    if (!usuario?.id) return;

    try {
      const responseReceitas = await fetch(`${apiUrl}/receitas/dashboard/${usuario.id}`, {
        headers: { Authorization: `Bearer ${usuario.token}` },
      });
      const data = await responseReceitas.json();
      setReceitas(Array.isArray(data) ? data : data.receitas ?? []);
    } catch (error) {
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
      toast.error("Não foi possível carregar clientes.");
    }
  }

  async function getDespesas() {
  try {
    const resp = await fetch(`${apiUrl}/despesas/dashboard/${usuario.id}`, {
      headers: { Authorization: `Bearer ${usuario.token}` },
    });

    const data = await resp.json();
    setDespesas(Array.isArray(data) ? data : data.despesas ?? []);
  } catch (error) {
    toast.error("Não foi possível carregar despesas.");
  }
}

  useEffect(() => {
    getReceitas();
    getClientes();
    getDespesas();
  }, []);

  const listaReceitas = receitas.map((receita: any) => (
    <UltimasReceitas
      key={receita.id}
      receita={receita}
      receitas={receitas}
      setReceitas={setReceitas}
      clientes={clientes}
    />
  ));

  const listaDespesas = despesas.map((despesa: any) => (
    <UltimasDespesas
      key={despesa.id}
      despesa={despesa}
      despesas={despesas}
      setDespesas={setDespesas}
    />
  ));

  return (
    <>
      <Titulo />
      <section className='mt-[3rem] mb-[2rem] flex flex-col justify-center items-center gap-[2.63rem]'>
        <Dashboard />
        <section className='flex flex-row justify-between w-[83vw] items-start'>

          <section className='flex flex-col gap-[1rem] bg-[#F5F5F5] rounded-[1.275rem] px-[1.5625rem] py-[1.4375rem]'>
            <div className='flex flex-row items-center gap-[0.75rem]'>
              <img src="/tabela.svg" alt="" className='w-[1.675rem]' />
              <h3 className='font-inter text-[1.25rem] font-semibold'>Últimas Receitas</h3>
            </div>
            <hr className='h-[0.1225rem] bg-[#D9D9D9]' />
            {listaReceitas}
          </section>

          <section className='flex flex-col gap-[1rem] bg-[#F5F5F5] rounded-[1.275rem] px-[1.5625rem] py-[1.4375rem]'>
            <div className='flex flex-row items-center gap-[0.75rem]'>
              <img src="/tabela.svg" alt="" className='w-[1.675rem]' />
              <h3 className='font-inter text-[1.25rem] font-semibold'>Últimas Despesas</h3>
            </div>
            <hr className='h-[0.1225rem] bg-[#D9D9D9]' />
            {listaDespesas}
          </section>

          <section className='flex flex-col justify-center gap-4'>
            <section className='flex flex-row items-start gap-4'>
              <TopProdutos />
              <TopClientes />
            </section>

            {/* Falta fazer isso */}
            <section className='flex flex-col gap-[0.7rem] px-[1.5625rem] py-[1.0625rem] bg-[#F5F5F5] rounded-[1.275rem]'>
              <h1 className='text-center text-[#2A2A2A] font-semibold font-inter text-[1.25rem]'>Alerta Inteligente</h1>
              <hr className='h-[0.1225rem] bg-[#D9D9D9]' />
              <div className='flex flex-col items-center font-inter text-[#646464]'>
                <p>Seu maior gasto foi com impostos e taxas.</p>
                <p>O seu produto mais vendido foi Anzol.</p>
              </div>
            </section>

          </section>
        </section>
      </section>
    </>
  )
}