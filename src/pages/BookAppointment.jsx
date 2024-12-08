import { useState } from 'react';

export default function BookAppointment() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    date: '',
    time: '',
    service: 'delivery-setup'
  });

  const services = [
    {
      id: 'delivery-setup',
      name: 'Delivery & Setup',
      duration: '1 hour',
      price: 49.99,
      description: 'Professional delivery and setup of your Christmas tree'
    },
    {
      id: 'delivery-setup-removal',
      name: 'Delivery, Setup & Post-Holiday Removal',
      duration: '1 hour + removal',
      price: 79.99,
      description: 'Complete service including post-holiday tree removal'
    },
    {
      id: 'setup-only',
      name: 'Setup Only',
      duration: '45 minutes',
      price: 29.99,
      description: 'Professional setup of your tree (delivery not included)'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Delivery scheduled:', formData);
    alert('Thank you for scheduling! We will confirm your delivery time shortly.');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const inputClasses = "w-full px-3 py-2 border border-[#034F24] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A6F35] bg-white text-[#333]";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#034F24] mb-6">Schedule Your Tree Delivery</h1>

      {/* Services Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {services.map((service) => (
          <div key={service.id} className="bg-white p-6 rounded-lg shadow-md border border-[#034F24] hover:border-[#C41E3A] transition-colors duration-300">
            <h3 className="text-xl font-semibold text-[#034F24] mb-2">{service.name}</h3>
            <p className="text-[#4D4D4D] mb-4">{service.description}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#4D4D4D]">{service.duration}</span>
              <span className="font-semibold text-[#C41E3A]">${service.price}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Form */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 border border-[#034F24]">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#034F24] mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#034F24] mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#034F24] mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#034F24] mb-1">
                Delivery Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#034F24] mb-1">
                Service Type
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className={inputClasses}
              >
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - ${service.price}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#034F24] mb-1">
                Preferred Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#034F24] mb-1">
                Preferred Time
              </label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className={inputClasses}
              >
                <option value="">Select a time</option>
                <option value="09:00">9:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="13:00">1:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="17:00">5:00 PM</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#C41E3A] text-white py-3 px-4 rounded-md hover:bg-[#E25766] transition-colors"
            >
              Schedule Delivery
            </button>
          </div>
        </form>

        {/* Delivery Information */}
        <div className="mt-8 bg-[#F8F8F8] rounded-lg p-6 border border-[#034F24]">
          <h3 className="text-lg font-semibold text-[#034F24] mb-4">Important Information</h3>
          <ul className="list-disc list-inside space-y-2 text-[#4D4D4D]">
            <li>Please ensure clear access to your desired tree location</li>
            <li>Have your space prepared before delivery</li>
            <li>Someone must be present during delivery and setup</li>
            <li>24-hour cancellation notice required</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
