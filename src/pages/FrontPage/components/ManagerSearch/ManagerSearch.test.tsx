import userEvent from '@testing-library/user-event'
import { renderWithRedux, screen, waitFor } from '../../../../store/__mock__'
import { ManagerSearch } from './ManagerSearch'

jest.mock('../../api/fetchUsers', () => ({
  fetchUsers: () =>
    new Promise((resolve) => {
      resolve([
        {
          id: '139',
          firstName: 'Harriet',
          lastName: 'Banks',
          name: 'Harriet Banks',
          jobLevel: 'Manager',
          email: 'harriet.banks@kinetar.com',
        },
        {
          id: '140',
          firstName: 'Eugene',
          lastName: 'Wong',
          name: 'Eugene Wong',
          jobLevel: 'Executive',
          email: 'eugene.wong@kinetar.com',
        },
        {
          id: '141',
          firstName: 'Alta',
          lastName: 'Maxwell',
          name: 'Alta Maxwell',
          jobLevel: 'Manager',
          email: 'alta.maxwell@kinetar.com',
        },
      ])
    }),
}))

describe('ManagerSearch', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = jest.fn()
  })

  it('renders search components', () => {
    renderWithRedux(<ManagerSearch />)

    const comboBox = screen.getByRole('combobox')
    expect(comboBox).toBeInTheDocument()
  })

  it('renders loading view', () => {
    const { debug } = renderWithRedux(<ManagerSearch />)

    const comboBox = screen.getByRole('combobox')
    userEvent.click(comboBox)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('renders manager list when user clicks into the input field', async () => {
    renderWithRedux(<ManagerSearch />)

    const comboBox = screen.getByRole('combobox')
    userEvent.click(comboBox)
    expect(await screen.findByRole('listbox')).toBeInTheDocument()
    // should only have 2 out of 3 employees
    expect(screen.getAllByRole('option')).toHaveLength(2)
  })

  it('filters when user types', async () => {
    renderWithRedux(<ManagerSearch />)

    const comboBox = screen.getByRole('combobox')
    userEvent.click(comboBox)
    expect(await screen.findByRole('listbox')).toBeInTheDocument()

    userEvent.type(comboBox, 'tb')
    // should leave only one result
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(1))
  })

  it('confirms the selection and changes the label', async () => {
    renderWithRedux(<ManagerSearch />)

    const comboBox = screen.getByRole('combobox')
    userEvent.click(comboBox)
    expect(await screen.findByRole('listbox')).toBeInTheDocument()

    expect(comboBox).toHaveDisplayValue('')
    userEvent.type(comboBox, '{arrowdown}')
    userEvent.type(comboBox, '{enter}')
    expect(comboBox).toHaveDisplayValue('Alta Maxwell')
  })

  it('keeps the search when user blurs out', async () => {
    renderWithRedux(<ManagerSearch />)

    const comboBox = screen.getByRole('combobox')
    userEvent.click(comboBox)
    expect(await screen.findByRole('listbox')).toBeInTheDocument()

    userEvent.type(comboBox, 'tb')
    // should leave only one result
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(1))

    // blur out and collapse manager list but keeps the input
    comboBox.blur()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(comboBox).toHaveDisplayValue('tb')

    // tab into the input, expands the list that has filtered result
    userEvent.tab()
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(1)
  })
})
