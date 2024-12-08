import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import Cart from './Cart';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const { getCartCount } = useCart();
  
  const isChristmasPage = location.pathname === '/christmas-trees';
  const isHomePage = location.pathname === '/';
  const navBgColor = isChristmasPage ? 'bg-[#034F24]' : 'bg-[#2C3E50]';
  const buttonBgColor = isChristmasPage ? 'bg-[#C41E3A]' : 'bg-[#3498DB]';
  const buttonHoverBgColor = isChristmasPage ? 'hover:bg-[#E25766]' : 'hover:bg-[#2980B9]';
  const hoverTextColor = isChristmasPage ? 'hover:text-[#C41E3A]' : 'hover:text-[#3498DB]';
  const underlineColor = isChristmasPage ? 'bg-[#C41E3A]' : 'bg-[#3498DB]';

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return "Wayne's Fashion";
      case '/mens-apparel':
        return "Men's Apparel";
      case '/womens-apparel':
        return "Women's Apparel";
      case '/sporting-goods':
        return "Sporting Goods";
      case '/christmas-trees':
        return "Christmas Trees";
      case '/book-appointment':
        return "Book Delivery";
      default:
        return "Wayne's Fashion";
    }
  };

  const shouldShowChristmasLink = isHomePage || isChristmasPage;

  return (
    <>
      <nav className={`${navBgColor} shadow-lg`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Clickable Page Title - Links to Home */}
            <Link 
              to="/"
              className={`text-2xl font-bold text-white ${hoverTextColor} transition-colors duration-300`}
            >
              {getPageTitle()}
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`text-white ${hoverTextColor} font-medium transition-colors duration-300 
                           relative group py-2`}
              >
                Home
                <span className={`absolute bottom-0 left-0 w-full h-0.5 ${underlineColor} transform scale-x-0 
                               group-hover:scale-x-100 transition-transform duration-300`}></span>
              </Link>
              {!isChristmasPage && (
                <>
                  <Link 
                    to="/mens-apparel" 
                    className={`text-white ${hoverTextColor} font-medium transition-colors duration-300 
                               relative group py-2`}
                  >
                    Men's
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 ${underlineColor} transform scale-x-0 
                                   group-hover:scale-x-100 transition-transform duration-300`}></span>
                  </Link>
                  <Link 
                    to="/womens-apparel" 
                    className={`text-white ${hoverTextColor} font-medium transition-colors duration-300 
                               relative group py-2`}
                  >
                    Women's
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 ${underlineColor} transform scale-x-0 
                                   group-hover:scale-x-100 transition-transform duration-300`}></span>
                  </Link>
                  <Link 
                    to="/sporting-goods" 
                    className={`text-white ${hoverTextColor} font-medium transition-colors duration-300 
                               relative group py-2`}
                  >
                    Sporting Goods
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 ${underlineColor} transform scale-x-0 
                                   group-hover:scale-x-100 transition-transform duration-300`}></span>
                  </Link>
                </>
              )}
              {shouldShowChristmasLink && (
                <Link 
                  to="/christmas-trees" 
                  className={`text-white ${hoverTextColor} font-medium transition-colors duration-300 
                             relative group py-2`}
                >
                  Christmas Trees
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 ${underlineColor} transform scale-x-0 
                                 group-hover:scale-x-100 transition-transform duration-300`}></span>
                </Link>
              )}
              {isChristmasPage && (
                <Link 
                  to="/book-appointment" 
                  className={`${buttonBgColor} text-white px-6 py-3 rounded-full font-medium
                             ${buttonHoverBgColor} transform hover:-translate-y-0.5 
                             transition-all duration-300 shadow-md hover:shadow-lg`}
                >
                  Book Delivery
                </Link>
              )}
              
              {/* Cart Icon */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-white hover:text-[#C41E3A] transition-colors duration-300"
                aria-label="Shopping Cart"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C41E3A] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {getCartCount()}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              {/* Cart Icon for Mobile */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-white hover:text-[#C41E3A] transition-colors duration-300"
                aria-label="Shopping Cart"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C41E3A] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {getCartCount()}
                  </span>
                )}
              </button>
              
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`text-white ${hoverTextColor} transition-colors duration-300 focus:outline-none`}
              >
                <svg 
                  className={`h-6 w-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div 
            className={`md:hidden transition-all duration-300 ease-in-out ${
              isOpen 
                ? 'max-h-screen opacity-100 py-4' 
                : 'max-h-0 opacity-0 overflow-hidden'
            }`}
          >
            <div className="flex flex-col space-y-4 pb-4">
              <Link 
                to="/" 
                className={`text-white ${hoverTextColor} hover:bg-opacity-10 hover:bg-white px-4 py-2 rounded-lg
                           transition-colors duration-300`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              {!isChristmasPage && (
                <>
                  <Link 
                    to="/mens-apparel" 
                    className={`text-white ${hoverTextColor} hover:bg-opacity-10 hover:bg-white px-4 py-2 rounded-lg
                               transition-colors duration-300`}
                    onClick={() => setIsOpen(false)}
                  >
                    Men's
                  </Link>
                  <Link 
                    to="/womens-apparel" 
                    className={`text-white ${hoverTextColor} hover:bg-opacity-10 hover:bg-white px-4 py-2 rounded-lg
                               transition-colors duration-300`}
                    onClick={() => setIsOpen(false)}
                  >
                    Women's
                  </Link>
                  <Link 
                    to="/sporting-goods" 
                    className={`text-white ${hoverTextColor} hover:bg-opacity-10 hover:bg-white px-4 py-2 rounded-lg
                               transition-colors duration-300`}
                    onClick={() => setIsOpen(false)}
                  >
                    Sporting Goods
                  </Link>
                </>
              )}
              {shouldShowChristmasLink && (
                <Link 
                  to="/christmas-trees" 
                  className={`text-white ${hoverTextColor} hover:bg-opacity-10 hover:bg-white px-4 py-2 rounded-lg
                             transition-colors duration-300`}
                  onClick={() => setIsOpen(false)}
                >
                  Christmas Trees
                </Link>
              )}
              {isChristmasPage && (
                <Link 
                  to="/book-appointment" 
                  className={`${buttonBgColor} text-white px-4 py-2 rounded-lg font-medium
                             ${buttonHoverBgColor} transition-colors duration-300`}
                  onClick={() => setIsOpen(false)}
                >
                  Book Delivery
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
