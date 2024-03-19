import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Explorer from './pages/Explorer';
import MainPage from './pages/MainPage';
import MarketPlacePage from './pages/MarketPlacePage.tsx';
import Header from './pages/components/Header/Header.tsx';
import SplitServicePage from './pages/SplitServicePage.tsx';

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
          path='/split-service/*'
          element={<SplitServicePage />}
        />
      </Routes>
    </Router>
  );
};

export default App;
