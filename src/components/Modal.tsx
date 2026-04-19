'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 transition-opacity" 
        style={{ background: '#000000c0', backdropFilter: 'blur(3px)' }}
        onClick={onClose}
      />
      
      <div 
        className="relative w-full max-w-lg rounded-2xl shadow-2xl animate-fade-up overflow-hidden flex flex-col max-h-[90vh]" 
        style={{ background: '#12121c', border: '1px solid #2a2a3e' }}
      >
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: '#2a2a3e' }}>
          <h3 className="text-lg font-semibold" style={{ color: '#e8e8f0' }}>{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="p-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
