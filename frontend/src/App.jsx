import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CakeList from './components/CakeList';
import CakeDetail from './components/CakeDetail';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import Promotions from './components/Promotions';
import Delivery from './components/Delivery';
import Fillings from './components/Fillings';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cakes" element={<CakeList />} />
                <Route path="/cakes/:id" element={<CakeDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/promotions" element={<Promotions />} />
                <Route path="/delivery" element={<Delivery />} />
                <Route path="/fillings" element={<Fillings />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
