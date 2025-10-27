import type { ClienteType } from "./ClienteType.js"
import type { TagType } from "./TagType.js"
import type { UsuarioType } from "./UsuarioType.js"

export type CursoType = {
    id: number
    valor: number
    categoria: string
    anexo: string
    createdAt: Date
    updatedAt: Date
    usuarioId: string
    usuario: UsuarioType
    tagId: number
    tag: TagType
    clienteId: number
    cliente: ClienteType
}