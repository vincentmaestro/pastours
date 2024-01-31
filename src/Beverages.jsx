import { useEffect, useState, useContext } from "react";
import { collection, addDoc, getDocs} from "firebase/firestore";
import { database, signInState } from "./App";
import Loading from "./loading";
import { atc } from "./App";
import { Link } from "react-router-dom";

function Beverages() {
    const {currentState, dispatch} = useContext(signInState);
    const [products, setProducts] = useState(null);
    const [error, setError] = useState('');
    const db = useContext(database);
    const addToCart = useContext(atc);


    async function getProducts() {
        const carbonatedDrinks = (await getDocs(collection(db, 'beverages', 'items', 'carbonatedDrinks'))).docs;
        const chocolateAndDiary = (await getDocs(collection(db, 'beverages', 'items', 'chocolateAndDiary'))).docs;
        const energyDrinks = (await getDocs(collection(db, 'beverages', 'items', 'energyDrinks'))).docs;
        const juice = (await getDocs(collection(db, 'beverages', 'items', 'juice'))).docs;
        const maltDrinks = (await getDocs(collection(db, 'beverages', 'items', 'maltDrinks'))).docs;
        const powderedDrinks = (await getDocs(collection(db, 'beverages', 'items', 'powderedDrinks'))).docs;
        const sodaWater = (await getDocs(collection(db, 'beverages', 'items', 'sodaWater'))).docs;
        const water = (await getDocs(collection(db, 'beverages', 'items', 'water'))).docs;
        const yoghurt = (await getDocs(collection(db, 'beverages', 'items', 'yoghurt'))).docs;

        if(!carbonatedDrinks.length) throw Error('Failed to fetch data. Please check your connection and retry');
        else return {carbonatedDrinks, powderedDrinks, chocolateAndDiary, energyDrinks, juice, maltDrinks, sodaWater, water, yoghurt};
    }
    
    useEffect(() => {
        // fetch('http://localhost:8000/beverages')
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
            {error && <p className="text-center text-xl">{error}</p>}
            {products && 
                <div className="products w-[60%] bg-slate-100 rounded-[10px] pl-[2%] laptop_s:w-[72%] tablet:w-full" onClick={addToCart}>
                    <section id="Water" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Water</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.water.map((water, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-gray-600 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-gray-800 select-none">share</span>
                                    <Link to={`product?category=beverages&section=water&product=${water.id}`}><img src={water.data().image} alt={water.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{water.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{water.data().size}</p>
                                    <p className="text-center text-[14px] text-[#fd7d14c9] font-bold">{water.data().price}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Soda water" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Soda water</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.sodaWater.map((sodaWater, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-gray-600 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-gray-800 select-none">share</span>
                                    <Link to={`product?category=beverages&section=sodaWater&product=${sodaWater.id}`}><img src={sodaWater.data().image} alt={sodaWater.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{sodaWater.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{sodaWater.data().size}</p>
                                    <p className="text-center text-[14px] text-[#fd7d14c9] font-bold">{sodaWater.data().price}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Carbonated drinks" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Carbonated Drinks</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.carbonatedDrinks.map((carbonatedDrink, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-gray-600 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-gray-800 select-none">share</span>
                                    <Link to={`product?category=beverages&section=carbonatedDrinks&product=${carbonatedDrink.id}`}><img src={carbonatedDrink.data().image} alt={carbonatedDrink.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{carbonatedDrink.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{carbonatedDrink.data().size}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Powdered drinks" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Powdered drinks</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.powderedDrinks.map((powderedDrink, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-gray-600 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-gray-800 select-none">share</span>
                                    <Link to={`product?category=beverages&section=powderedDrinks&product=${powderedDrink.id}`}><img src={powderedDrink.data().image} alt={powderedDrink.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{powderedDrink.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{powderedDrink.data().size}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Chocolate and diary" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Chocolate and diary</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.chocolateAndDiary.map((chocolateAndDiary, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-gray-600 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-gray-800 select-none">share</span>
                                    <Link to={`product?category=beverages&section=chocolateAndDiary&product=${chocolateAndDiary.id}`}><img src={chocolateAndDiary.data().image} alt={chocolateAndDiary.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{chocolateAndDiary.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{chocolateAndDiary.data().size}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Juice" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Juice</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.juice.map((juice, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-gray-600 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-gray-800 select-none">share</span>
                                    <Link to={`product?category=beverages&section=juice&product=${juice.id}`}><img src={juice.data().image} alt={juice.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{juice.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{juice.data().size}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Energy drinks" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Energy Drinks</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.energyDrinks.map((energyDrink, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-gray-600 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-gray-800 select-none">share</span>
                                    <Link to={`product?category=beverages&section=energyDrink&product=${energyDrink.id}`}><img src={energyDrink.data().image} alt={energyDrink.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{energyDrink.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{energyDrink.data().size}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Malt drinks" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Malt Drinks</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.maltDrinks.map((maltDrink, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-gray-600 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-gray-800 select-none">share</span>
                                    <Link to={`product?category=beverages&section=maltDrinks&product=${maltDrink.id}`}><img src={maltDrink.data().image} alt={maltDrink.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{maltDrink.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{maltDrink.data().size}</p>
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
 
export default Beverages;