import { KeyboardEventHandler, useEffect, useRef } from 'react'

import type { FC } from 'react'

type Props = {
  isActive: boolean
  onSelect: VoidFunction
}

export const ListItem: FC<Props> = ({ isActive, onSelect, children }) => {
  const itemRef = useRef<HTMLLIElement>(null)
  useEffect(() => {
    if (isActive) {
      itemRef.current?.scrollIntoView()
    }
  }, [isActive])

  const onPressEnter: KeyboardEventHandler<HTMLLIElement> = (evt) => {
    if (evt.code === 'Enter') {
      onSelect()
    }
  }

  return (
    <li
      ref={itemRef}
      onKeyUp={onPressEnter}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onSelect}
      role="option"
      style={{ height: 'var(--item-height)' }}
      aria-selected={isActive ? 'true' : 'false'}
    >
      {children}
    </li>
  )
}
