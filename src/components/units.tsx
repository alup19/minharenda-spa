export type Unidade = "UN" | "G" | "KG" | "ML" | "L";

export function toBase(qtd: number, u: Unidade) {
  if (u === "UN") return qtd;
  if (u === "G")  return qtd;
  if (u === "KG") return qtd * 1000;
  if (u === "ML") return qtd;
  if (u === "L")  return qtd * 1000;
  return qtd;
}

export function parseQuantidade(input: string | number, unidadeBase: Unidade): number {
  const raw = String(input).trim().toLowerCase().replace(',', '.');
  const n   = parseFloat(raw.replace(/[^\d.]/g, "")) || 0;

  if (unidadeBase === "UN") return n;
  if (raw.includes("kg")) return toBase(n, "KG");
  if (raw.includes("g"))  return toBase(n, "G");
  if (raw.includes("l") && !raw.includes("ml")) return toBase(n, "L");
  if (raw.includes("ml")) return toBase(n, "ML");

  return toBase(n, unidadeBase);
}
