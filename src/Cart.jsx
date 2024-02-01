import { useContext, useEffect, useState } from "react";
import { database, signInState } from "./App";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";

function Cart({auth}) {
    const {currentState, dispatch} = useContext(signInState);
    const [items, setItems] = useState(null);
    const db = useContext(database);

    // async function fetchItems() {
    //     const cart = onSnapshot()
    //     return cart;
    // }

    useEffect(() => {
        onSnapshot(collection(db, 'users', auth.currentUser.uid, 'cart'), cart => {
            setItems(cart.docs);
        })
    }, []);

    function deleteItem(e) {
        const item = e.target.parentElement.parentElement.getAttribute('id');
        deleteDoc(doc(db, 'users', auth.currentUser.uid, 'cart', item))
        .then()
        .catch(error => dispatch({case: 'userAction', state: true, prompt: error}));
    }

    return (
        <div className="fixed bg-orange-200 w-full h-full z-[2]">
            <button className="material-symbols-outlined relative top-[2%] left-[95%] mobile:left-[90%]" onClick={() => dispatch({case: 'showCart', state: !currentState.showCart})}>close</button>
            <div className="select-none">
                <h1 className="text-center text-4xl">Cart <span className="material-symbols-outlined">shopping_cart</span></h1>
                <button className="flex items-center text-[15px] font-semibold relative left-[73%] laptop:left-[83%] tablet:left-[80%] mobile:left-[80%] mobile:hidden">Clear cart<span className="material-symbols-outlined block text-[22px] text-red-600">delete</span></button>
                <button className="material-symbols-outlined text-[22px] text-red-600 hidden relative left-[86%] mobile:block">delete</button>
            </div>
            <div className="mt-[3%]" onClick={e => (e.target.tagName === 'BUTTON' && e.target.textContent === 'delete') ? deleteItem(e) : null}>
                { items &&
                    items.length ? items.map(item => (
                        <div key={item.id} id={item.id} className="w-[60%] px-[1%] flex items-center justify-between shadow-sm shadow-[#213438] mx-auto rounded-md mb-[12px] laptop:w-[85%] mobile:py-[1%]">
                            <div className="w-[75%] flex gap-x-[2%] items-center tablet:w-[70%] tablet:gap-x-[4%]">
                                <div className="w-[9%] rounded-lg overflow-hidden tablet:w-[12%] mobile:w-[14%]">
                                    <img src={item.data().image} alt={item.data().item} />
                                </div>
                                <div className="w-[53%] tablet:w-[85%]">
                                    <p>{item.data().item}</p>
                                    <p>{item.data().size}</p>
                                </div>
                            </div>
                            <div className="w-[10%] flex items-center gap-x-[10%] tablet:w-[13%] mobile:w-[22%]">
                                <input className="w-[70%] h-[22px] rounded-[6px] outline-none" type="number" defaultValue={item.data().quantity} min={1} />
                                <button className="material-symbols-outlined block text-[22px] text-red-600">delete</button>
                            </div>
                        </div>
                    )) :
                    <p className="text-center">No items in cart</p>
                }
            </div>
        </div>
    );
}
 
export default Cart;