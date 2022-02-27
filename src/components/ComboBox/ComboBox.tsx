import { useRef } from 'react'

import type { FC, ReactNode } from 'react'
import type { ItemBase } from './types'

import styles from './ComboBox.module.css'
import {
  useActiveIndex,
  useComboBoxExpand,
  useDebouncedInput,
  useKeyboardEvent,
} from './hooks'
import { DropdownInput, DropdownList } from './components'

export type Props<T extends ItemBase> = {
  accessibilityLabel?: string
  comboBoxId?: string
  displayText?: string
  onTextChange: (text: string) => void
  onSelectItem: (item: T) => void
  items: T[]
  isLoading?: boolean
  maxDisplayItems?: number
  itemHeight?: number
  renderItem: (item: T, isActive: boolean) => ReactNode
}

export function ComboBox<T extends ItemBase>({
  accessibilityLabel = 'search box',
  comboBoxId = 'cb1',
  displayText,
  onTextChange,
  onSelectItem: onSelect,
  items,
  isLoading,
  maxDisplayItems = 2,
  itemHeight = 60,
  renderItem,
}: Props<T>): ReturnType<FC<Props<T>>> {
  const inputRef = useRef<HTMLInputElement>(null)

  const { expand, collapse, toggleExpanded, isExpanded } =
    useComboBoxExpand(inputRef)

  const { inputValue, inputChangeHandler } = useDebouncedInput({
    initialInput: displayText,
    onChange: onTextChange,
  })

  const { activeIndex, goToNext, goToPrevious } = useActiveIndex({
    length: items.length,
  })

  const onSelectItem = (index?: number) => {
    const selectedItem = items[index ?? activeIndex]
    onSelect(selectedItem)
    onTextChange(selectedItem.name)
    collapse()
  }

  useKeyboardEvent({
    onEscape: collapse,
    onEnter: onSelectItem,
    onArrowUp: goToPrevious,
    onArrowDown: goToNext,
  })

  return (
    <div className={styles.comboBox}>
      <DropdownInput
        id={comboBoxId}
        ref={inputRef}
        accessibilityLabel={accessibilityLabel}
        isExpanded={isExpanded}
        inputValue={inputValue}
        onInputChange={inputChangeHandler}
        onFocus={expand}
        onBlur={collapse}
        onToggleExpand={toggleExpanded}
      />
      {isExpanded && (
        <div
          className={styles.dropdown}
          style={{
            '--item-height': `${itemHeight}px`,
            '--display-items': `${maxDisplayItems}`,
          }}
        >
          {isLoading && <p>Its loading...</p>}
          {!isLoading && items.length === 0 && <p>No matching result</p>}
          {!isLoading && items.length > 0 && (
            <DropdownList
              items={items}
              activeItemIndex={activeIndex}
              accessibilityLabel={accessibilityLabel}
              controlId={comboBoxId}
              onSelectItem={onSelectItem}
              renderItem={renderItem}
            />
          )}
        </div>
      )}
    </div>
  )
}
