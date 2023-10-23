import { BrowserRouter, HashRouter } from 'react-router-dom';
import  Layout  from './pages/layout.jsx'
import { store } from './toolkit/store.js'
import { Provider } from 'react-redux'


function App() {
  return (
    <HashRouter>
      <Provider store={store}>
        <Layout />
      </Provider>
    </HashRouter>
  );
}

export default App;
