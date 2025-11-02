import type { FornecedorType } from "./FornecedorType.js"
import type { TagType } from "./TagType.js"
import type { UsuarioType } from "./UsuarioType.js"

export type DespesaType = {
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
    fornecedorId: number
    fornecedor: FornecedorType
}