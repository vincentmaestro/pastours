import { useReducer, createContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { VerifyEmail } from './LoginAndSignup';
import Validate from './Validate';
import Navbar from './Navbar';
import Home from './Home';
import Store from './Store';
import Beverages from './Beverages';
import SnacksAndBaked from './SnacksAndBaked';
import Provisions from './Provisions';
import IceCream from './IceCream';
import ProductPage from './ProductPage';
import Foodoutlets from './foodOutlets';

export const signInState = createContext();
export const atc = createContext();
export const database = createContext();

const firebaseConfig = {
  apiKey: "AIzaSyCW2hUbLZ1YQYY-Y9Y24htwUzxpoCqUcbg",
  authDomain: "pastours.firebaseapp.com",
  projectId: "pastours",
  storageBucket: "pastours.appspot.com",
  messagingSenderId: "454686096959",
  appId: "1:454686096959:web:3d98830d5301e35bc6028a",
  measurementId: "G-HJHKZEW8W9"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const initialState = {
  start: false,
  isLoading: false,
  isLoggedIn: false,
  animateMessage: false,
  signInMessage: '',
  greeting: '',
  showCart: false
};

function reducer(s, a) {
  switch(a.case) {
    case 'start': return { ...s, start: a.state };
    case 'loading': return { ...s, isLoading: a.state };
    case 'animate': return { ...s, animateMessage: a.state };
    case 'greet': return { ...s, greeting: a.greeting };
    case 'logged_in': return { ...s, isLoggedIn: a.state };
    case 'showCart': return { ...s, showCart: a.state };

    case 'sign_in_successful':
    return {
      isLoggedIn: true,
      signInMessage: a.message
    };

    case 'sign_in_error':
    return {
      isLoggedIn: false,
      signInMessage: 'An error occured'
    };

    default: return s;
  }
}

function App() {
  const [currentState, dispatch] = useReducer(reducer, initialState);
  const today = new Date();
  const hour = today.getHours();
  const [promptVerification, setPromptVerification] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(user) dispatch({case: 'logged_in', state: true});
      if(auth.currentUser === null) dispatch({case: 'logged_in', state: false});
    });
  }, [currentState.isLoggedIn]);
  
  useEffect(() => {
      if (hour < 12) {
        dispatch({case: 'greet', greeting: 'Good Morning '});
      }
      else if (hour >= 12 && hour < 17) {
        dispatch({case: 'greet', greeting: 'Good Afternoon '});
      }
      else if (hour >= 17) {
        dispatch({case: 'greet', greeting: 'Good Evening '});
      }
  }, [currentState.isLoggedIn, hour]);

  useEffect(() => {
    if(currentState.isLoggedIn) {
      const then = new Date();
      const mins = then.getMinutes();
      if(!auth.currentUser.emailVerified){
        const timer = setInterval(() => {
          const now = new Date();
          const minutes = now.getMinutes();
          if(minutes >= mins + 4) {
            setPromptVerification(true);
            clearInterval(timer);
          }
        }, 60000);
      }
    }
  }, [promptVerification]);

  function addToCart(e) {
    const isANumber = /^\d+$/;
    if(e.target.tagName === 'BUTTON' && e.target.textContent === 'Add to cart') {
      if(!isANumber.test(e.target.parentElement.childNodes[0].value) || e.target.parentElement.childNodes[0].value < 1)
      return;
      else {
        const item = e.target.parentElement.parentElement.childNodes[1].textContent;
        const image = e.target.parentElement.parentElement.childNodes[0].firstChild.src;
        const quantity = e.target.parentElement.childNodes[0].value;
        fetch('http://localhost:8000/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({item, image, quantity})
        })
        .then()
        .catch(error => console.log(error));
        // cart = [...cart, `${quantity} pcs of ${item}`];
        // cart = [...cart, {item, quantity}];
      }
    }
  }

  return (
    <HelmetProvider>
      <signInState.Provider value={{currentState, dispatch}}>
        <atc.Provider value={addToCart}>
          <database.Provider value = {db}>
            <BrowserRouter>
              {promptVerification && <VerifyEmail auth = {auth} showPrompt = {setPromptVerification} />}
              <Navbar auth = {auth} />
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='validate' element={<Validate auth = {auth} />} />
                <Route path='store' element={<Store />} >
                  <Route index element={<Beverages />} />
                  <Route path='beverages' element={<Beverages />} />
                  <Route path='snacksandbaked' element={<SnacksAndBaked />} />
                  <Route path='icecream' element={<IceCream />} />
                  <Route path='provisions' element={<Provisions />} />
                </Route>
                <Route path='store/*' element={<ProductPage />} />
                <Route path='food-outlets' element={<Foodoutlets />} />
              </Routes>
            </BrowserRouter>
          </database.Provider>
        </atc.Provider>
      </signInState.Provider>
    </HelmetProvider>
  );
}

export default App
