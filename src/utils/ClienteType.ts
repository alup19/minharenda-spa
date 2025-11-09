import type { UsuarioType } from "./UsuarioType.js"

export type ClienteType = {
    id: number
    nome: string
    endereco: string
    telefone: string
    notas: string
    usuarioId: string
    usuario: UsuarioType
    createdAt: Date
    updatedAt: Date
}