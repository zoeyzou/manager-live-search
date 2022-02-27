import { useEffect, useState } from 'react'

import type { RefObject } from 'react'

type Input = RefObject<HTMLInputElement>

type Output = {
  toggleExpanded: VoidFunction
  expand: VoidFunction
  collapse: VoidFunction
  isExpanded: boolean
}

export const useComboBoxExpand = (elementRef: Input): Output => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpanded = () => setIsExpanded((prevExpanded) => !prevExpanded)

  const expand = () => {
    setIsExpanded(true)
  }

  const collapse = () => setIsExpanded(false)

  useEffect(() => {
    if (isExpanded) {
      elementRef.current?.focus()
    } else {
      elementRef.current?.blur()
    }
  }, [isExpanded, elementRef])

  return {
    toggleExpanded,
    expand,
    collapse,
    isExpanded,
  }
}
