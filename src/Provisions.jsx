import { useEffect, useState, useContext } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { database, applicationState, userActions } from "./App";
import Loading from "./loading";
import { Link } from "react-router-dom";

function Provisions() {
    const {currentState, dispatch} = useContext(applicationState);
    const [products, setProducts] = useState(null);
    const [error, setError] = useState('');
    const db = useContext(database);
    const {addToCart, favouriteItem, shareItem} = useContext(userActions);
    async function getProducts() {
        const butter = (await getDocs(collection(db, 'provisions', 'items', 'butter'))).docs;
        const cereals = (await getDocs(collection(db, 'provisions', 'items', 'cereals'))).docs;
        const chocolatePowder = (await getDocs(collection(db, 'provisions', 'items', 'chocolatePowder'))).docs;
        const custard = (await getDocs(collection(db, 'provisions', 'items', 'custard'))).docs;
        const mayonnaiseAndCreams = (await getDocs(collection(db, 'provisions', 'items', 'mayonnaiseAndCreams'))).docs;
        const milkPowder = (await getDocs(collection(db, 'provisions', 'items', 'milkPowder'))).docs;
        const noodles = (await getDocs(collection(db, 'provisions', 'items', 'noodles'))).docs;
        const sugar = (await getDocs(collection(db, 'provisions', 'items', 'sugar'))).docs;

        if(!butter.length) throw Error('Failed to fetch data. Please check your connection and retry')
        else return {butter, cereals, chocolatePowder, custard, mayonnaiseAndCreams, milkPowder, noodles, sugar};
    }

    useEffect(() => {
        // fetch('http://localhost:8000/provisions')
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

    return (
        <>
            {currentState.isLoading && <Loading />}
            {error && <p>{error}</p>}
            {products &&
                <div className="products w-[60%] bg-slate-100 rounded-[10px] pl-[2%] laptop_s:w-[72%] tablet:w-full" onClick={addToCart}>
                    {/* <section id="Chocolate powder" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Chocolate powder</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.chocolatePowder.map((chocolatePowder, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-gray-800 select-none">share</span>
                                    <Link to={`product?category=provisions&section=chocolatePowder&product=${chocolatePowder.id}`}><img src={chocolatePowder.data().image} alt={chocolatePowder.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{chocolatePowder.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{chocolatePowder.data().size}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section> */}
                    <section id="Milk powder" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Milk powder</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.milkPowder.map((milkPowder, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-gray-800 select-none">share</span>
                                    <Link to={`product?category=provisions&section=milkPowder&product=${milkPowder.id}`}><img src={milkPowder.data().image} alt={milkPowder.data().name} /></Link>
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
                    <section id="Cereals" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Cereals</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.cereals.map((cereal, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-gray-800 select-none">share</span>
                                    <Link to={`product?category=provisions&section=cereals&product=${cereal.id}`}><img src={cereal.data().image} alt={cereal.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{cereal.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{cereal.data().size}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Custard" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Custard</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.custard.map((custard, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-gray-800 select-none">share</span>
                                    <Link to={`product?category=provisions&section=custard&product=${custard.id}`}><img src={custard.data().image} alt={custard.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{custard.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{custard.data().size}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Sugar" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Sugar</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.sugar.map((sugar, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-gray-800 select-none">share</span>
                                    <Link to={`product?category=provisions&section=sugar&product=${sugar.id}`}><img src={sugar.data().image} alt={sugar.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{sugar.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{sugar.data().size}</p>
                                    <p className="text-center text-[14px] text-[#fd7d14c9] font-bold">{sugar.data().price}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Butter" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Butter</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.butter.map((butter, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-gray-800 select-none">share</span>
                                    <Link to={`product?category=provisions&section=butter&product=${butter.id}`}><img src={butter.data().image} alt={butter.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{butter.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{butter.data().size}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Mayonnaise & creams" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Mayonnaise & creams</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.mayonnaiseAndCreams.map((mayonnaise, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-gray-800 select-none">share</span>
                                    <Link to={`product?category=provisions&section=mayonnaiseAndCreams&product=${mayonnaise.id}`}><img src={mayonnaise.data().image} alt={mayonnaise.data().name} /></Link>
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
                    <section id="Noodles" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Noodles</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.noodles.map((noodle, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-gray-800 select-none">share</span>
                                    <Link to={`product?category=provisions&section=noodles&product=${noodle.id}`}><img src={noodle.data().image} alt={noodle.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{noodle.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{noodle.data().size}</p>
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
 
export default Provisions;