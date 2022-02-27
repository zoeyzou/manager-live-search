import { forwardRef } from 'react'
import cn from 'classnames'

import type { ChangeEvent, FocusEventHandler } from 'react'

import styles from './DropdownInput.module.css'

type Props = {
  id: string
  accessibilityLabel?: string
  isExpanded: boolean
  inputValue: string
  onInputChange: (evt: ChangeEvent<HTMLInputElement>) => void
  onFocus: FocusEventHandler
  onBlur: FocusEventHandler
  onToggleExpand: VoidFunction
}

export const DropdownInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      id,
      accessibilityLabel = 'search input',
      isExpanded,
      inputValue,
      onInputChange,
      onFocus,
      onBlur,
      onToggleExpand,
    },
    inputRef
  ) => (
    <div className={cn(styles.dropdownInput, { [styles.focus]: isExpanded })}>
      <input
        ref={inputRef}
        id={`${id}-input`}
        className={styles.edit}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-expanded={isExpanded ? 'true' : 'false'}
        aria-controls={`${id}-listbox`}
        value={inputValue}
        placeholder="Choose an item"
        onChange={onInputChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={onToggleExpand}
        id={`${id}-button`}
        className={styles.button}
        aria-label={accessibilityLabel}
        aria-expanded={isExpanded ? 'true' : 'false'}
        aria-controls={`${id}-listbox`}
      >
        <svg width="18" height="16" aria-hidden="true" focusable="false">
          <polygon
            className="arrow"
            strokeWidth={0}
            fillOpacity={0.75}
            fill="currentColor"
            points="3,6 15,6 9,14"
          />
        </svg>
      </button>
    </div>
  )
)
