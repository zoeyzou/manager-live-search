import { Provider } from 'react-redux'
import { store } from './store'

import { FrontPage } from './pages/FrontPage/FrontPage'

function App() {
  return (
    <Provider store={store}>
      <FrontPage />
    </Provider>
  )
}

export default App
