import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Header from './pages/components/Header/Header';
import Explorer from './pages/Explorer';
import MainPage from './pages/MainPage';
import InscriptionsPage from './pages/InscriptionsPage.tsx';
import InscriptionPage from './pages/InscriptionPage.tsx';
// import CollectionPage from './pages/CollectionPage.tsx';
// import CollectionsPage from './pages/CollectionsPage.tsx';
// import { Provider } from 'react-redux';
import SplitServicePage from './pages/SplitServicePage.tsx';
// import { store } from './redux/store/store.ts';

const App = () => {
  return (
    // <Provider store={store}>
    <Router>
      <Header />
      <Routes>
        <Route
          path='/:anchor?'
          element={<MainPage />}
        />
        <Route
          path='/explorer/*'
          element={<Explorer />}
        />
        <Route
          path='/bellinals/inscriptions/*'
          element={<InscriptionsPage />}
        />
        <Route
          path='/bellinals/inscription/:hash'
          element={<InscriptionPage />}
        />
        {/* <Route
            path='/bellinals/collections/*'
            element={<CollectionsPage />}
          /> */}
        {/* <Route
            path='/bellinals/collections/:hash'
            element={<CollectionPage />}
          /> */}
        {/* <Route
          path='/marketplace'
          element={<MarketplacePage />}
        /> */}
        <Route
          path='/split-service/*'
          element={<SplitServicePage />}
        />
        {/* <Route
          path='/user-inscriptions'
          element={<WalletPage />}
        /> */}
      </Routes>
    </Router>
    // </Provider>
  );
};

export default App;
