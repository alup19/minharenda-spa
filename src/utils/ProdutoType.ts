import type { UsuarioType } from "./UsuarioType.js"

export type ProdutoType = {
    id: number
    nome: string
    unidadeBase: string
    categoria: string
    margemPadrao: number
    saldoBase: number
    custoMedio: number
    createdAt: Date
    updatedAt: Date
    usuarioId: string
    usuario: UsuarioType
}