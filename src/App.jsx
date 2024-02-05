import { useReducer, createContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, addDoc, collection, } from 'firebase/firestore';
import { VerifyEmail } from './LoginAndSignup';
import Validate from './Validate';
import Navbar from './Navbar';
import Home from './Home';
import Store from './Store';
import Beverages from './Beverages';
import SnacksAndBaked from './SnacksAndBaked';
import DiaryEggsSpreads from './DiaryEggsSpreads';
import Provisions from './Provisions';
import IceCream from './IceCream';
import ProductPage from './ProductPage';
import Foodoutlets from './foodOutlets';

export const signInState = createContext();
export const userActions = createContext();
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
  showCart: false,
  userAction: false,
  prompt: ''
};

function reducer(s, a) {
  switch(a.case) {
    case 'start': return { ...s, start: a.state };
    case 'loading': return { ...s, isLoading: a.state };
    case 'animate': return { ...s, animateMessage: a.state };
    case 'greet': return { ...s, greeting: a.greeting };
    case 'logged_in': return { ...s, isLoggedIn: a.state };
    case 'showCart': return { ...s, showCart: a.state };
    case 'userAction': return { ...s, userAction: a.state, prompt: a.prompt };

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
      if(!auth.currentUser.emailVerified) {
        setPromptVerification(true);
      }
    }
  }, []);

  function favouriteItem(e) {
    if(!currentState.isLoggedIn) {
      dispatch({case: 'userAction', state: true, prompt: 'Please sign in to continue'});
      return;
    }
    else {
      const item = e.target.parentElement.childNodes[3].textContent;
      const size = e.target.parentElement.childNodes[4].textContent;
      const image = e.target.parentElement.childNodes[2].firstChild.src;
      addDoc(collection(db, 'users', auth.currentUser.uid, 'favourites'), {item, size, image})
      .then(() => dispatch({case: 'userAction', state: true, prompt: 'Favourited'}))
      .catch(error => dispatch({case: 'userAction', state: true, prompt: error}));
    }
  }

  async function shareItem(e) {
    const itemLink = e.target.parentElement.childNodes[2].href;
    try {
      await navigator.clipboard.writeText(itemLink);
      dispatch({case: 'userAction', state: true, prompt: 'Link copied'});
    }
    catch(error) {
      dispatch({case: 'userAction', state: true, prompt: error});
    }
  }

  function addToCart(e) {
    const isANumber = /^\d+$/;
    if(!currentState.isLoggedIn) {
      dispatch({case: 'userAction', state: true, prompt: 'Please sign in to continue'});
      return;
    }
    else {
      if(!isANumber.test(e.target.parentElement.childNodes[0].value) || e.target.parentElement.childNodes[0].value < 1) {
        dispatch({case: 'userAction', state: true, prompt: 'Item quantity must be at least 1'});
        return;
      }
      else {
        const item = e.target.parentElement.parentElement.childNodes[3].textContent;
        const size = e.target.parentElement.parentElement.childNodes[4].textContent;
        const image = e.target.parentElement.parentElement.childNodes[2].firstChild.src;
        const quantity = e.target.parentElement.childNodes[0].value;
        addDoc(collection(db, 'users', auth.currentUser.uid, 'cart'), {item, size, image, quantity})
        .then(() => dispatch({case: 'userAction', state: true, prompt: 'Added to cart'}))
        .catch(error => dispatch({case: 'userAction', state: true, prompt: error}));
      }
    }
  }

  return (
    <HelmetProvider>
      <signInState.Provider value={{currentState, dispatch}}>
        <userActions.Provider value={{addToCart, favouriteItem, shareItem}}>
          <database.Provider value = {db}>
            <BrowserRouter>
              {promptVerification && <VerifyEmail auth = {auth} showPrompt = {setPromptVerification} />}
              <Navbar auth = {auth} db = {db} />
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='validate' element={<Validate auth = {auth} />} />
                <Route path='store' element={<Store />} >
                  <Route index element={<Beverages />} />
                  <Route path='beverages' element={<Beverages />} />
                  <Route path='snacksandbaked' element={<SnacksAndBaked />} />
                  <Route path='diaryEggsSpreads' element={<DiaryEggsSpreads />} />
                  <Route path='icecream' element={<IceCream />} />
                  <Route path='provisions' element={<Provisions />} />
                </Route>
                <Route path='store/*' element={<ProductPage />} />
                <Route path='food-outlets' element={<Foodoutlets />} />
              </Routes>
            </BrowserRouter>
          </database.Provider>
        </userActions.Provider>
      </signInState.Provider>
    </HelmetProvider>
  );
}

export default App
