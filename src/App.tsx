import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Header from './pages/components/Header/Header';
import Explorer from './pages/Explorer';
import MainPage from './pages/MainPage';
import MarketPlacePage from './pages/MarketPlacePage.tsx';
import InscriptionInfo from './pages/InscriptionInfo.tsx';
import CollectionPage from './pages/CollectionPage.tsx';

const App = () => {
  return (
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
          path='/marketplace/*'
          element={<MarketPlacePage />}
        />
        <Route
          path='/marketplace/inscription/:hash'
          element={<InscriptionInfo />}
        />
        <Route
          path='/marketplace/collection/:hash'
          element={<CollectionPage />}
        />
      </Routes>
    </Router>
  );
};

export default App;
