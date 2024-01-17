import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Explorer from './pages/Explorer';
import MainPage from './pages/MainPage';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route
          path='/'
          element={<MainPage />}
        />
        <Route
          path='/explorer/*'
          element={<Explorer />}
        />
      </Routes>
    </Router>
  );
};

export default App;
