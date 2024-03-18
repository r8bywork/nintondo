import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Explorer from './pages/Explorer';
import MainPage from './pages/MainPage';
import MarketPlacePage from './pages/MarketPlacePage.tsx';

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
      </Routes>
    </Router>
  );
};

export default App;
