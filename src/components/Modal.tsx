import type { ReactNode } from "react"

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export default function Modal({ open, onClose, children }: ModalProps) {
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 flex items-center justify-center z-50 transition-colors
        ${open ? "visible bg-black/50" : "invisible"}
      `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          relative bg-white rounded-2xl shadow-xl p-8 transition-all
          ${open ? "scale-100 opacity-100" : "scale-110 opacity-0"}
        `}
      >
        {children}
      </div>
    </div>
  )
}