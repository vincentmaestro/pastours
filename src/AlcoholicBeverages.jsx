import { useEffect, useState, useContext } from "react";
import { collection, addDoc, getDocs} from "firebase/firestore";
import { database, signInState, userActions } from "./App";
import Loading from "./loading";
import { Link } from "react-router-dom";

function Alcoholicalcoholics() {
    const {currentState, dispatch} = useContext(signInState);
    const [products, setProducts] = useState(null);
    const [error, setError] = useState('');
    const db = useContext(database);
    const {addToCart, favouriteItem, shareItem} = useContext(userActions);

    async function getProducts() {
        const beer = (await getDocs(collection(db, 'alcoholics', 'items', 'beer'))).docs;
        const cognac = (await getDocs(collection(db, 'alcoholics', 'items', 'cognac'))).docs;
        const champagne = (await getDocs(collection(db, 'alcoholics', 'items', 'champagne'))).docs;
        const gin = (await getDocs(collection(db, 'alcoholics', 'items', 'gin'))).docs;
        const liqueur = (await getDocs(collection(db, 'alcoholics', 'items', 'liqueur'))).docs;
        const redWine = (await getDocs(collection(db, 'alcoholics', 'items', 'redWine'))).docs;
        const rose = (await getDocs(collection(db, 'alcoholics', 'items', 'rose'))).docs;
        const sparklingWine = (await getDocs(collection(db, 'alcoholics', 'items', 'sparklingWine'))).docs;
        const vodka = (await getDocs(collection(db, 'alcoholics', 'items', 'vodka'))).docs;
        const whisky = (await getDocs(collection(db, 'alcoholics', 'items', 'whisky'))).docs;

        if(!beer.length) throw Error('Failed to fetch data. Please check your connection and retry');
        else return {beer, cognac, champagne, gin, liqueur, redWine, rose, sparklingWine, vodka, whisky};
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
            setError(error.message);
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
            {error && <p className="text-center text-xl">{error}</p>}
            {products && 
                <div className="products w-[60%] bg-slate-100 rounded-[10px] pl-[2%] laptop_s:w-[72%] tablet:w-full" onClick={checkAction}>
                    <section id="Beer" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Beer</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.beer.map((beer, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30.5%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-orange-400 select-none">share</span>
                                    <Link to={`product?category=alcoholics&section=beer&product=${beer.id}`}><img src={beer.data().image} alt={beer.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{beer.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{beer.data().size}</p>
                                    <p className="text-center text-[14px] text-[#fd7d14c9] font-bold">{beer.data().price}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Cognac" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Cognac</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.cognac.map((cognac, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30.5%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-orange-400 select-none">share</span>
                                    <Link to={`product?category=alcoholics&section=cognac&product=${cognac.id}`}><img src={cognac.data().image} alt={cognac.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{cognac.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{cognac.data().size}</p>
                                    <p className="text-center text-[14px] text-[#fd7d14c9] font-bold">{cognac.data().price}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Champagne" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Champagne</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.champagne.map((champagne, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30.5%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-orange-400 select-none">share</span>
                                    <Link to={`product?category=alcoholics&section=champagne&product=${champagne.id}`}><img src={champagne.data().image} alt={champagne.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{champagne.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{champagne.data().size}</p>
                                    <p className="text-center text-[14px] text-[#fd7d14c9] font-bold">{champagne.data().price}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Gin" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Gin</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.gin.map((gin, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30.5%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-orange-400 select-none">share</span>
                                    <Link to={`product?category=alcoholics&section=gin&product=${gin.id}`}><img src={gin.data().image} alt={gin.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{gin.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{gin.data().size}</p>
                                    <p className="text-center text-[14px] text-[#fd7d14c9] font-bold">{gin.data().price}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Liqueur" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Liqueur</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.liqueur.map((liqueur, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30.5%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-orange-400 select-none">share</span>
                                    <Link to={`product?category=alcoholics&section=liqueur&product=${liqueur.id}`}><img src={liqueur.data().image} alt={liqueur.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{liqueur.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{liqueur.data().size}</p>
                                    <p className="text-center text-[14px] text-[#fd7d14c9] font-bold">{liqueur.data().price}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Red wine" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Red wine</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.redWine.map((redWine, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30.5%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-orange-400 select-none">share</span>
                                    <Link to={`product?category=alcoholics&section=redWine&product=${redWine.id}`}><img src={redWine.data().image} alt={redWine.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{redWine.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{redWine.data().size}</p>
                                    <p className="text-center text-[14px] text-[#fd7d14c9] font-bold">{redWine.data().price}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Rosé" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Rosé</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.rose.map((rose, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30.5%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-orange-400 select-none">share</span>
                                    <Link to={`product?category=alcoholics&section=rose&product=${rose.id}`}><img src={rose.data().image} alt={rose.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{rose.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{rose.data().size}</p>
                                    <p className="text-center text-[14px] text-[#fd7d14c9] font-bold">{rose.data().price}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Sparkling wine" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Sparkling wine</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.sparklingWine.map((sparklingWine, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30.5%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-orange-400 select-none">share</span>
                                    <Link to={`product?category=alcoholics&section=sparklingWine&product=${sparklingWine.id}`}><img src={sparklingWine.data().image} alt={sparklingWine.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{sparklingWine.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{sparklingWine.data().size}</p>
                                    <p className="text-center text-[14px] text-[#fd7d14c9] font-bold">{sparklingWine.data().price}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Vodka" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Vodka</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.vodka.map((vodka, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30.5%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-orange-400 select-none">share</span>
                                    <Link to={`product?category=alcoholics&section=vodka&product=${vodka.id}`}><img src={vodka.data().image} alt={vodka.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{vodka.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{vodka.data().size}</p>
                                    <p className="text-center text-[14px] text-[#fd7d14c9] font-bold">{vodka.data().price}</p>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Whisky" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Whisky</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.whisky.map((whisky, key) => (
                                <div key={key} className="relative max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30.5%]">
                                    <span className="material-symbols-outlined absolute top-1 left-1 cursor-pointer text-orange-400 select-none">favorite</span>
                                    <span className="material-symbols-outlined absolute top-1 right-1 cursor-pointer text-[22px] text-orange-400 select-none">share</span>
                                    <Link to={`product?category=alcoholics&section=whisky&product=${whisky.id}`}><img src={whisky.data().image} alt={whisky.data().name} /></Link>
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px] truncate">{whisky.data().name}</h1>
                                    <p className="text-center font-semibold text-[14px] mobile:text-[12px]">{whisky.data().size}</p>
                                    <p className="text-center text-[14px] text-[#fd7d14c9] font-bold">{whisky.data().price}</p>
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

export default Alcoholicalcoholics;