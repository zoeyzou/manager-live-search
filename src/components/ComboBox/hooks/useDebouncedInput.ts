import { useEffect, useState } from 'react'

import type { ChangeEvent } from 'react'

type Input = {
  initialInput?: string
  onChange: (value: string) => void
  timeout?: number
}

type Output = {
  inputValue: string
  inputChangeHandler: (evt: ChangeEvent<HTMLInputElement>) => void
}

export const useDebouncedInput = ({
  initialInput = '',
  onChange,
  timeout = 300,
}: Input): Output => {
  const [inputValue, setInputValue] = useState(initialInput)

  const inputChangeHandler = (evt: ChangeEvent<HTMLInputElement>) =>
    setInputValue(evt.currentTarget.value)

  // to cover the case when user changes display text prop
  useEffect(() => {
    setInputValue(initialInput)
  }, [initialInput])

  useEffect(() => {
    const debouncer = setTimeout(() => onChange(inputValue), timeout)
    return () => clearTimeout(debouncer)
  }, [inputValue, onChange, timeout])

  return { inputValue, inputChangeHandler }
}
