import { Link } from 'react-router-dom';

export default function Home() {
  const categories = [
    {
      name: "Men's Apparel",
      description: "Premium men's clothing and accessories",
      path: "/mens-apparel"
    },
    {
      name: "Women's Apparel",
      description: "Stylish women's fashion collections",
      path: "/womens-apparel"
    },
    {
      name: "Sporting Goods",
      description: "Quality sports equipment and gear",
      path: "/sporting-goods"
    }
  ];

  const featuredItems = [
    {
      name: "Designer Collection",
      price: "From $49.99",
      description: "Latest Fashion Trends",
      tag: "New Arrival"
    },
    {
      name: "Seasonal Specials",
      price: "From $29.99",
      description: "Limited Time Offers",
      tag: "Featured"
    },
    {
      name: "Christmas Trees",
      price: "From $89.99",
      description: "Premium Holiday Selection",
      tag: "Seasonal",
      path: "/christmas-trees"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner Section */}
      <div className="relative h-[400px] mb-12 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2C3E50] to-[#3498DB] flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-5xl font-bold text-white mb-4">Wayne's Fashion</h1>
            <p className="text-xl text-white mb-6">Elevate Your Style with Premium Fashion</p>
            <div className="flex gap-4 justify-center">
              <Link 
                to="/mens-apparel"
                className="bg-white text-[#2C3E50] px-6 py-3 rounded-lg hover:bg-gray-100 
                         transition-all duration-300 font-semibold"
              >
                Shop Men's
              </Link>
              <Link 
                to="/womens-apparel"
                className="bg-[#C41E3A] text-white px-6 py-3 rounded-lg hover:bg-[#E25766] 
                         transition-all duration-300 font-semibold"
              >
                Shop Women's
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Items Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-[#C41E3A] mb-6 text-center">Featured Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredItems.map((item) => (
            <div key={item.name} className={`bg-white rounded-lg shadow-md p-6 border border-[#034F24] hover:border-[#C41E3A] transition-colors duration-300 relative ${item.path ? 'cursor-pointer' : ''}`}>
              {item.path ? (
                <Link to={item.path} className="block">
                  <span className="absolute top-4 right-4 bg-[#C41E3A] text-white px-3 py-1 rounded-full text-sm">
                    {item.tag}
                  </span>
                  <h3 className="text-xl font-semibold text-[#034F24] mb-2">{item.name}</h3>
                  <p className="text-[#4D4D4D] mb-2">{item.description}</p>
                  <p className="text-lg font-bold text-[#C41E3A]">{item.price}</p>
                </Link>
              ) : (
                <>
                  <span className="absolute top-4 right-4 bg-[#C41E3A] text-white px-3 py-1 rounded-full text-sm">
                    {item.tag}
                  </span>
                  <h3 className="text-xl font-semibold text-[#034F24] mb-2">{item.name}</h3>
                  <p className="text-[#4D4D4D] mb-2">{item.description}</p>
                  <p className="text-lg font-bold text-[#C41E3A]">{item.price}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {categories.map((category) => (
          <Link 
            to={category.path}
            key={category.name}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 cursor-pointer 
                     border border-[#034F24] hover:border-[#C41E3A] transform hover:-translate-y-1"
          >
            <h2 className="text-xl font-semibold text-[#034F24] mb-2">{category.name}</h2>
            <p className="text-[#4D4D4D]">{category.description}</p>
          </Link>
        ))}
      </div>

      {/* Christmas Trees Special Section */}
      <div className="bg-gradient-to-r from-[#034F24] to-[#0A6F35] rounded-lg p-8 mb-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Christmas Trees Now Available!</h2>
          <p className="text-lg text-white/90 mb-6">Visit our special Christmas section for premium trees and accessories</p>
          <Link 
            to="/christmas-trees"
            className="inline-block bg-[#C41E3A] text-white px-8 py-3 rounded-lg hover:bg-[#E25766] 
                     transition-all duration-300 font-semibold transform hover:-translate-y-1 shadow-lg"
          >
            Shop Christmas Trees
          </Link>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-[#F8F8F8] rounded-lg p-8 mb-12">
        <h2 className="text-3xl font-bold text-[#034F24] mb-6 text-center">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#034F24] hover:border-[#C41E3A] transition-colors duration-300">
            <h3 className="font-semibold text-xl mb-2 text-[#034F24]">Personal Styling</h3>
            <p className="text-[#4D4D4D]">Get expert advice from our fashion consultants.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#034F24] hover:border-[#C41E3A] transition-colors duration-300">
            <h3 className="font-semibold text-xl mb-2 text-[#034F24]">Custom Fitting</h3>
            <p className="text-[#4D4D4D]">Professional alterations for the perfect fit.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#034F24] hover:border-[#C41E3A] transition-colors duration-300">
            <h3 className="font-semibold text-xl mb-2 text-[#034F24]">VIP Shopping</h3>
            <p className="text-[#4D4D4D]">Exclusive shopping experience for our valued customers.</p>
          </div>
        </div>
      </div>

      {/* Book Appointment Section */}
      <div className="bg-[#F8F8F8] rounded-lg p-8 border border-[#034F24]">
        <h2 className="text-2xl font-bold text-[#034F24] mb-6 text-center">Schedule an Appointment</h2>
        <div className="text-center">
          <p className="text-[#4D4D4D] mb-6">Book a personal styling session or custom fitting appointment</p>
          <Link 
            to="/book-appointment"
            className="inline-block bg-[#C41E3A] text-white px-8 py-3 rounded-lg hover:bg-[#E25766] 
                     transition-all duration-300 font-semibold transform hover:-translate-y-1 shadow-lg"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
