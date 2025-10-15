import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Registro() {
  const [name, setName] = useState('')
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value)
    setCpf(formatted)
  }

  return (
    <section className='flex flex-row'>
      <div className='min-w-[40vw] min-h-[100vh]'>
        <img src="login.png" alt="" className='h-[100vh]' />
      </div>

      <div className='min-w-[60vw] min-h-[100vh] flex items-center justify-center relative'>
        <Link to={"/login"} className='absolute top-12 text-center right-[6rem] w-[11.62rem] px-8 py-3 bg-[#E8F5EA] text-[#407B6A] font-roboto text-[1.125rem] font-medium rounded-[4.3125rem] hover:bg-[#C8E6C9] transition-colors'>
          Voltar
        </Link>
        <div>
          <div className='w-[27.5rem] flex flex-col gap-3'>
            <div className='flex flex-col'>
              <h1 className='font-roboto text-[#2A2A2A] text-[2.75rem] font-light'>Abra sua conta</h1>
              <h2 className='font-inter text-[#4A4B51] text-[1.06rem] font-normal'>
                Você está a poucos passos de criar uma conta.
              </h2>
            </div>

            <form className='flex flex-col gap-[2rem] mt-5 mb-4'>
              <div className='relative w-full'>
                <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                  SEU NOME
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Maiquel Caldeira Pereira Junior'
                  className='w-full border-2 border-[#4A4B51] rounded-xl font-inter px-4 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-medium bg-white outline-none focus:border-[#407B6A] transition-colors'
                />
              </div>

              <div className='relative w-full'>
                <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                  CPF
                </label>
                <input
                  type="text"
                  value={cpf}
                  onChange={handleCPFChange}
                  placeholder='000.000.000-00'
                  maxLength={14}
                  className='w-full border-2 border-[#4A4B51] rounded-xl font-inter px-4 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-medium bg-white outline-none focus:border-[#407B6A] transition-colors'
                />
              </div>

              <div className='relative w-full'>
                <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                  EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='contato@maiquel.dev'
                  className='w-full border-2 border-[#4A4B51] rounded-xl font-inter px-4 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-medium bg-white outline-none focus:border-[#407B6A] transition-colors'
                />
              </div>

              <div className='relative w-full'>
                <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                  CELULAR
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder='DDD + Celular'
                  className='w-full border-2 border-[#4A4B51] rounded-xl font-inter px-4 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-medium bg-white outline-none focus:border-[#407B6A] transition-colors'
                />
              </div>

              <div className='relative w-full'>
                <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                  SENHA
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='••••••••••••'
                  className='w-full border-2 border-[#4A4B51] rounded-xl font-inter px-4 py-3 placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51] text-lg font-medium bg-white outline-none focus:border-[#407B6A] transition-colors'
                />
              </div>
            </form>

            <div className='flex items-center gap-3'>
              <input
                id="acceptTerms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className='w-[1.10rem] h-[1.10rem] accent-[#407B6A] rounded-sm cursor-pointer'
              />
              <label htmlFor="acceptTerms" className='text-[#4A4B51] font-roboto text-[0.97rem] cursor-pointer font-normal'>
                Para continuar, é necessário aceitar nossos <span className='text-[#407B6A] underline'>termos de uso</span>.
              </label>
            </div>

            <button className="flex flex-col items-center rounded-[0.44938rem] py-3 font-roboto text-[1.5rem] text-[#fff] justify-center w-[27.rem] bg-[linear-gradient(139deg,_#114114_-40.56%,_#00C000_279.19%)] hover:opacity-90 transition-opacity mt-4">
              Continuar
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}