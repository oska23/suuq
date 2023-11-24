import { createContext, useContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail,
    sendEmailVerification,
  } from 'firebase/auth';
  import { auth, db, storage } from '../firebase';
  import { setDoc, doc, getDoc } from 'firebase/firestore';
  import { getDownloadURL, ref } from "firebase/storage";
  import { useNavigate } from 'react-router-dom';
  import { message } from 'antd';
import Alert from 'antd/es/alert/Alert';

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentUser, setCurrentUser] = useState({});
    const [userNumber, setUserNumber] = useState('');

    const navigate = useNavigate();

    const HandleSignup = async (firstName, lastName, email, password, number, about, photoURL) => {
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(auth.currentUser, { displayName: firstName + ' ' + lastName, photoURL: photoURL, number: number });
            await setDoc(doc(db, 'users', user.uid), {
                firstName: firstName,
                lastName: lastName,
                email: email,
                number: number,
                about: about,
                photoURL: photoURL,
                uid: user.uid,
                dataCreated: user.metadata.creationTime,
            });
            await sendEmailVerification(user);
            navigate('/');
            setUser(user);
            setSuccess('Account created successfully. Please verify your email.');
        } catch (error) {
            setError(error.message);
        }
    }

    const HandleLogin = async (email, password) => {
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            setUser(user);
            navigate('/');
        } catch (error) {
            setError(error.message);
        }
    }

    const HandleLogout = async () => {
        try {
            await signOut(auth);
            setUser({});
            navigate('/');
        } catch (error) {
            setError(error.message);
        }
    }

    const handleResetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            setSuccess('Password reset email sent successfully.');
        } catch (error) {
            setError(error.message);
        }
    }

    const handleUpdateProfile = async (firstName, lastName, number, about, photoURL) => {
        try {
            const { user } = await updateProfile(auth.currentUser, { displayName: firstName + ' ' + lastName, photoURL: photoURL });
            await setDoc(doc(db, 'users', user.uid), {
                firstName: firstName,
                lastName: lastName,
                number: number,
                about: about,
                photoURL: photoURL,
                uid: user.uid,
                dataCreated: user.metadata.creationTime,
            });
            setUser(user);
            setSuccess('Profile updated successfully.');
            navigate('/myListings');
        } catch (error) {
            setError(error.message);
            Alert(error.message);
        }
    }

    const handleUpdatePassword = async (password) => {
        try {
            await auth.currentUser.updatePassword(password);
            setSuccess('Password updated successfully.');
        } catch (error) {
            setError(error.message);
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            console.log(currentUser);
        }
        );
        return unsubscribe;
    }
        , []);


    return (
        <UserContext.Provider value={{ 
            user, 
            error, 
            success, 
            HandleSignup, 
            HandleLogin, 
            HandleLogout, 
            handleResetPassword, 
            handleUpdateProfile, 
            handleUpdatePassword 
            }}>
            {children}
        </UserContext.Provider>
    );

}

export const useAuth = () => {
    return useContext(UserContext);
}