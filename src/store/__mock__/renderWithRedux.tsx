import { render } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

import type { FC, ReactElement } from 'react'

import { frontPageReducer } from '../../pages/FrontPage'

export const renderWithRedux = (
  ui: ReactElement,
  {
    // @ts-expect-error skip the typing for now
    preloadedState,
    store = configureStore({
      reducer: { frontPage: frontPageReducer },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) => {
  const Wrapper: FC = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  )

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}
