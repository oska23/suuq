import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Import your firebase configuration
import { Link } from 'react-router-dom';
import { Image, Carousel } from 'antd';
import { useAuth } from '../context/AuthContext.js';




const ProductDetails = () => {
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState([]);

  const { user, HandleLogout } = useAuth();

  



  // Filtering similar products
  // const similarProducts = demoProducts.filter(p => 
  //   p.category === product.category && p.id !== product.id
  // );

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProductDetails({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No such document!");
      }
    };

    fetchProduct();
  }, [id]);

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
            {productDetails?.name}
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
                src={productDetails?.image}
                alt={productDetails?.name}
              />
            </div>
          </div>
          <div className="mt-10 lg:mt-0">
            <div className="mt-4">
              <h2 className="">Product information</h2>
              <p className="text-3xl text-gray-900">$ {productDetails?.price}</p>
              <p className="mt-6 text-gray-500">{productDetails?.description}</p>
            </div>
            <div className="mt-10">
              <h2 className="text-sm font-bold text-gray-900 ">Location </h2>
              <p className="mt-4 text-gray-500">{productDetails?.location}</p>
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

              {productDetails?.owner === user?.uid && productDetails?.status !== "sold" && (
               <button
               onClick={() => alert("Functionality not implemented yet! GG")}
               className="bg-red-500 hover:bg-red-700 text-white w-full py-2 px-4 rounded">
               Mark as Sold
             </button>
              )}

              {productDetails?.owner === user?.uid && productDetails?.status === "sold" && (
                <button
                onClick={() => alert("Functionality not implemented yet! GG")}
                className="bg-orange-500 hover:bg-orange-700 text-white w-full py-2 px-4 rounded">
                Mark as Available
              </button>
              )}

              {productDetails?.owner !== user?.uid && (
                <button
                onClick={() => window.open(`https://api.whatsapp.com/send?phone=252${productDetails?.contact}&text=Hi, I'm interested in your ${productDetails?.name} on Suuq.com. Is it still available?`, "_blank")}
                className="bg-green-500 hover:bg-green-700 text-white w-full py-2 px-4 rounded">
                Contact Seller
              </button>
              )}

            </div>
          </div>
          
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 mt-16">More Images</h2>
        <div className="mt-4">




        <Image.PreviewGroup>
                {productDetails?.image?.map((image) => (
                  <Image
                    width={`20vw`}
                    height={`20vw`}
                    style={{
                      objectFit: "cover",
                    }}
                    src={image}
                  />
                ))}
        </Image.PreviewGroup>



        </div>


        
        {/* <div className="mt-16">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Similar Products</h2>
          <p className="mt-4 text-gray-500">Other products you might be interested in.</p>

          
          <div className="mt-10 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
            
           
          {similarProducts.map((similarProduct) => (
              <div key={product.id}>
                <div className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.imageAlt}
                    className="object-center object-cover"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
                  <h3>{product.name}</h3>
                  <p>${product.price}</p>
                </div>
                <p className="mt-1 text-sm text-gray-500">{product.description}</p>
              </div>
            ))}
          
            </div>
            
            

          </div> */}
      </div>
    </div>

  )
}

export default ProductDetails