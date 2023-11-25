import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Import your firebase configuration
import { Link } from 'react-router-dom';
import { Image, Carousel, message, Spin } from 'antd';
import { useAuth } from '../context/AuthContext.js';




const ProductDetails = () => {
  const [productLoading, setProductLoading] = useState(true);
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState([]);


  const { user, HandleLogout } = useAuth();


  const handleItemSold = async () => {
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, {
        status: "sold",
      });
      message.success("Item marked as sold");
      window.location.reload();
    } catch (error) {
      message.error("Failed to mark item as sold");
    }
  };


  const handleItemAvailable = async () => {
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, {
        status: "available",
      });
      message.success("Item marked as available");
      window.location.reload();
    } catch (error) {
      message.error("Failed to mark item as available");
    
    }
  };

  




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
    const timer = setTimeout(() => {
      setProductLoading(false);
    }, 1000);
    return () => clearTimeout(timer);

  }, [id]);

  return (
    <>
    
    {productLoading ? (
     <div role="status">
     <svg aria-hidden="true" class="absolute top-1/2 left-1/2 w-16 h-16 text-gray-200 animate-spin  fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
       <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
       <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
     </svg>
     <span class="sr-only">Loading...</span>
   </div>
    ) : (
      <>
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
               onClick={() => handleItemSold()}
               className="bg-red-500 hover:bg-red-700 text-white w-full py-2 px-4 rounded">
               Mark as Sold
             </button>
              )}

              {productDetails?.owner === user?.uid && productDetails?.status === "sold" && (
                <button
                onClick={() => handleItemAvailable()}
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
    
    </>
    )}
    </>

  ) 

}
export default ProductDetails