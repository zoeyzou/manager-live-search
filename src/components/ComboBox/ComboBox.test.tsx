import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComboBox } from './ComboBox'

import type { Props } from './ComboBox'
import type { ItemBase } from './types'

describe('Combo Box', () => {
  const props: Props<ItemBase> = {
    onTextChange: jest.fn(),
    items: [
      {
        id: '1',
        name: 'banana',
      },
      {
        id: '2',
        name: 'apple',
      },
      {
        id: '3',
        name: 'cherry',
      },
    ],
    onSelectItem: jest.fn(),
    renderItem: ({ id, name }) => (
      <div>
        {id}-{name}
      </div>
    ),
  }

  beforeEach(() => {
    Element.prototype.scrollIntoView = jest.fn()
  })

  describe('DropdownInput', () => {
    const renderComponent = () => {
      const { ...allReturned } = render(<ComboBox {...props} />)
      const comboBox = screen.getByRole('combobox')
      const button = screen.getByRole('button')
      const listBox = screen.queryByRole('listbox')

      expect(listBox).not.toBeInTheDocument()

      return { comboBox, button, ...allReturned }
    }

    it('focuses and expands when click the button', () => {
      const { comboBox, button } = renderComponent()

      expect(comboBox).not.toHaveFocus()

      userEvent.click(button)
      expect(comboBox).toHaveFocus()
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('shows the list when clicked the input', () => {
      const { comboBox } = renderComponent()

      userEvent.type(comboBox, '111')
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('collapses when pressing Escape', () => {
      const { comboBox } = renderComponent()

      userEvent.type(comboBox, '111')
      expect(screen.getByRole('listbox')).toBeInTheDocument()

      userEvent.type(comboBox, '{escape}')
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('toggles expand when focus and blur', () => {
      const { comboBox } = renderComponent()

      userEvent.type(comboBox, '111')
      expect(screen.getByRole('listbox')).toBeInTheDocument()
      comboBox.blur()
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('debounces the input', async () => {
      const { comboBox } = renderComponent()

      userEvent.type(comboBox, '111')
      expect(props.onTextChange).not.toBeCalled()

      await waitFor(() => expect(props.onTextChange).toBeCalledWith('111'))
    })

    it('focus by tabbing into it', async () => {
      const { comboBox } = renderComponent()

      expect(comboBox).toHaveAttribute('aria-expanded', 'false')

      userEvent.tab()
      expect(comboBox).toHaveAttribute('aria-expanded', 'true')
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('keeps current input after blurring', () => {
      const { comboBox } = renderComponent()

      userEvent.type(comboBox, '111')
      comboBox.blur()

      expect(comboBox).toHaveDisplayValue('111')
    })
  })

  describe('DropdownList', () => {
    const renderComponent = () => {
      const { ...allReturned } = render(<ComboBox {...props} />)

      userEvent.click(screen.getByRole('button'))

      const comboBox = screen.getByRole('combobox')
      const listBox = screen.getByRole('listbox')
      const listItems = screen.getAllByRole('option')
      return { comboBox, listBox, listItems, ...allReturned }
    }

    it('renders loading view', () => {
      render(<ComboBox {...props} isLoading />)

      userEvent.click(screen.getByRole('button'))
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    it('renders a list of items', () => {
      const { listItems } = renderComponent()

      expect(listItems.length).toBe(3)
    })

    it('uses keyboard navigation and select item by pressing enter', () => {
      const {
        comboBox,
        listItems: [firstItem, secondItem],
      } = renderComponent()

      expect(firstItem).toHaveAttribute('aria-selected', 'true')
      expect(secondItem).toHaveAttribute('aria-selected', 'false')

      userEvent.type(comboBox, '{arrowdown}')
      expect(firstItem).toHaveAttribute('aria-selected', 'false')
      expect(secondItem).toHaveAttribute('aria-selected', 'true')

      userEvent.type(comboBox, '{arrowup}')
      expect(firstItem).toHaveAttribute('aria-selected', 'true')
      expect(secondItem).toHaveAttribute('aria-selected', 'false')
    })

    it('selects item when pressing enter', () => {
      const { comboBox } = renderComponent()

      userEvent.type(comboBox, '{arrowDown}')
      userEvent.type(comboBox, '{enter}')
      expect(props.onSelectItem).toBeCalledWith({ id: '2', name: 'apple' })
    })
  })
})
