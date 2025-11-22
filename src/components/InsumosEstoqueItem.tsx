export default function InsumosEstoqueItem({ produto }: { produto: any }) {
  const categoriaBadge =
    produto.categoria && produto.categoria.trim() !== ""
      ? produto.categoria.replaceAll("_", " ")
      : "SEM CATEGORIA";

  return (
    <div className="bg-[#E2E2E2] py-[0.875rem] px-[1.06rem] rounded-[0.9375rem] grid grid-cols-4 items-center gap-2">
      <p className="text-[#656565] font-inter font-normal text-[1rem]">
        {produto.nome}
      </p>

      <p className="text-[#303030] font-inter font-semibold text-center">
        {produto.saldoDisplay} {produto.unidadeDisplay}
      </p>

      <p className="text-[#656565] font-inter font-normal text-center">
        R$ {produto.precoMedioDisplay?.toFixed(2)} /{produto.unidadeDisplay}
      </p>

      <p className="text-[#705519] font-inter text-[0.975rem] font-medium bg-[#F6DDA6] py-[0.10rem] px-[1.06rem] rounded-[0.46875rem] text-center">
        {categoriaBadge}
      </p>
    </div>
  );
}
