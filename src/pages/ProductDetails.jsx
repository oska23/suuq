import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/20/solid'
import { RadioGroup } from '@headlessui/react'
import demoProducts from '../database/demoProducts.json';
import { Link } from 'react-router-dom';
import { Image } from 'antd';



const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(demoProducts[id - 1]);

  return (
    <div className="bg-white">
      <div className="max-w-7xl  mx-auto py-16 px-4 sm:px-6 lg:px-8">
        
        <div className="mb-4">
          <Link to="/">
            <button className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <a className="inline-block  ml-2">Back to Home</a>

            </button>
          </Link>
        </div>
        <div className="lg:grid p-2 bg-green-400 lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {product.name}
          </h1>
        </div>
        <div className="mt-8 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          <div className="relative lg:row-start-1 lg:col-start-2">
            <svg
              className="hidden lg:block absolute top-0 right-0 -mt-20 -mr-20"
              width={404}
              height={384}
              fill="none"
              viewBox="0 0 404 384"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="de316486-4a29-4312-bdfc-fbce2132a2c1"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-green-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={384}
                fill="url(#de316486-4a29-4312-bdfc-fbce2132a2c1)"
              />
            </svg>
            <div className="relative mx-auto rounded-lg shadow-lg md:max-w-2xl sm:mx-auto lg:max-w-full">
              <Image
                width={`100%`}
                src={product.image}
                alt={product.name}
              />
            </div>
          </div>
          <div className="mt-10 lg:mt-0">
            <div className="mt-4">
              <h2 className="">Product information</h2>
              <p className="text-3xl text-gray-900">$ {product.price}</p>
              <p className="mt-6 text-gray-500">{product.description}</p>
            </div>
            <div className="mt-10 rounded-md bg-green-300 p-4">
              <h2 className="text-sm font-bold text-gray-900 ">Safety Tips</h2>
              <ul className="mt-4 pl-4 list-disc text-sm space-y-2">
                <li className=" text-gray-900">
                  Meet seller at a public place
                </li>
                <li className="text-gray-900">
                  Check the item before you buy
                </li>
                <li className="text-gray-900">
                  Pay only after collecting the item
                </li>
              </ul>
            </div>
            <div className="mt-10">

              <button 
              onClick={() => alert("Functionality not implemented yet! GG")}
                className="bg-green-500 hover:bg-green-700 text-white w-full py-2 px-4 rounded">
                Contact Seller
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default ProductDetails