import type { UsuarioType } from "./UsuarioType.js"

export type ClienteType = {
    id: number
    produto: string
    qtd_gramas: number
    valorTotal: number
    valorKG: number
    valorGM: number
    usuarioId: string
    usuario: UsuarioType
}