import ProductGrid from '../components/ProductGrid';

export default function WomensApparel() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#7CC0F4] mb-4">Women's Apparel</h1>
        <p className="text-gray-600">
          Explore our collection of trendy women's clothing and accessories.
        </p>
      </div>

      {/* ProductGrid will automatically fetch and display products from Square */}
      <ProductGrid category="womens" />
      
      {/* Instructions for managing inventory */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[#7CC0F4] mb-4">
          Managing Your Inventory
        </h2>
        <div className="space-y-4 text-gray-600">
          <p>
            To add or remove products:
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Log in to your Square Dashboard</li>
            <li>Go to Items & Categories</li>
            <li>Add new items or edit existing ones</li>
            <li>Make sure to categorize items as "womens" for them to appear here</li>
            <li>Changes will automatically reflect on the website</li>
          </ol>
          <p className="mt-4 text-sm">
            Note: Product updates may take a few minutes to appear on the website.
          </p>
        </div>
      </div>
    </div>
  );
}
