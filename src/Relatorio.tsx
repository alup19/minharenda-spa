import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Titulo from "./components/Titulo";

type RelatorioItem = {
  label: string;
  value: string;
};

type Totais = {
  totalReceitas: number;
  totalDespesas: number;
  lucroLiquido: number;
};

type CategoriaContagem = {
  categoria: string;
  contagem: number;
};

type CategoriaValor = {
  categoria: string;
  valor: number;
};

type ProdutoMaisVendido = {
  nome: string;
  quantidade: number;
  unidade: string;
};

type ClienteResumo = {
  nome: string;
  totalGasto: number;
  contagem: number;
};

type EstoqueCategoria = {
  categoria: string;
  quantidade: number;
};

type EstoqueProdutoQtd = {
  produto: string;
  quantidade: number;
  unidade?: string;
};

type ReceitasResumo = {
  categoriasMaisVendidas: CategoriaContagem[];
  produtosMaisVendidos: ProdutoMaisVendido[];
  totalVendas: number;
  valorTotalVendas: number;
  vendasSemItens: number;
  vendasSemAnexo: number;
};

type DespesasResumo = {
  categoriasMaisDespesas: CategoriaContagem[];
  valorGastoCategorias: CategoriaValor[];
  despesasSemAnexo: number;
};

type ClientesResumo = {
  clientesQueMaisGastaram: ClienteResumo[];
  clientesComMaisCompras: ClienteResumo[];
  totalClientesRegistrados: number;
};

type EstoqueResumo = {
  categoriasEstoque: EstoqueCategoria[];
  maiorQtdUnidade: EstoqueProdutoQtd[];
  maiorQtdKg: EstoqueProdutoQtd[];
  maiorQtdMl: EstoqueProdutoQtd[];
};

type RelatorioResponse = {
  totais: Totais;
  receitas: ReceitasResumo;
  despesas: DespesasResumo;
  clientes: ClientesResumo;
  estoque: EstoqueResumo;
};

const apiUrl = import.meta.env.VITE_API_URL


