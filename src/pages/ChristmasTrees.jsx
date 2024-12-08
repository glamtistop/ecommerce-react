import ProductGrid from '../components/ProductGrid';
import { Link } from 'react-router-dom';

export default function ChristmasTrees() {
  const treeCategories = [
    {
      title: "Fresh Cut Trees",
      description: "Premium Fraser Fir, Balsam Fir, and Scotch Pine trees freshly cut for maximum longevity"
    },
    {
      title: "Artificial Trees",
      description: "High-quality artificial trees that look realistic and last for many seasons"
    },
    {
      title: "Pre-lit Trees",
      description: "Convenient pre-lit options with warm white or multicolor LED lights"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner Section */}
      <div className="relative h-[400px] mb-12 rounded-lg overflow-hidden">
        <img 
          src="/banner.jpg" 
          alt="Christmas Tree Banner" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Tree Categories */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {treeCategories.map((category) => (
          <div key={category.title} 
               className="bg-white p-6 rounded-lg shadow-md border border-[#034F24] hover:border-[#C41E3A] 
                        transition-colors duration-300">
            <h2 className="text-xl font-semibold text-[#034F24] mb-2">{category.title}</h2>
            <p className="text-[#4D4D4D]">{category.description}</p>
          </div>
        ))}
      </div>

      {/* Product Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#034F24] mb-6 text-center">Available Trees</h2>
        <ProductGrid category="christmas-trees" />
      </div>

      {/* Tree Care Guide */}
      <div className="bg-[#F8F8F8] rounded-lg p-8 mb-12 border border-[#034F24]">
        <h2 className="text-2xl font-bold text-[#034F24] mb-6 text-center">Tree Care Guide</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-[#034F24] mb-4">Fresh Tree Care</h3>
            <ul className="space-y-3 text-[#4D4D4D]">
              <li>• Make a fresh cut across the base, about 1/2 inch up from the original cut</li>
              <li>• Place in water within 2 hours of the fresh cut</li>
              <li>• Check water level daily and refill as needed</li>
              <li>• Keep away from heat sources and direct sunlight</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[#034F24] mb-4">Artificial Tree Tips</h3>
            <ul className="space-y-3 text-[#4D4D4D]">
              <li>• Fluff branches thoroughly for a natural look</li>
              <li>• Store in a cool, dry place during off-season</li>
              <li>• Use a tree storage bag for protection</li>
              <li>• Check all lights before decorating</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="bg-white rounded-lg p-8 border border-[#034F24] text-center">
        <h2 className="text-2xl font-bold text-[#034F24] mb-6 text-center">Professional Delivery & Setup</h2>
        <p className="text-[#4D4D4D] mb-6 max-w-2xl mx-auto">
          Let our experts handle everything - from delivery to setup, and even post-holiday removal. 
          We ensure your tree is properly secured and positioned perfectly in your home.
        </p>
        <div className="flex justify-center">
          <Link 
            to="/book-appointment"
            className="inline-block bg-[#C41E3A] text-white px-6 py-3 rounded-lg hover:bg-[#E25766] 
                     transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Schedule Your Delivery
          </Link>
        </div>
      </div>
    </div>
  );
}
