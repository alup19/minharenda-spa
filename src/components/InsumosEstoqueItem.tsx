export default function InsumosEstoqueItem({ produto }: { produto: any }) {
  return (
    <div className="bg-[#E2E2E2] py-[0.875rem] px-[1.06rem] rounded-[0.9375rem] flex flex-row justify-between items-center">
      <p className="text-[#656565] font-inter font-normal text-[1rem]">
        {produto.nome}
      </p>

      <p className="text-[#303030] font-inter font-semibold">
        {produto.saldoDisplay} {produto.unidadeDisplay}
      </p>

      <p className="text-[#656565] font-inter font-normal">
        R$ {produto.precoMedioDisplay?.toFixed(2)} /{produto.unidadeDisplay}
      </p>

      <p className="text-[#705519] font-inter text-[0.975rem] font-medium bg-[#F6DDA6] py-[0.10rem] px-[1.06rem] rounded-[0.46875rem] ">
        {produto.categoria?.replaceAll("_", " ") ?? "-"}
      </p>
    </div>
  );
}
