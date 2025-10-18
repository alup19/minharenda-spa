import type { UsuarioType } from '../utils/UsuarioType.js'
import { create } from 'zustand'

type UsuarioStore = {
    usuario: UsuarioType
    logaUsuario: (usuarioLogado: UsuarioType) => void
    deslogaUsuario: () => void
}

export const useUsuarioStore = create<UsuarioStore>((set) => ({
    usuario: {} as UsuarioType,
    logaUsuario: (usuarioLogado) => set({usuario: usuarioLogado}),
    deslogaUsuario: () => set({usuario: {} as UsuarioType})
}))