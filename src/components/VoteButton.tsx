'use client'

import { motion } from 'framer-motion'
import type { ReactElement } from 'react'
import type { VoteValue } from '@/types/vote'

interface VoteButtonProps {
  value: VoteValue
  selected: boolean
  disabled: boolean
  onClick: (value: VoteValue) => void
}

export function VoteButton({
  value,
  selected,
  disabled,
  onClick,
}: VoteButtonProps): ReactElement {
  const baseStyles = 'w-12 h-12 rounded-md font-bold text-lg transition-colors'
  const selectedStyles = selected
    ? 'bg-suns-orange text-white'
    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer'

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={() => !disabled && onClick(value)}
      disabled={disabled}
      type="button"
      className={`${baseStyles} ${selectedStyles} ${disabledStyles}`}
    >
      {value}
    </motion.button>
  )
}
