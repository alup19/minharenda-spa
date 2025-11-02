import type { UsuarioType } from "./UsuarioType.js"

export type ClienteType = {
    id: number
    nome: string
    notas: string
    endereco: string
    totalGasto: number
    numCompras: number
    usuarioId: string
    usuario: UsuarioType
}