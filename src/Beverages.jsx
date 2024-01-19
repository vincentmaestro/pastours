import { useEffect, useState, useContext } from "react";
import { collection, addDoc, getDocs} from "firebase/firestore";
import { database, signInState } from "./App";
import Loading from "./loading";
import { atc } from "./App";
import { Link } from "react-router-dom";
import { getStorage, ref, getDownloadURL, getBlob } from 'firebase/storage';

function Beverages() {
    const {currentState, dispatch} = useContext(signInState);
    const [products, setProducts] = useState(null);
    const [error, setError] = useState('');
    const db = useContext(database);
    const addToCart = useContext(atc);
    const storage = getStorage();


    async function getProducts() {
        const carbonatedDrinks = (await getDocs(collection(db, 'beverages', 'items', 'carbonatedDrinks'))).docs;
        const chocolateAndDiary = (await getDocs(collection(db, 'beverages', 'items', 'chocolateAndDiary'))).docs;
        const energyDrinks = (await getDocs(collection(db, 'beverages', 'items', 'energyDrinks'))).docs;
        const juice = (await getDocs(collection(db, 'beverages', 'items', 'juice'))).docs;
        const maltDrinks = (await getDocs(collection(db, 'beverages', 'items', 'maltDrinks'))).docs;
        const water = (await getDocs(collection(db, 'beverages', 'items', 'water'))).docs;
        const yoghurt = (await getDocs(collection(db, 'beverages', 'items', 'yoghurt'))).docs;

        if(!carbonatedDrinks.length) throw Error('Failed to fetch data. Please check your connection and retry');
        else return {carbonatedDrinks, chocolateAndDiary, energyDrinks, juice, maltDrinks, water, yoghurt};
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

        getDownloadURL(ref(storage, 'gs://pastours.appspot.com/images/beverages/mirinda_50cl.jpg')).then(url => console.log(url));
        
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
                                <div key={key} className="max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <Link to={`product/?category=beverages&section=carbonatedDrinks&product=${water.id}`}><img src={water.data().image} alt={water.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px]">{water.data().name}</h1>
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
                                <div key={key} className="max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <Link to={`product/?category=beverages&section=carbonatedDrinks&product=${carbonatedDrink.id}`}><img src={carbonatedDrink.data().image} alt={carbonatedDrink.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px]">{carbonatedDrink.data().name}</h1>
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
                                <div key={key} className="max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <Link to={`product/?category=beverages&section=chocolateAndDiary&product=${chocolateAndDiary.id}`}><img src={chocolateAndDiary.data().image} alt={chocolateAndDiary.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px]">{chocolateAndDiary.data().name}</h1>
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
                                <div key={key} className="max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <Link to={`product/?category=beverages&section=juice&product=${juice.id}`}><img src={juice.data().image} alt={juice.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px]">{juice.data().name}</h1>
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
                                <div key={key} className="max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <Link to={`product/?category=beverages&section=energyDrink&product=${energyDrink.id}`}><img src={energyDrink.data().image} alt={energyDrink.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px]">{energyDrink.data().name}</h1>
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
                                <div key={key} className="max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    <Link to={`product/?category=beverages&section=maltDrinks&product=${maltDrink.id}`}><img src={maltDrink.data().image} alt={maltDrink.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px]">{maltDrink.data().name}</h1>
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