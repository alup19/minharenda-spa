import type { UsuarioType } from "./UsuarioType.js"

export type DespesaType = {
    id: number
    descricao: string
    valor: number
    categoria: string
    anexo: string
    data: Date
    createdAt: Date
    usuarioId: string
    usuario: UsuarioType
}