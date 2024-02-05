import { useContext, useEffect, useState } from "react";
import { signInState } from "./App";
import { Link } from "react-router-dom";
import LoginandSignup from "./LoginAndSignup";
import Loading from "./loading";
import Cart from './Cart';
import { signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";

function Navbar({auth, db}) {
    const {currentState, dispatch} = useContext(signInState);
    const [showUser, setShowUser] = useState(false);
    const [cartItemsCount, setCartItemsCount] = useState(0);

    useEffect(() => {
        onSnapshot(collection(db, 'users', auth.currentUser.uid, 'cart'), cart => {
            setCartItemsCount(cart.docs.length);
        });
    }, []);

    function logout() {
        dispatch({case: 'loading', state: true});
        setShowUser(!showUser)
        signOut(auth).then(() => dispatch({case: 'loading', state: false}));
    }

    return (
        <>
            { currentState.start && <LoginandSignup auth = {auth} /> }
            { currentState.isLoading && <Loading /> }
            { currentState.animateMessage && 
                <div className="action-outcome-message fixed right-0 top-[4%] flex items-center gap-3 font-semibold text-lg py-[6px] px-[25px] rounded-l-[30px] z-[1]" onAnimationEnd={() => dispatch({case: 'animate', state: false})}>
                    <span class="material-symbols-outlined">bookmark</span>
                    <p>{ currentState.signInMessage }</p>
                </div>
            }
            { currentState.showCart && <Cart auth = {auth} /> }

            <nav className="bg-[#212529] py-[10px] flex justify-between items-center px-[8%] tablet:px-[6%] mobile:px-[4%]">
                <Link to="/" className="brand">
                    <h1 className="logo text-[#ffc107] text-5xl tablet:text-4xl mobile:text-2xl">Pastours<span className="material-symbols-outlined bg-[#ffc107f1] text-black rounded-[50%] text-[18px] relative top-[-12px] tablet:text-[14px] mobile:text-[12px]">electric_bolt</span></h1>
                    <span className="motto text-[19px] text-white font-bold tracking-[.7px] relative left-[32%] bottom-1 tablet:text-[16px] tablet:left-[17%] tablet:top-[-8px] mobile:text-[13px] mobile:tracking-[.5px] mobile:top-[-12px] mobile:left-[8%]">we dey deliver...</span>
                </Link>
                
                { currentState.isLoggedIn ? 
                    <div className="flex gap-x-[4%] min-w-[70%] items-center justify-end mobile_m:gap-x-[2%]">
                        <button className="relative material-symbols-outlined text-white cursor-pointer mobile:text-[22px] mobile_m:text-[19px]" onClick={() => dispatch({case: 'showCart', state: !currentState.showCart})}><span className="absolute left-3 bottom-5 bg-orange-400 text-white rounded-[50%] text-[15px] px-[2px] pb-[4px] mobile:text-[12px]">{cartItemsCount}</span> shopping_cart</button>
                        <div className="relative">
                            <div className="user-credentials flex gap-x-1 items-center px-3 py-2 rounded-[20px] cursor-pointer tablet:px-3 tablet:py-[6px]" onClick={() => setShowUser(!showUser)}>
                                {auth.currentUser && <p className="text-white font-semibold mobile:text-[14px] mobile_m:text-[13px]">{currentState.greeting} {auth.currentUser.displayName}</p>}
                                <span className="material-symbols-outlined text-white mobile:text-[17px]">expand_more</span>
                            </div>
                            {showUser && 
                                <div className="about-user w-[90%] h-[600%] bg-[rgba(226,232,240,0.8)] absolute top-[110%] left-1/2 rounded-2xl z-[1]" onMouseOver={() => setShowUser(true)} onMouseOut={() => setShowUser(false)}>
                                    <div className="pt-[16px] pl-[10px]">
                                        <p className="flex items-center gap-x-[20px] mb-[16px] cursor-pointer mobile:gap-x-[10px] mobile:mb-[10px] mobile:text-[14px]"><span className="material-symbols-outlined mobile:text-[17px]">account_circle</span>View profile</p>
                                        <p className="flex items-center gap-x-[20px] mb-[16px] cursor-pointer mobile:gap-x-[10px] mobile:mb-[10px] mobile:text-[14px]"><span className="material-symbols-outlined mobile:text-[17px]">phone</span>Add phone number</p>
                                        <p className="flex items-center gap-x-[20px] mb-[16px] cursor-pointer mobile:gap-x-[10px] mobile:mb-[10px] mobile:text-[14px]" onClick={() => logout()}><span className="material-symbols-outlined mobile:text-[17px]">logout</span>Logout</p>
                                    </div>
                                </div>
                            }
                        </div> 
                    </div> :
                    <button type="button" className="py-[7px] px-[15px] rounded-[30px] bg-orange-500 text-white text-[17px] font-medium tablet:px-[10px] tablet:py-[3px] tablet:text-base tablet_s:text-[14px] tablet_s:py-1 mobile:text-[12px]" onClick={() => dispatch({case: 'start', state: true})}>Get Started</button>
                }
                
            </nav>
        </>
    );
}
 
export default Navbar;