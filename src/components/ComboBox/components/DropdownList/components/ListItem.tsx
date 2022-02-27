import { KeyboardEventHandler, useEffect, useRef } from 'react'

import type { FC } from 'react'

type Props = {
  isActive: boolean
  index: number
  onSelect: (index: number) => void
}

export const ListItem: FC<Props> = ({
  isActive,
  index,
  onSelect,
  children,
}) => {
  const itemRef = useRef<HTMLLIElement>(null)
  useEffect(() => {
    if (isActive && itemRef.current) {
      itemRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isActive])

  const onPressEnter: KeyboardEventHandler<HTMLLIElement> = (evt) => {
    if (evt.code === 'Enter') {
      onSelect(index)
    }
  }

  const selectHandler = () => onSelect(index)

  return (
    <li
      ref={itemRef}
      onKeyUp={onPressEnter}
      onMouseDown={(e) => e.preventDefault()}
      onClick={selectHandler}
      role="option"
      style={{ height: 'var(--item-height)' }}
      aria-selected={isActive ? 'true' : 'false'}
    >
      {children}
    </li>
  )
}
