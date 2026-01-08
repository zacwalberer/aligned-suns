import type { ReactNode, ReactElement } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps): ReactElement {
  return (
    <div
      className={`bg-gray-900 border border-gray-800 rounded-lg p-6 ${className}`}
    >
      {children}
    </div>
  )
}
