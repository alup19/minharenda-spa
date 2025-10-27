import type { UsuarioType } from "./UsuarioType.js"

export type ClienteType = {
    id: number
    nome: string
    totalGasto: number
    numCompras: number
    usuarioId: string
    usuario: UsuarioType
}