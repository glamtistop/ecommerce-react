import { Link } from 'react-router-dom';

export default function Footer() {
  const categories = [
    { name: "Men's Apparel", path: '/mens' },
    { name: "Women's Apparel", path: '/womens' },
    { name: 'Sporting Goods', path: '/sports' },
    { name: 'Christmas Trees', path: '/christmas' }
  ];

  const company = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Careers', path: '/careers' },
    { name: 'Blog', path: '/blog' }
  ];

  const customerService = [
    { name: 'Shipping Policy', path: '/shipping' },
    { name: 'Returns & Exchanges', path: '/returns' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Size Guide', path: '/size-guide' }
  ];

  return (
    <footer className="bg-primary-300 text-bg-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Store Information */}
          <div>
            <h3 className="text-accent-100 text-lg font-semibold mb-4">Wayne's Trees</h3>
            <p className="mb-4 text-bg-200">Your trusted source for quality Christmas trees and seasonal items.</p>
            <Link
              to="/book-appointment"
              className="inline-block bg-accent-200 text-bg-100 px-4 py-2 rounded hover:bg-accent-100 transition-colors"
            >
              Book Tree Delivery
            </Link>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-accent-100 text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-bg-200 hover:text-accent-100 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-accent-100 text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {company.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-bg-200 hover:text-accent-100 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-accent-100 text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              {customerService.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-bg-200 hover:text-accent-100 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t border-primary-200 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center text-bg-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>(555) 123-4567</span>
            </div>
            <div className="flex items-center text-bg-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>contact@waynestrees.com</span>
            </div>
            <div className="flex items-center text-bg-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>123 Store Street, City, State 12345</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-200 mt-8 pt-8 text-center text-bg-200">
          <p>&copy; {new Date().getFullYear()} Wayne's Trees. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
