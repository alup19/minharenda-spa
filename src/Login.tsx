import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useUsuarioStore } from './context/UsuarioContext.js'
import { toast } from 'sonner'

type Inputs = {
  email: string
  senha: string
  manter: boolean
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Login() {
  const { register, handleSubmit } = useForm<Inputs>()
  const { logaUsuario } = useUsuarioStore()

  const navigate = useNavigate()

  async function fazerLogin(data: Inputs) {
    const response = await fetch(`${apiUrl}/login`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ email: data.email, senha: data.senha })
      })

    if (response.status == 200) {
      const dados = await response.json()

      logaUsuario(dados)

      if (data.manter) {
        localStorage.setItem("usuarioKey", dados.id)
      } else {
        if (localStorage.getItem("usuarioKey")) {
          localStorage.removeItem("usuarioKey")
        }
      }

      navigate("/")
    } else {
      toast.error("Erro... Login ou senha incorretos")
    }
  }

  return (
    <section className='flex flex-row'>
      <div className='min-w-[45vw] min-h-[100vh]'>
        <img src="login.png" alt="" className='h-[100vh]' />
      </div>

      <div className='min-w-[55vw] min-h-[100vh] flex items-center justify-center relative'>
        {/* <Link to={"/"} className='absolute text-center top-12 right-[6rem] w-[11.62rem] px-8 py-3 bg-[#E8F5EA] text-[#407B6A] font-roboto text-[1.125rem] font-medium rounded-[4.3125rem] hover:bg-[#C8E6C9] transition-colors'>
          Voltar
        </Link> */}
        <div>
          <div className='w-[27.5rem] h-[29.43rem] flex flex-col gap-3'>
            <div className='flex flex-col'>
              <h1 className='font-roboto text-[#2A2A2A] text-[2.75rem] font-light'>Acesse sua conta</h1>
              <h2 className='font-inter text-[#4A4B51] text-[1.06rem] font-normal'>
                Não possui uma conta? <Link to={"/registro"} className='text-[#407B6A] font-semibold underline'>Crie agora</Link>.
              </h2>
            </div>

            <form className='flex flex-col gap-[1.125rem] mt-5 mb-4'>
              <div className='relative w-full mb-4'>
                <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                  SEU EMAIL
                </label>
                <input type="email" required {...register("email")}
                  placeholder='felipesilveira@gmail.com' className='w-full border-2 border-[#4A4B51] rounded-xl font-inter px-4 py-3  placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51]  text-lg font-medium bg-white outline-none focus:border-[#407B6A] transition-colors' />
              </div>

              <div className='relative w-full'>
                <label className='absolute font-inter -top-2 left-4 bg-white px-2 text-[#4A4B51] text-[0.78rem] font-semibold tracking-wide'>
                  SENHA
                </label>
                <input type="password" required {...register("senha")}
                  placeholder='••••••••••' className='w-full border-2 border-[#4A4B51] rounded-xl font-inter px-4 py-3  placeholder:text-[1.1rem] placeholder:text-[#828386] text-[#4A4B51]  text-lg font-medium bg-white outline-none focus:border-[#407B6A] transition-colors' />
              </div>
              <div className='flex items-center gap-3'>
                <input id="rememberMe" type="checkbox" {...register("manter")}
                  className='w-[1.10rem] h-[1.10rem] accent-[#407B6A] rounded-sm cursor-pointer' />
                <label htmlFor="rememberMe" className='text-[#4A4B51] font-roboto text-[1.06rem] cursor-pointer font-normal'>
                  Mantenha-me conectado
                </label>
              </div>
              <h3 className='font-roboto text-[#407B6A] text-[1.09rem] font-normal'>Esqueceu a senha?</h3>
              <input
                onClick={handleSubmit(fazerLogin)}
                type="submit"
                value="Continuar"
                className="flex flex-col text-center rounded-[0.44938rem] py-3 font-roboto text-[1.5rem] text-[#fff] justify-center w-[27.rem] bg-[linear-gradient(139deg,_#114114_-40.56%,_#00C000_279.19%)] hover:opacity-90 transition-opacity cursor-pointer" />
            </form>

          </div>
        </div>
      </div>
    </section>
  )
}