import type { FC, ReactNode } from 'react'

import type { ItemBase } from '../../types'

import styles from './DropdownList.module.css'
import { ListItem } from './components'

export type Props<T> = {
  accessibilityLabel?: string
  controlId?: string
  items: T[]
  activeItemIndex: number
  onSelectItem: (index: number) => void
  renderItem: (item: T, isActive: boolean) => ReactNode
}

export function DropdownList<T extends ItemBase>({
  accessibilityLabel = 'search box',
  controlId = 'cb1',
  items,
  activeItemIndex,
  onSelectItem,
  renderItem,
}: Props<T>): ReturnType<FC<Props<T>>> {
  return (
    <ul
      id={`${controlId}-listbox`}
      className={styles.listBox}
      role="listbox"
      aria-label={accessibilityLabel}
    >
      {items.map((item, index) => (
        <ListItem
          key={item.id}
          index={index}
          isActive={activeItemIndex === index}
          onSelect={onSelectItem}
        >
          {renderItem(item, activeItemIndex === index)}
        </ListItem>
      ))}
    </ul>
  )
}
