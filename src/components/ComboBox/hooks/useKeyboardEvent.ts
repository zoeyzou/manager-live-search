import { useEffect } from 'react'

type Input = {
  onEscape: VoidFunction
  onEnter: VoidFunction
  onArrowUp: VoidFunction
  onArrowDown: VoidFunction
}

type Key = 'Enter' | 'Escape' | 'ArrowDown' | 'ArrowUp'

export const useKeyboardEvent = ({
  onEnter,
  onEscape,
  onArrowUp,
  onArrowDown,
}: Input): void => {
  useEffect(() => {
    const keyboardEventHandler = (evt: KeyboardEvent) => {
      switch (evt.key as Key) {
        case 'Enter':
          onEnter()
          break
        case 'Escape':
          onEscape()
          break
        case 'ArrowDown':
          onArrowDown()
          break
        case 'ArrowUp':
          onArrowUp()
          break
        default:
          break
      }
    }

    document.addEventListener('keyup', keyboardEventHandler)

    return () => document.removeEventListener('keyup', keyboardEventHandler)
  }, [onEscape, onEnter, onArrowUp, onArrowDown])
}
