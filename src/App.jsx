import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ChristmasTrees from './pages/ChristmasTrees';
import MensApparel from './pages/MensApparel';
import WomensApparel from './pages/WomensApparel';
import BookAppointment from './pages/BookAppointment';
import ProductDisplay from './pages/ProductDisplay';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/christmas-trees">
                <Route index element={<ChristmasTrees />} />
                <Route path=":productId" element={<ProductDisplay />} />
              </Route>
              <Route path="/mens-apparel" element={<MensApparel />} />
              <Route path="/womens-apparel" element={<WomensApparel />} />
              <Route path="/book-appointment" element={<BookAppointment />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
