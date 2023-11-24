import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';

// pages
import Hero from './LandingPage/Hero';
import ProductDetail from './pages/ProductDetails';
import MyListings from './pages/MyListings';

// context
import { AuthContextProvider } from './context/AuthContext';

// auth pages
import Login from './auth/Login';
import Signup from './auth/Signup';

// layout
import Header from './layout/Header';


function App() {
  return (
    <div className="bg-white w-full h-screen">
    <AuthContextProvider>
    <Routes>
      <Route path="/" element={<Hero/>}/>
      <Route path="/productDetails/:id" element={<ProductDetail/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/myListings" element={<MyListings/>}/>
      {/* <Route path="/" element={<Header/>}>
        
      </Route> */}
    </Routes>
    </AuthContextProvider>
    </div>
  );
}

export default App;
