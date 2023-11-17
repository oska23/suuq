import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header.jsx';
import demoProducts from '../database/demoProducts.json';





export default function Hero() {
  const [filteredProducts, setFilteredProducts] = useState(demoProducts);

  const handleCategoryChange = (category) => {
    if (category === 'all') {
      setFilteredProducts(demoProducts);
    } else {
      const filtered = demoProducts.filter(product => product.category === category);
      setFilteredProducts(filtered);
    }
  };



  return (
    <div className=''>
      <Header />
      <div className="bg-white">
        {/* Search Section */}
        <div className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center md:justify-start md:space-x-10">

            <select
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent rounded-lg px-4 py-2 max-w-xs border-2 border-green-500"
            >
              <option value="all">All Categories</option>
              <option value="vehicles">Vehicles</option>
              <option value="properties">Properties</option>
              <option value="Mobile">Mobile Phones</option>
              <option value="Electronics">Electronics</option>
              <option value="Health">Health & Beauty</option>
              <option value="Babies">Babies & Kids</option>
              <option value="Home">Home & Garden</option>
              <option value="Fashion">Fashion</option>
              <option value="Services">Services</option>
              <option value="Jobs">Jobs</option>

            </select>

            <input
              type="text"
              placeholder="Search"
              className="bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent rounded-lg m-3 px-4 py-2 w-full border-2 border-green-500" />
            <button className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded w-1/6 border-2 border-green-500">
              Search
            </button>
            
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Products</h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">

            {filteredProducts.map((product) => (
              <a key={product.id}
                href={`/productDetails/${product.id}`}
                className="group">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  <img
                    src={product.image}
                    alt={product.imageAlt}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>

                <p className="mt-4 text-sm font-medium text-gray-900">$ {product.price}</p>
                <h3 className="mt-1 text-lg text-gray-700 hover:underline">{product.name}</h3>
                <div className="flex space-x-4 mt-4">
                  <button className="bg-green-500 hover:bg-green-700 text-white w-full py-2 px-4 rounded">
                    Contact Seller
                  </button>
                </div>
              </a>


            ))}

            

            
            


          </div>
          
        </div>
        <div className="text-center text-2xl text-gray-500 ">
              {filteredProducts.length} products found
            </div>
      </div>
      
    </div>
  )
}
