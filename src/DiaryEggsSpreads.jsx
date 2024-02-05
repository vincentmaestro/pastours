import { useEffect, useState, useContext } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { database, signInState, userActions } from "./App";
import Loading from "./loading";
import { Link } from "react-router-dom";


function DiaryEggsSpreads() {
    const {currentState, dispatch} = useContext(signInState);
    const [products, setProducts] = useState(null);
    const [error, setError] = useState('');
    const db = useContext(database);
    const {addToCart, favouriteItem, shareItem} = useContext(userActions);

    async function getProducts() {
        const margarine = (await getDocs(collection(db, 'diaryEggsSpreads', 'items', 'margarine'))).docs;
        const mayonnaise = (await getDocs(collection(db, 'diaryEggsSpreads', 'items', 'mayonnaise'))).docs;
        const milk = (await getDocs(collection(db, 'diaryEggsSpreads', 'items', 'milk'))).docs;
        const milkPowder = (await getDocs(collection(db, 'diaryEggsSpreads', 'items', 'milkPowder'))).docs;
        const yoghurtAndDiary = (await getDocs(collection(db, 'beverages', 'items', 'chocolateAndDiary'))).docs;

        if(!margarine.length) Error('Failed to fetch data. Please check your connection and retry');
        else return {margarine, mayonnaise, milk, milkPowder, yoghurtAndDiary};
    }

    useEffect(() => {
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
                    <section id="Milk" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Milk</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.milk.map((milk, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-orange-400 select-none">share</span>
                                    <Link to={`product?category=diaryEggsSpreads&section=milk&product=${milk.id}`}><img src={milk.data().image} alt={milk.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{milk.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{milk.data().size}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Milk powder" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Milk powder</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.milkPowder.map((milkPowder, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-orange-400 select-none">share</span>
                                    <Link to={`product?category=diaryEggsSpreads&section=milkPowder&product=${milkPowder.id}`}><img src={milkPowder.data().image} alt={milkPowder.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{milkPowder.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{milkPowder.data().size}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Yoghurt & diary" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Yoghurt & diary</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.yoghurtAndDiary.map((yoghurtAndDiary, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-orange-400 select-none">share</span>
                                    <Link to={`product?category=beverages&section=chocolateAndDiary&product=${yoghurtAndDiary.id}`}><img src={yoghurtAndDiary.data().image} alt={yoghurtAndDiary.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{yoghurtAndDiary.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{yoghurtAndDiary.data().size}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Margarine" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Margarine</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.margarine.map((margarine, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-orange-400 select-none">share</span>
                                    <Link to={`product?category=diaryEggsSpreads&section=margarine&product=${margarine.id}`}><img src={margarine.data().image} alt={margarine.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{margarine.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{margarine.data().size}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Mayonnaise" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Mayonnaise</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.mayonnaise.map((mayonnaise, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-orange-400 select-none">share</span>
                                    <Link to={`product?category=diaryEggsSpreads&section=mayonnaise&product=${mayonnaise.id}`}><img src={mayonnaise.data().image} alt={mayonnaise.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{mayonnaise.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{mayonnaise.data().size}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
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
 
export default DiaryEggsSpreads;