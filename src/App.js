import logo from './logo.svg';
import './App.css';
import Hero from './LandingPage/Hero';
import ProductDetail from './pages/ProductDetails';
import { Route, Routes } from 'react-router-dom';


function App() {
  return (
    <div className="bg-white w-full h-screen">
    <Routes>
      <Route path="/" element={<Hero/>}/>
      <Route path="/productDetails/:id" element={<ProductDetail/>}/>
    </Routes>
    </div>
  );
}

export default App;
