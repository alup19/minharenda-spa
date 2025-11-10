import type { UsuarioType } from "./UsuarioType.js"

export type ProdutoType = {
    id: number
    nome: string
    unidadeBase: string
    categoria: string
    margemPadrao: number
    saldoBase: number
    custoMedio: number
    anexo: String
    data: Date | String
    createdAt: Date
    updatedAt: Date
    usuarioId: string
    usuario: UsuarioType
}