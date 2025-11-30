import './tailwind.css'

import { useState } from 'react';
import { 
  Menu, 
  X, 
  Check, 
  ChevronDown, 
  TrendingUp, 
  NotebookPen, 
  PieChart, 
  ArrowRight,
  ShieldCheck,
  Wifi,
  Smartphone
} from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const faqData = [
    {
      question: "Preciso de internet o tempo todo?",
      answer: "O MinhaRenda funciona melhor com internet para garantir que seus dados estejam salvos na nuvem em tempo real, mas estamos trabalhando em funcionalidades offline para futuras atualizações."
    },
    {
      question: "Meus dados estão seguros?",
      answer: "Sim! Utilizamos criptografia de ponta e servidores seguros para garantir que apenas você tenha acesso às informações financeiras do seu negócio."
    },
    {
      question: "É difícil de mexer?",
      answer: "Não. O aplicativo foi desenhado especificamente para substituir o caderno, focando na simplicidade visual sem gráficos complexos ou termos técnicos difíceis."
    }
  ];

  return (
    // AQUI ESTÁ A MUDANÇA: troquei font-sans por font-inter
    <div className="min-h-screen bg-[#F9FAFB] font-inter text-gray-900 selection:bg-[#2E8B57] selection:text-white">
      
      {/* --- HEADER --- */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer">
              <img src="/logo.png" className='w-[15rem]' alt="" />
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-8 items-center">
              <a href="#funcionalidades" className="text-gray-600 hover:text-[#2E8B57] font-medium transition-colors">Funcionalidades</a>
              <a href="#depoimentos" className="text-gray-600 hover:text-[#2E8B57] font-medium transition-colors">Quem usa</a>
              <a href="#planos" className="text-gray-600 hover:text-[#2E8B57] font-medium transition-colors">Planos</a>
              <a href="#faq" className="text-gray-600 hover:text-[#2E8B57] font-medium transition-colors">Dúvidas</a>
              <button className="bg-[#2E8B57] hover:bg-[#246e45] text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-lg shadow-[#2E8B57]/20 hover:shadow-[#2E8B57]/40">
                Entrar
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <a href="#funcionalidades" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md">Funcionalidades</a>
              <a href="#depoimentos" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md">Quem usa</a>
              <a href="#planos" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md">Planos</a>
              <a href="#faq" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md">Dúvidas</a>
              <button className="w-full mt-4 bg-[#2E8B57] text-white px-6 py-3 rounded-lg font-semibold">
                Entrar na conta
              </button>
            </div>
          </div>
        )}
      </header>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-to-b from-white via-white to-[#F0FDF4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Abandone o caderninho.<br />
            Tenha o <span className="text-[#2E8B57]">controle total</span> na palma da mão.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            O aplicativo financeiro feito para MEIs e Autônomos que não têm tempo a perder com sistemas complicados. Controle vendas, estoque e lucro de forma simples.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button className="w-full sm:w-auto bg-[#2E8B57] hover:bg-[#246e45] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-[#2E8B57]/30 hover:transform hover:-translate-y-1">
              Começar Grátis
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-gray-700 bg-white border border-gray-200 hover:border-[#2E8B57] hover:text-[#2E8B57] transition-all flex items-center justify-center gap-2">
              Saber mais <ArrowRight size={18} />
            </button>
          </div>

          {/* App Mockup Placeholder */}
          <div className="relative mx-auto max-w-5xl">
            <div className="relative rounded-2xl bg-gray-900 p-2 sm:p-4 shadow-2xl ring-1 ring-gray-900/10">
              <div className="relative rounded-lg bg-gray-800 overflow-hidden aspect-[16/9] flex items-center justify-center">
                <img 
                   src="https://placehold.co/1200x675/1e293b/FFF?text=Dashboard+MinhaRenda" 
                   alt="App Dashboard" 
                   className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PAIN POINTS (DORES) --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Você sente que trabalha muito,<br />mas não vê o dinheiro sobrar?
            </h2>
            <p className="text-lg text-gray-600">
              O "caderninho" e as anotações soltas podem estar sabotando o crescimento silencioso do seu negócio.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <NotebookPen className="w-10 h-10 text-[#2E8B57]" />,
                title: "Anotações Perdidas",
                desc: "O caderno rasga, a folha se perde e você fica sem histórico. Nunca mais perca uma venda anotada."
              },
              {
                icon: <TrendingUp className="w-10 h-10 text-[#2E8B57]" />,
                title: "Dúvida no Lucro",
                desc: "Vendeu bem, mas sobrou dinheiro? Saiba a verdade sobre seu lucro líquido descontando as despesas."
              },
              {
                icon: <PieChart className="w-10 h-10 text-[#2E8B57]" />,
                title: "Tecnologia Complicada",
                desc: "Cansado de apps cheios de gráficos que ninguém entende? O MinhaRenda é direto ao ponto."
              }
            ].map((card, index) => (
              <div key={index} className="group p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#2E8B57]/30 transition-all duration-300">
                <div className="bg-[#F0FDF4] w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section id="funcionalidades" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          
          {/* Feature 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="lg:w-1/2">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Fluxo de Caixa Real</h3>
              <p className="text-lg text-gray-600 mb-8">
                Registre vendas e despesas em segundos. O app calcula o lucro líquido do dia, semana ou mês automaticamente, sem que você precise usar calculadora.
              </p>
              <ul className="space-y-4">
                {['Registro rápido de vendas', 'Controle de despesas fixas', 'Visão clara do Lucro Líquido'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                      <Check size={14} className="text-[#2E8B57]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:w-1/2 w-full bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
               <img src="https://placehold.co/800x600/f1f5f9/cbd5e1?text=Tela+de+Vendas" alt="Tela de Vendas" className="rounded-xl w-full" />
            </div>
          </div>

          {/* Feature 2 (Reverse) */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
            <div className="lg:w-1/2">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Estoque Inteligente</h3>
              <p className="text-lg text-gray-600 mb-8">
                Nunca mais deixe faltar produto e evite desperdícios. O app desconta o estoque automaticamente a cada venda realizada, mantendo tudo organizado.
              </p>
              <ul className="space-y-4">
                {['Atualização automática pós-venda', 'Cadastro de insumos e produtos', 'Alertas de estoque baixo'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                      <Check size={14} className="text-[#2E8B57]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:w-1/2 w-full bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
               <img src="https://placehold.co/800x600/f1f5f9/cbd5e1?text=Tela+de+Estoque" alt="Tela de Estoque" className="rounded-xl w-full" />
            </div>
          </div>
          
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section id="depoimentos" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Feito para a sua realidade</h2>
            <p className="text-lg text-gray-600">Veja como o MinhaRenda ajuda empreendedores como você.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Samira", role: "Dona de Mercearia", quote: "Eu perdia horas somando o caderno no fim do dia e sempre achava erros. Agora sei meu lucro na hora, sem dor de cabeça." },
              { name: "João Felipe", role: "Técnico e Freelancer", quote: "Como freelancer, eu misturava o dinheiro pessoal com o do trabalho. O app organizou meus orçamentos e clientes." },
              { name: "Cláudia", role: "Vendedora de Roupas", quote: "Controlo meu estoque de roupas e as cobranças de clientes (fiado) na rua, direto pelo celular. Não perco mais vendas." }
            ].map((person, i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#2E8B57] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {person.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{person.name}</h4>
                    <span className="text-sm text-gray-500">{person.role}</span>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{person.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING --- */}
      <section id="planos" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cresça no seu ritmo</h2>
            <p className="text-lg text-gray-600">Comece grátis e evolua conforme seu negócio cresce.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
              <h3 className="text-xl font-bold text-gray-900">MinhaRenda Básico</h3>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-gray-900">Grátis</span>
              </div>
              <p className="text-gray-500 mb-8">O essencial para organizar o negócio.</p>
              <ul className="space-y-4 mb-8 flex-1">
                {['Registro de Vendas', 'Registro de Despesas', 'Controle Básico de Estoque', 'Sem custos escondidos'].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-600">
                    <Check size={18} className="text-[#2E8B57]" /> {feat}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 px-6 rounded-lg font-bold border-2 border-gray-200 text-gray-700 hover:border-[#2E8B57] hover:text-[#2E8B57] transition-all">
                Criar Conta Grátis
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-white p-8 rounded-2xl border-2 border-[#2E8B57] shadow-xl relative flex flex-col transform md:-translate-y-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2E8B57] text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide">
                MAIS POPULAR
              </div>
              <h3 className="text-xl font-bold text-gray-900">MinhaRenda Premium</h3>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-gray-900">R$ 29,90</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <p className="text-gray-500 mb-8">Recursos avançados para lucrar mais.</p>
              <ul className="space-y-4 mb-8 flex-1">
                {['Tudo do plano Básico', 'Cálculo automático de Lucro', 'Gestão de Clientes (Fiado)', 'Relatórios em PDF e Excel', 'Indicadores de Desempenho'].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                    <div className="bg-[#DCFCE7] p-1 rounded-full">
                      <Check size={14} className="text-[#2E8B57]" />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 px-6 rounded-lg font-bold bg-[#2E8B57] text-white hover:bg-[#246e45] shadow-lg shadow-[#2E8B57]/20 transition-all">
                Testar Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Perguntas Frequentes</h2>
          
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex justify-between items-center p-5 bg-white hover:bg-gray-50 text-left"
                >
                  <span className="font-semibold text-gray-900 text-lg">{item.question}</span>
                  <ChevronDown 
                    className={`text-gray-500 transition-transform duration-300 ${activeAccordion === index ? 'rotate-180' : ''}`} 
                  />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 bg-gray-50 ${activeAccordion === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="p-5 text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center gap-2 mb-8">
            <img src="/logo2.png" className='w-[20rem]' alt="" />
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Suporte</a>
          </div>

          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} MinhaRenda. Simplificando a gestão do microempreendedor.
          </p>
        </div>
      </footer>

    </div>
  );
}

export default App;