import { useEffect, useState, useContext } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { database, applicationState, userActions } from "./App";
import Loading from "./loading";
import { Link } from "react-router-dom";

function SnacksAndBaked() {
    const {currentState, dispatch} = useContext(applicationState);
    const [products, setProducts] = useState(null);
    const [error, setError] = useState('');
    const db = useContext(database);
    const {addToCart, favouriteItem, shareItem} = useContext(userActions);

    async function getProducts() {
        const biscuits = (await getDocs(collection(db, 'snacksandbaked', 'items', 'biscuits'))).docs;
        const bread = (await getDocs(collection(db, 'snacksandbaked', 'items', 'bread'))).docs;
        const cakes = (await getDocs(collection(db, 'snacksandbaked', 'items', 'cakes'))).docs;
        const chocolates = (await getDocs(collection(db, 'snacksandbaked', 'items', 'chocolates'))).docs;
        const crispsAndChips = (await getDocs(collection(db, 'snacksandbaked', 'items', 'crispsandchips'))).docs;

        if(!biscuits.length) throw Error('Failed to fetch data. Please check your connection and retry');
        else return {biscuits, bread, cakes, chocolates, crispsAndChips};
    }

    useEffect(() => {
        // fetch('http://localhost:8000/SnacksAndBaked')
        // .then(products => products.json())
        // .then(products => setProducts(products))
        // .catch(error => console.log(error));
        dispatch({case: 'loading', state: true});
        getProducts()
        .then(products => {
            dispatch({case: 'loading', state: false});
            setProducts(products);
        })
        .catch(error => {
            dispatch({case: 'loading', state: false});
            setError(error.message)
        });
    }, []);

    function checkAction(e) {
        if(e.target.tagName === 'BUTTON' && e.target.textContent === 'Add to cart') addToCart(e);
        if(e.target.tagName === 'SPAN' && e.target.textContent === 'favorite') favouriteItem(e);
        if(e.target.tagName === 'SPAN' && e.target.textContent === 'share') shareItem(e);
    }

    return (
        <>
            {currentState.isLoading && <Loading />}
            {error && <p>{error}</p>}
            {products &&
                <div className="products w-[60%] bg-slate-100 rounded-[10px] pl-[2%] laptop_s:w-[72%] tablet:w-full" onClick={checkAction}>
                    <section id="Biscuits/Cookies" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Biscuits/Cookies</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.biscuits.map((biscuit, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30.5%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-orange-400 select-none">share</span>
                                    <Link to={`product?category=snacksandbaked&section=biscuits&product=${biscuit.id}`}><img src={biscuit.data().image} alt={biscuit.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{biscuit.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{biscuit.data().size}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px] add-section">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Chocolates" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Chocolates</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.chocolates.map((chocolate, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 hover:shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30.5%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-orange-400 select-none">share</span>
                                    <Link to={`product?category=snacksandbaked&section=chocolates&product=${chocolate.id}`}><img src={chocolate.data().image} alt={chocolate.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{chocolate.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{chocolate.data().size}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px] add-section">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Crisps/Chips" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Crisps & Chips</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.crispsAndChips.map((crispsAndChip, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30.5%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-orange-400 select-none">share</span>
                                    <Link to={`product?category=snacksandbaked&section=crispsandchips&product=${crispsAndChip.id}`}><img src={crispsAndChip.data().image} alt={crispsAndChip.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{crispsAndChip.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{crispsAndChip.data().size}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px] add-section">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Bread" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Bread</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.bread.map((bread, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30.5%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-orange-400 select-none">share</span>
                                    <Link to={`product?category=snacksandbaked&section=bread&product=${bread.id}`}><img src={bread.data().image} alt={bread.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{bread.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{bread.data().size}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px] add-section">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Cakes" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Cakes</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.cakes.map((cake, key) => (
                                <div id={cake.id} key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30.5%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-orange-400 select-none">share</span>
                                    <Link to={`product?category=snacksandbaked&section=cakes&product=${cake.id}`}><img src={cake.data().image} alt={cake.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{cake.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{cake.data().size}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px] add-section">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            }
        </>
    );
}
 
export default SnacksAndBaked;