import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { message, Progress, Alert } from "antd";

const Signup = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userConfirmPassword, setUserConfirmPassword] = useState('');
    const [userPhoneNumber, setUserPhoneNumber] = useState('');
    const [userAbout, setUserAbout] = useState('');
    const [userPhoto, setUserPhoto] = useState(null);

    const [photoUrl, setPhotoUrl] = useState('');
    const [photoProgress, setPhotoProgress] = useState(0);


    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


    const navigate = useNavigate();

    const { HandleSignup, } = useAuth();

    const HandleSignupSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        if (firstName === '' || lastName === '' || userEmail === '' || userPassword === '' || userConfirmPassword === '' || userPhoneNumber === '' || userAbout === '') {
            return setError('Please fill all the fields');
        }
        try {
            await HandleSignup(firstName, lastName, userEmail, userPassword, userConfirmPassword, userPhoneNumber, userAbout, userPhoto, navigate, setError, setLoading);
            Alert.success('Account Created Successfully');
        } catch (error) {
            setError('Failed to create an account');
            message.error('Failed to create an account');
        }
    }




    

    return (
        <div className="max-w-[900px] mx-auto my-[50px]">

            <div className="md:grid  md:gap-6 mx-2 darks:bg-[slate-900] rounded-md p-4">
                <h2 className="text-3xl font-bold text-center text-green-500 p-4 rounded-md">Sign Up</h2>
                <div className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 darks:text-gray-100">Personal Information</h3>
                        <p className="mt-1 text-sm text-gray-600">
                            Already have an account? <Link to="/login" className="text-green-500">Login</Link>
                        </p>
                    </div>
                </div>
                <div className="mt-5 md:col-span-2 md:mt-0">
                    <form onSubmit={(e) => HandleSignupSubmit(e)}>
                        <div className="overflow-hidden shadow sm:rounded-md">
                            <div className="bg-white px-4 py-5 sm:p-6 darks:bg-slate-900">
                                <div className="grid grid-cols-6 gap-6">
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 darks:text-gray-100">
                                            First name
                                        </label>
                                        <input
                                            type="text"
                                            onChange={(e) => setFirstName(e.target.value)}
                                            name="first-name"
                                            id="first-name"
                                            autoComplete="given-name"
                                            className="mt-1 block w-full rounded-md darks:bg-slate-900 darks:text-gray-50 border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                        />
                                    </div>

                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 darks:text-gray-100">
                                            Last name
                                        </label>
                                        <input
                                            type="text"
                                            onChange={(e) => setLastName(e.target.value)}
                                            name="last-name"
                                            id="last-name"
                                            autoComplete="family-name"
                                            className="mt-1 block w-full rounded-md darks:bg-slate-900 darks:text-gray-50 border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                        />
                                    </div>




                                    <div className="col-span-6 sm:col-span-6">
                                        <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 darks:text-gray-100">
                                            Email address
                                        </label>
                                        <input
                                            type="text"
                                            onChange={(e) => setUserEmail(e.target.value)}
                                            name="email-address"
                                            id="email-address"
                                            autoComplete="email"
                                            className="mt-1 block w-full rounded-md darks:bg-slate-900 darks:text-gray-50 border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                        />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 darks:text-gray-100">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            onChange={(e) => setUserPassword(e.target.value)}
                                            className="mt-1 block w-full rounded-md darks:bg-slate-900 darks:text-gray-50 border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                        />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 darks:text-gray-100">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            name="confirm-password"
                                            id="confirm-password"
                                            onChange={(e) => setUserConfirmPassword(e.target.value)}
                                            className="mt-1 block w-full rounded-md darks:bg-slate-900 darks:text-gray-50 border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                        />
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
                                                placeholder="e.g. 4123456"
                                                aria-describedby="phone-website-description"
                                                onChange={(e) => setUserPhoneNumber(e.target.value)}
                                                value={userPhoneNumber}


                                            />
                                        </div>
                                    </div>



                                   
                                    <div className="col-span-6">
                                        <label htmlFor="about" className="block text-sm font-medium text-gray-700 darks:text-gray-100">
                                            About
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="about"
                                                onChange={(e) => setUserAbout(e.target.value)}
                                                name="about"
                                                rows={3}
                                                className="shadow-sm focus:ring-green-500 darks:bg-slate-900 darks:text-gray-50 focus:border-green-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                                placeholder="Hi, I am a..., I love to..."
                                                defaultValue={''}
                                            />
                                        </div>

                                    </div>



                                    
                                    <div className="col-span-6">
                                        <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-700 darks:text-gray-100">
                                            Cover Photo
                                        </label>
                                        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 darks:bg-gray-700 px-6 pt-5 pb-6">
                                            <div className="space-y-1 text-cente justify-between">
                                                <svg
                                                    className="mx-auto h-12 w-12 text-gray-400"
                                                    stroke="currentColor"
                                                    //   onChange={(e) => setPhotoUrl(e.target.files[0])}
                                                    fill="none"
                                                    viewBox="0 0 48 48"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                <div className="flex text-sm text-gray-600">
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="relative cursor-pointer rounded-md darks:bg-slate-700 darks:text-gray-50 bg-white font-medium text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 hover:text-green-500"
                                                    >
                                                        <span>Upload a file</span>
                                                        <input id="file-upload" name="file-upload" type="file" className="sr-only"
                                                        // onChange={(e) => setPhotoUrl(e.target.files[0])} 
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                            </div>
                                            {/* {photoUrlUrl && <img src={photoUrlUrl} alt="Uploaded Images" className="rounded-lg shadow-sm h-24 w-24" />} */}
                                        </div>
                                        {/* <progress value={photoProgress} className='flex w-full bg-orange-800 h-2 rounded shadow-orange-500' max="100" /> */}


                                    </div>


                                </div>

                                
                                {/* Error Message */}
                                {error &&
                                <div className="flex justify-center mt-5">
                                    <Alert message={error} type="error" showIcon style={{ width: '100%' }} />
                                </div>
                                }

                                {/* Success Message */}


                            </div>
                             
                            <div className="bg-gray-50 darks:bg-slate-900 darks:text-gray-50 px-4 py-3 text-right sm:px-6">
                                <button
                                    type="submit"
                                    onClick={(e) => HandleSignupSubmit(e)}
                                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    Create Account
                                </button>

                                

                            </div>

                            

                        </div>

                    </form>

                </div>

            </div>

            <div className="text-center text-gray-500 ">
                <p>Wrong information? <Link to="/" className="text-green-500">Go back</Link></p>

            </div>

        </div>
    )
}

export default Signup