export default function Relatorio() {
  const relatorioRef = useRef<HTMLDivElement | null>(null);

  const [relatorio, setRelatorio] = useState<RelatorioResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Descobrir usuarioId do localStorage
  let usuarioId: string | null = null;
  const usuarioRaw = localStorage.getItem("usuarioKey");

  if (usuarioRaw) {
    try {
      const parsed = JSON.parse(usuarioRaw);
      usuarioId = parsed?.id ?? parsed?.usuarioId ?? null;
    } catch {
      usuarioId = localStorage.getItem("usuarioKey");
    }
  } else {
    usuarioId = localStorage.getItem("usuarioKey");
  }

  useEffect(() => {
    if (!usuarioId) {
      console.warn("Nenhum usuarioId encontrado para carregar o relatório.");
      setLoading(false);
      return;
    }

    async function carregarRelatorio() {
      try {
        setLoading(true);

        const resposta = await fetch(
          `${apiUrl}/usuarios/relatorio/${usuarioId}`
        );

        if (!resposta.ok) {
          console.error(
            "Erro ao buscar relatório:",
            resposta.status,
            await resposta.text()
          );
          setRelatorio(null);
          return;
        }

        const dados = (await resposta.json()) as RelatorioResponse;
        setRelatorio(dados);
      } catch (error) {
        console.error("Erro ao carregar relatório:", error);
        setRelatorio(null);
      } finally {
        setLoading(false);
      }
    }

    carregarRelatorio();
  }, [usuarioId]);

  // Helpers de formatação
  function formatMoney(valor: number | undefined | null): string {
    const num = Number(valor ?? 0);
    return `R$ ${num.toFixed(2)}`;
  }

  // Estoque
  const categoriasEstoqueItems: RelatorioItem[] =
    relatorio?.estoque.categoriasEstoque.map((c) => ({
      label: c.categoria,
      value: `${c.quantidade} em estoque`,
    })) ?? [];

  const estoqueUnidadeItems: RelatorioItem[] =
    relatorio?.estoque.maiorQtdUnidade.map((p) => ({
      label: p.produto,
      value: `${p.quantidade} Unidades`,
    })) ?? [];

  const estoqueKgItems: RelatorioItem[] =
    relatorio?.estoque.maiorQtdKg.map((p) => ({
      label: p.produto,
      value: `${p.quantidade} ${p.unidade ?? "kg"}`,
    })) ?? [];

  const estoqueMlItems: RelatorioItem[] =
    relatorio?.estoque.maiorQtdMl.map((p) => ({
      label: p.produto,
      value: `${p.quantidade} ${p.unidade ?? "L"}`,
    })) ?? [];

  // Despesas
  const categoriasMaisDespesasItems: RelatorioItem[] =
    relatorio?.despesas.categoriasMaisDespesas.map((c) => ({
      label: c.categoria,
      value: `${c.contagem} despesas`,
    })) ?? [];

  const valorGastoCategoriasItems: RelatorioItem[] =
    relatorio?.despesas.valorGastoCategorias.map((c) => ({
      label: c.categoria,
      value: formatMoney(c.valor),
    })) ?? [];

  // Receitas
  const categoriasMaisVendidasItems: RelatorioItem[] =
    relatorio?.receitas.categoriasMaisVendidas.map((c) => ({
      label: c.categoria,
      value: `${c.contagem} vendas`,
    })) ?? [];

  const produtosMaisVendidosItems: RelatorioItem[] =
    relatorio?.receitas.produtosMaisVendidos.map((p) => ({
      label: p.nome,
      value: `${p.quantidade} ${p.unidade}`,
    })) ?? [];

  // Clientes
  const clientesMaisGastaramItems: RelatorioItem[] =
    relatorio?.clientes.clientesQueMaisGastaram.map((c) => ({
      label: c.nome,
      value: formatMoney(c.totalGasto),
    })) ?? [];

  const clientesMaisComprasItems: RelatorioItem[] =
    relatorio?.clientes.clientesComMaisCompras.map((c) => ({
      label: c.nome,
      value: `${c.contagem} compras`,
    })) ?? [];

  // PDF
  async function gerarPDF() {
    const element = relatorioRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      ignoreElements: (el) => el.classList?.contains("ignore-pdf"),
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pdfWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
    pdf.save("relatorio_mensal.pdf");
  }

  return (
    <section>
      <Titulo />

      <section
        ref={relatorioRef}
        className="mt-[3rem] mb-[2rem] flex flex-col justify-center items-center gap-[2.63rem]"
      >
        <div className="flex flex-row items-center justify-between w-[83vw]">
          <div className="flex flex-col items-start">
            <div className="flex flex-row items-center gap-[0.7rem] justify-center">
              <img src="/tabela.svg" className="w-[2rem] h-[2rem]" alt="" />
              <h2 className="text-center text-[2rem] font-inter font-semibold">
                Relatório
              </h2>
            </div>
            <h2 className="text-[#4A4B51] font-inter font-semibold">
              Maiquel, aqui está o seu relatório mensal.
            </h2>
          </div>
          <div className="flex flex-row gap-[2.25rem]">
            <button
              onClick={gerarPDF}
              className="ignore-pdf flex items-center gap-3 px-[0.9375rem] rounded-[0.375rem] border-[#969b96] border-2 py-[0.625rem] flex-row bg-[linear-gradient(139deg,#184047_-40.56%,#F89900_279.19%)]"
            >
              <img
                src="/relatorio-icon.svg"
                className="w-[1.25rem]"
                alt=""
              />
              <span className="font-inter text-white font-normal">
                Exportar relatório para PDF
              </span>
            </button>
          </div>
        </div>

        {/* CARD RESUMO FINANCEIRO */}
        <section className="bg-[#F5F5F5] rounded-[1.25rem] w-[83vw] flex items-center justify-center py-[2.3125rem]">
          <div className="flex items-stretch font-inter text-[1rem]">
            <div className="flex flex-col items-center justify-center px-[1.06rem]">
              <h2 className="text-[#4A4B51] font-semibold">Receita Total</h2>
              <h3 className="text-[#407B6A] font-medium text-[1.3rem]">
                {relatorio
                  ? formatMoney(relatorio.totais.totalReceitas)
                  : loading
                    ? "Carregando..."
                    : "R$ 0,00"}
              </h3>
            </div>
            <div className="w-[0.2rem] rounded-[0.9375rem] bg-[#B7BBC7] mx-[1.06rem]" />
            <div className="flex flex-col items-center justify-center px-[1.06rem]">
              <h2 className="text-[#4A4B51] font-semibold">
                Despesas Totais
              </h2>
              <h3 className="text-[#CA3030] font-medium text-[1.3rem]">
                {relatorio
                  ? formatMoney(relatorio.totais.totalDespesas)
                  : loading
                    ? "Carregando..."
                    : "R$ 0,00"}
              </h3>
            </div>
            <div className="w-[0.2rem] rounded-[0.9375rem] bg-[#B7BBC7] mx-[1.06rem]" />
            <div className="flex flex-col items-center justify-center px-[1.06rem]">
              <h2 className="text-[#4A4B51] font-semibold">Lucro Líquido</h2>
              <h3 className="text-[#407B6A] font-medium text-[1.3rem]">
                {relatorio
                  ? formatMoney(relatorio.totais.lucroLiquido)
                  : loading
                    ? "Carregando..."
                    : "R$ 0,00"}
              </h3>
            </div>
          </div>
        </section>

        <section className="flex flex-row gap-[2.19rem]">
          {/* ESTOQUE */}
          <div className="flex flex-col items-center gap-[0.5rem]">
            <h2 className="text-center text-[2rem] font-inter font-semibold">
              Estoque
            </h2>
            <div className="flex flex-col bg-[#F5F5F5] px-[2rem] py-[1.8125rem] rounded-[0.9375rem] gap-[0.91rem]">
              <p className="text-[#4A4B51] font-inter text-[1.25rem] font-medium">
                Categorias com maior itens em estoque:
              </p>
              <div className="flex flex-col gap-[0.5rem]">
                {categoriasEstoqueItems.length ? (
                  categoriasEstoqueItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]"
                    >
                      <p className="font-inter font-normal text-[#656565]">
                        {item.label}
                      </p>
                      <p className="font-inter font-semibold text-[#4d4d4d]">
                        {item.value}
                      </p>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-[#777]">
                    {loading ? "Carregando..." : "Sem dados de estoque"}
                  </span>
                )}
              </div>

              <p className="text-[#4A4B51] font-inter text-[1.25rem] font-medium">
                Maior quantidade em estoque (un):
              </p>
              <div className="flex flex-col gap-[0.5rem]">
                {estoqueUnidadeItems.length ? (
                  estoqueUnidadeItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]"
                    >
                      <p className="font-inter font-normal text-[#656565]">
                        {item.label}
                      </p>
                      <p className="font-inter font-semibold text-[#4d4d4d]">
                        {item.value}
                      </p>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-[#777]">
                    {loading ? "Carregando..." : "Sem dados de estoque (un)"}
                  </span>
                )}
              </div>

              <p className="text-[#4A4B51] font-inter text-[1.25rem] font-medium">
                Maior quantidade em estoque (kg):
              </p>
              <div className="flex flex-col gap-[0.5rem]">
                {estoqueKgItems.length ? (
                  estoqueKgItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]"
                    >
                      <p className="font-inter font-normal text-[#656565]">
                        {item.label}
                      </p>
                      <p className="font-inter font-semibold text-[#4d4d4d]">
                        {item.value}
                      </p>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-[#777]">
                    {loading ? "Carregando..." : "Sem dados de estoque (kg)"}
                  </span>
                )}
              </div>

              <p className="text-[#4A4B51] font-inter text-[1.25rem] font-medium">
                Maior quantidade em estoque (L):
              </p>
              <div className="flex flex-col gap-[0.5rem]">
                {estoqueMlItems.length ? (
                  estoqueMlItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]"
                    >
                      <p className="font-inter font-normal text-[#656565]">
                        {item.label}
                      </p>
                      <p className="font-inter font-semibold text-[#4d4d4d]">
                        {item.value}
                      </p>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-[#777]">
                    {loading ? "Carregando..." : "Sem dados de estoque (L)"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* DESPESAS */}
          <div className="flex flex-col items-center gap-[0.5rem]">
            <h2 className="text-center text-[2rem] font-inter font-semibold">
              Despesas
            </h2>
            <div className="flex flex-col bg-[#F5F5F5] px-[2rem] py-[1.8125rem] rounded-[0.9375rem] gap-[0.91rem]">
              <p className="text-[#4A4B51] font-inter text-[1.25rem] font-medium">
                Categorias com mais despesas:
              </p>
              <div className="flex flex-col gap-[0.5rem]">
                {categoriasMaisDespesasItems.length ? (
                  categoriasMaisDespesasItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]"
                    >
                      <p className="font-inter font-normal text-[#656565]">
                        {item.label}
                      </p>
                      <p className="font-inter font-semibold text-[#4d4d4d]">
                        {item.value}
                      </p>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-[#777]">
                    {loading ? "Carregando..." : "Sem dados de despesas"}
                  </span>
                )}
              </div>

              <p className="text-[#4A4B51] font-inter text-[1.25rem] font-medium">
                Valor gasto em Categorias:
              </p>
              <div className="flex flex-col gap-[0.5rem]">
                {valorGastoCategoriasItems.length ? (
                  valorGastoCategoriasItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]"
                    >
                      <p className="font-inter font-normal text-[#656565]">
                        {item.label}
                      </p>
                      <p className="font-inter font-semibold text-[#4d4d4d]">
                        {item.value}
                      </p>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-[#777]">
                    {loading ? "Carregando..." : "Sem dados de valores"}
                  </span>
                )}
              </div>

              <p className="text-[#4A4B51] font-inter text-[1.25rem] font-medium">
                Em setembro, você:
              </p>
              <div className="flex flex-col gap-[0.5rem]">
                <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                  <p className="font-inter font-normal text-[#656565]">
                    Realizou{" "}
                    <span className="font-semibold text-[#4d4d4d]">
                      {relatorio?.despesas.despesasSemAnexo ?? 0}
                    </span>{" "}
                    despesas sem anexos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RECEITAS */}
          <div className="flex flex-col items-center gap-[0.5rem]">
            <h2 className="text-center text-[2rem] font-inter font-semibold">
              Receitas
            </h2>
            <div className="flex flex-col bg-[#F5F5F5] px-[2rem] py-[1.8125rem] rounded-[0.9375rem] gap-[0.91rem]">
              <p className="text-[#4A4B51] font-inter text-[1.25rem] font-medium">
                Categorias mais vendidas:
              </p>
              <div className="flex flex-col gap-[0.5rem]">
                {categoriasMaisVendidasItems.length ? (
                  categoriasMaisVendidasItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]"
                    >
                      <p className="font-inter font-normal text-[#656565]">
                        {item.label}
                      </p>
                      <p className="font-inter font-semibold text-[#4d4d4d]">
                        {item.value}
                      </p>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-[#777]">
                    {loading ? "Carregando..." : "Sem dados de vendas"}
                  </span>
                )}
              </div>

              <p className="text-[#4A4B51] font-inter text-[1.25rem] font-medium">
                Produtos mais vendidos:
              </p>
              <div className="flex flex-col gap-[0.5rem]">
                {produtosMaisVendidosItems.length ? (
                  produtosMaisVendidosItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]"
                    >
                      <p className="font-inter font-normal text-[#656565]">
                        {item.label}
                      </p>
                      <p className="font-inter font-semibold text-[#4d4d4d]">
                        {item.value}
                      </p>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-[#777]">
                    {loading ? "Carregando..." : "Sem dados de produtos"}
                  </span>
                )}
              </div>

              <p className="text-[#4A4B51] font-inter text-[1.25rem] font-medium">
                Em setembro, você:
              </p>
              <div className="flex flex-col gap-[0.5rem]">
                <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                  <p className="font-inter font-normal text-[#656565]">
                    Realizou{" "}
                    <span className="font-semibold text-[#4d4d4d]">
                      {relatorio?.receitas.totalVendas ?? 0}
                    </span>{" "}
                    vendas
                  </p>
                </div>
                <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                  <p className="font-inter font-normal text-[#656565]">
                    Obteve{" "}
                    <span className="font-semibold text-[#4d4d4d]">
                      {formatMoney(
                        relatorio?.receitas.valorTotalVendas ?? 0
                      )}
                    </span>{" "}
                    em vendas.
                  </p>
                </div>
                <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                  <p className="font-inter font-normal text-[#656565]">
                    Realizou{" "}
                    <span className="font-semibold text-[#4d4d4d]">
                      {relatorio?.receitas.vendasSemItens ?? 0}
                    </span>{" "}
                    vendas sem itens.
                  </p>
                </div>
                <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                  <p className="font-inter font-normal text-[#656565]">
                    Realizou{" "}
                    <span className="font-semibold text-[#4d4d4d]">
                      {relatorio?.receitas.vendasSemAnexo ?? 0}
                    </span>{" "}
                    vendas sem anexos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CLIENTES */}
          <div className="flex flex-col items-center gap-[0.5rem]">
            <h2 className="text-center text-[2rem] font-inter font-semibold">
              Clientes
            </h2>
            <div className="flex flex-col bg-[#F5F5F5] px-[2rem] py-[1.8125rem] rounded-[0.9375rem] gap-[0.91rem]">
              <p className="text-[#4A4B51] font-inter text-[1.25rem] font-medium">
                Os que mais gastaram:
              </p>
              <div className="flex flex-col gap-[0.5rem]">
                {clientesMaisGastaramItems.length ? (
                  clientesMaisGastaramItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]"
                    >
                      <p className="font-inter font-normal text-[#656565]">
                        {item.label}
                      </p>
                      <p className="font-inter font-semibold text-[#4d4d4d]">
                        {item.value}
                      </p>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-[#777]">
                    {loading ? "Carregando..." : "Sem dados de clientes"}
                  </span>
                )}
              </div>

              <p className="text-[#4A4B51] font-inter text-[1.25rem] font-medium">
                Com maior número de compras:
              </p>
              <div className="flex flex-col gap-[0.5rem]">
                {clientesMaisComprasItems.length ? (
                  clientesMaisComprasItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]"
                    >
                      <p className="font-inter font-normal text-[#656565]">
                        {item.label}
                      </p>
                      <p className="font-inter font-semibold text-[#4d4d4d]">
                        {item.value}
                      </p>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-[#777]">
                    {loading ? "Carregando..." : "Sem dados de clientes"}
                  </span>
                )}
              </div>

              <p className="text-[#4A4B51] font-inter text-[1.25rem] font-medium">
                Em setembro, você:
              </p>
              <div className="flex flex-col gap-[0.5rem]">
                <div className="flex flex-row justify-between bg-[#E2E2E2] rounded-[0.9375rem] px-[1.06rem] py-[0.875rem]">
                  <p className="font-inter font-normal text-[#656565]">
                    Registrou{" "}
                    <span className="font-semibold text-[#4d4d4d]">
                      {relatorio?.clientes.totalClientesRegistrados ?? 0}
                    </span>{" "}
                    clientes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </section>
  );
}
