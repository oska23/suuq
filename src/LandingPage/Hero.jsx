import { Link, Navigate } from 'react-router-dom';
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
  doc,
  getDocs,
  orderBy,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { Fragment, useRef, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Header from './Header.jsx';
import demoProducts from '../database/demoProducts.json';
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../context/AuthContext.js';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";






export default function Hero() {
  // State for real products
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState('');

  // adding user listing
  const [userListings, setUserListings] = useState([]);

  // add product modal
  const [addProductModal, setAddProductModal] = useState(false);
  const cancelButtonRef = useRef(null)

  // login modal
  const [loginNotif, setLoginNotif] = useState(false);
  const cancelButtonRef2 = useRef(null)

  // add product state
  const [productLocation, setProductLocation] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productContact, setProductContact] = useState('');
  // adding product image
  const [productImages, setProductImages] = useState([]);
  const [productImageURL, setProductImageURL] = useState('');

  const [productError, setProductError] = useState('');

  const [viewingMyListings, setViewingMyListings] = useState(false);


  const { user, HandleLogout } = useAuth();

  const handleMyListings = () => {
    if (user) {
      const myProducts = products.filter(product => product.owner === user.uid);
      setSearchResults(myProducts);
      setViewingMyListings(true);
    } else {
      // If there is no user, show all products instead
      setSearchResults(products);
      setViewingMyListings(false);
    }
  };

  const handleAddProduct = async (e) => {

    e.preventDefault()
    if (productLocation === '') {
      setProductError('Please select a location');
      return;
    }
    if (productCategory === '') {
      setProductError('Please select a category');
      return;
    }
    if (productName === '') {
      setProductError('Please enter a product name');
      return;
    }
    if (productDescription === '') {
      setProductError('Please enter a product description');
      return;
    }
    if (productPrice === '') {
      setProductError('Please enter a product price');
      return;
    }

    try {
      const productRef = await addDoc(collection(db, "products"), {
        name: productName,
        description: productDescription,
        price: productPrice,
        category: productCategory,
        location: productLocation,
        image: productImages,
        owner: user.uid,
        contact: productContact,
        status: 'available',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      alert('Product added successfully');
      setAddProductModal(false);
      setProductLocation('');
      setProductCategory('');
      setProductName('');
      setProductDescription('');
      setProductPrice('');
      setProductImages('');
      setProductError('');

    } catch (error) {
      console.error("Error adding document: ", error);
      alert('Failed to add product');
    }
  };

  

  useEffect(() => {
    const fetchProducts = async () => {
      // Creating a query against the collection, where item is not sold and ordered by date
      const queryRef = query(collection(db, "products"), orderBy("createdAt", "desc"));
      
      const querySnapshot = await getDocs(queryRef);
      const productList = [];
      querySnapshot.forEach((doc) => {
        productList.push({ id: doc.id, ...doc.data() });
      });
      
      setProducts(productList);
      setSearchResults(productList);
    };
  
    fetchProducts();
  }, []);
  

  useEffect(() => {
    let filtered = products;
    if (viewingMyListings && user) {
      filtered = products.filter(product => product.owner === user.uid);
    } else if (!viewingMyListings && searchTerm) {
      filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setSearchResults(filtered);
  }, [searchTerm, products, viewingMyListings, user]);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    const filtered = category === 'all' ? products : products.filter(product => product.category === category);
    setSearchResults(filtered);
  };

  const toggleMyListings = () => {
    setViewingMyListings(!viewingMyListings);
  };

  // adding product image
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    const uploadedImageUrls = [];
  
    for (const file of files) {
      const uniqueId = Date.now();
      const storageRef = ref(storage, `products/${uniqueId}/${file.name}`);
      try {
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        uploadedImageUrls.push(url);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  
    setProductImages([...productImages, ...uploadedImageUrls]);
  };
  
  



  return (
    <div className=''>
      <Header />
      <div className="bg-white">
        {/* Search Section */}
        <div className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center md:justify-start md:space-x-10">

            <select
              onChange={handleCategoryChange}
              className="bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent rounded-lg px-4 py-2 max-w-xs border-2 border-green-500"
            >
              <option value="all">All Categories</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Properties">Properties</option>
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent rounded-lg m-3 px-4 py-2 w-full border-2 border-green-500" />
          </div>
        </div>
      </div>

      <div className="bg-white">
        {/* Add Product Button */}


        {user ? (

          <div className="flex  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-x-4 justify-between  ">

            <button
               onClick={toggleMyListings}
              className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded border-2 border-green-500 w-44">
              {viewingMyListings ? "Public Listings" : "My Listings"}
            </button>
            <button
              onClick={() => setAddProductModal(true)}
              className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded border-2 border-green-500 w-32">

              Sell Product

            </button>

          </div>
        ) : (
          <div className="flex  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-x-4 justify-end  ">
            <button
              onClick={() => { user ? setAddProductModal(true) : setLoginNotif(true) }}
              className="flex items-center justify-center bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded border-2 border-green-500 w-44 space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>

              <span>Sell Product</span>
            </button>

          </div>
        )}

        {/* Adding Product Modal */}
        <Transition.Root show={addProductModal} as={Fragment}>
          <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => setAddProductModal(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div>
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                          <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="mt-3 text-center sm:mt-5">
                          <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                            Add Product
                          </h3>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Get started by filling in the information below to create your new product listing.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5">
                        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">

                          <div className="col-span-6">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                              Product Location
                            </label>
                            <div className="mt-1">
                              <select
                                id="category"
                                name="category"
                                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                defaultValue={''}
                                onChange={(e) => setProductLocation(e.target.value)}
                                value={productLocation}
                              >
                                <option value="">Select a location</option>
                                <option value="All">All Locations</option>
                                <option value="Awdal">Awdal</option>
                                <option value="Maroodi Jeex">Maroodi Jeex</option>
                                <option value="Sahil">Sahil</option>
                                <option value="Togdheer">Togdheer</option>
                                <option value="Sool">Sool</option>
                                <option value="Sanaag">Sanaag</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>

                          <div className="col-span-6">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                              Product Category
                            </label>
                            <div className="mt-1">
                              <select
                                id="category"
                                name="category"
                                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                defaultValue={''}
                                value={productCategory}
                                onChange={(e) => setProductCategory(e.target.value)}
                              >
                                <option value="">Select a category</option>
                                <option value="Vehicles">Vehicles</option>
                                <option value="Properties">Properties</option>
                                <option value="Mobile">Mobile Phones</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Health">Health & Beauty</option>
                                <option value="Babies">Babies & Kids</option>
                                <option value="Home">Home & Garden</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Services">Services</option>
                                <option value="Jobs">Jobs</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>





                          <div className="col-span-6">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                              Product Title
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="title"
                                id="title"
                                placeholder='e.g. "iPhone 12 Pro Max"'
                                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                defaultValue={''}
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-span-6">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                              Product Description
                            </label>
                            <div className="mt-1">
                              <textarea
                                id="description"
                                name="description"
                                rows={3}
                                placeholder="e.g. 'Brand new iPhone 12 Pro Max 256GB Pacific Blue'"
                                className="shadow-sm focus:ring-green-500 focus:border-green-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                                defaultValue={''}
                                value={productDescription}
                                onChange={(e) => setProductDescription(e.target.value)}
                              />
                            </div>
                          </div>
                          {/* <div className="col-span-6">
                                                                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                                                                Ticket Status
                                                                            </label>
                                                                            <div className="mt-1">
                                                                                <select
                                                                                    id="status"
                                                                                    name="status"
                                                                                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                                                    defaultValue={''}
                                                                                    value={ticketStatus}
                                                                                    onChange={(e) => setTicketStatus(e.target.value)}
                                                                                >
                                                                                    <option value="Pending">Pending</option>
                                                                                    <option value="Overdue">Overdue</option>
                                                                                    <option value="Paid">Paid</option>
                                                                                    <option value="Cancelled">Cancelled</option>
                                                                                </select>
                                                                            </div>
                                                                        </div> */}
                          <div className="col-span-6">
                            <label htmlFor="ticket-price" className="block text-sm font-medium leading-6 text-gray-900">
                              Product Price
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                                $
                              </span>
                              <input
                                type="number"
                                name="ticket-price"
                                id="ticket-price"
                                className="block w-full flex-1 rounded-none rounded-r-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                placeholder="0.00"
                                aria-describedby="ticket-price-currency"
                                defaultValue={''}
                                value={productPrice}
                                onChange={(e) => setProductPrice(e.target.value)}

                              />
                            </div>
                          </div>
                          <div className="col-span-6 sm:col-span-6">
                            <label htmlFor="phone-address" className="block text-sm font-medium leading-6 text-gray-900">
                              WhatsApp Number
                            </label>
                            <div className="mt-2 flex rounded-md shadow-sm">
                              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                                +252
                              </span>
                              <input
                                type="text"
                                name="phone-website"
                                id="phone-website"
                                className="block w-full flex-1 rounded-none rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder=" 63 4123456"
                                aria-describedby="phone-website-description"
                                onChange={(e) => setProductContact(e.target.value)}
                                value={productContact}


                              />
                            </div>
                          </div>
                          <div className="sm:col-span-6">
                            <label htmlFor="pictures" className="block text-sm font-medium text-gray-700">
                              Product Pictures
                            </label>


                            <div class="flex items-center justify-center w-full">
                              <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 darks:hover:bg-bray-800 darks:bg-gray-700 hover:bg-gray-100 darks:border-gray-600 darks:hover:border-gray-500 darks:hover:bg-gray-600">
                                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                  <svg class="w-8 h-8 mb-4 text-gray-500 darks:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                  </svg>
                                  <p class="mb-2 text-sm text-gray-500 darks:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                                  <p class="text-xs text-gray-500 darks:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <input id="dropzone-file" type="file" class="hidden" onChange={handleImageUpload} multiple />
                              </label>
                              {
                                productImages.length > 0 && (
                                  <div className="grid grid-cols-2 gap-4 mt-4">
                                    {productImages.map((image, index) => (
                                      <div key={index} className="relative">
                                        <img src={image} alt="" className="h-40 w-full object-cover" />
                                        <button
                                          type="button"
                                          className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 rounded-full p-1.5"
                                          onClick={() => {
                                            const images = [...productImages];
                                            images.splice(index, 1);
                                            setProductImages(images);
                                          }}
                                        >
                                          <span className="sr-only">Remove</span>
                                          <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M6 18L18 6M6 6l12 12" />
                                          </svg>
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )
                              }
                            </div>
                          </div>
                        </div>
                        {productError && <p className="mt-2 text-sm text-red-500">
                          {productError}
                        </p>
                        }
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                        onClick={(e) => handleAddProduct(e)}
                      >
                        Create Product
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={() => setAddProductModal(false)}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        <Transition.Root show={loginNotif} as={Fragment}>
          <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => setLoginNotif(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                          <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" aria-hidden="true" />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                            Create account
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              To add products, you must be logged in. Please login or create an account to continue.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 sm:ml-3 sm:w-auto"

                      >
                        <Link to="/signup">Register Now</Link>
                      </button>
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"

                      >
                        <Link to="/login">Login</Link>
                      </button>

                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={() => setLoginNotif(false)}
                        ref={cancelButtonRef2}
                      >
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>


        {/* Products List Section */}

        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">

          {/* <h2 className="text-2xl tracking-tight text-gray-900">Products </h2> */}


          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">

            {searchResults?.map((product) => (
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


                {product?.status === 'sold' ? (
                  <>
                    <div className="flex justify-between items-center">

                      <p className="mt-4 text-sm font-medium text-gray-900">$ {product.price}</p>
                      <p className="mt-4 text-sm font-medium text-gray-900">Sold</p>
                    </div>
                    <h3 className="mt-1 text-lg text-gray-700 hover:underline text-decoration-line: line-through line-through-color: red line-through-mode: continuous line-through-source: ">
                      {product.name}
                    </h3>
                  </>
                ) : (
                  <>
                    <p className="mt-4 text-sm font-medium text-gray-900">$ {product.price}</p>

                    <h3 className="mt-1 text-lg font-medium text-gray-900 hover:underline">
                      {product.name}
                    </h3>
                  </>
                )}




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
          <p>{searchResults.length} products found</p>
        </div>
      </div>

    </div>
  )
}
