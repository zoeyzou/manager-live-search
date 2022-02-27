import { useCallback, useState } from 'react'

type Input = {
  length: number
  initialActiveIndex?: number
}

type Output = {
  activeIndex: number
  goToNext: VoidFunction
  goToPrevious: VoidFunction
}

export const useActiveIndex = ({
  length,
  initialActiveIndex = 0,
}: Input): Output => {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex)

  const goToNext = useCallback(
    () => setActiveIndex((prevIndex) => (prevIndex + 1) % length),
    [length]
  )

  const goToPrevious = useCallback(
    () => setActiveIndex((prevIndex) => (prevIndex + length - 1) % length),
    [length]
  )

  return { activeIndex, goToNext, goToPrevious }
}
