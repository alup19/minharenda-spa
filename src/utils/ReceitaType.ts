import type { ClienteType } from "./ClienteType.js"
import type { UsuarioType } from "./UsuarioType.js"

export type ReceitaType = {
    id: number
    descricao: string
    valor: number
    categoria: string
    anexo: string
    data: Date
    createdAt: Date
    usuarioId: string
    usuario: UsuarioType
    clienteId: number
    cliente: ClienteType
}