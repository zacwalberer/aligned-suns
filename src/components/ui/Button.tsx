'use client'

import { motion } from 'framer-motion'
import type { ReactNode, ReactElement } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  type?: 'button' | 'submit'
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
}: ButtonProps): ReactElement {
  const baseStyles =
    'uppercase tracking-widest text-xs transition-colors focus:outline-none'

  const variantStyles = {
    primary:
      'border border-gray-700 text-gray-100 hover:bg-gray-900',
    secondary:
      'border border-gray-800 text-gray-400 hover:text-gray-100 hover:border-gray-700',
    ghost: 'text-gray-400 hover:text-gray-100',
  }

  const sizeStyles = {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4',
  }

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer'

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
    >
      {children}
    </motion.button>
  )
}
