import { BrowserRouter } from 'react-router-dom';
import  Layout  from './pages/layout.jsx'
import { store } from './toolkit/store.js'
import { Provider } from 'react-redux'


function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Layout />
      </Provider>
    </BrowserRouter>
  );
}

export default App;
