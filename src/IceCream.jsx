import { useEffect, useState, useContext } from "react";
import { atc } from "./App";

function IceCream() {
    const [products, setProducts] = useState(null);
    const addToCart = useContext(atc);

    useEffect(() => {
        fetch('http://localhost:8000/icecream')
        .then(products => products.json())
        .then(products => setProducts(products));
    }, []);

    return (
        <>
            {products &&
                <div className="products w-[60%] bg-slate-100 rounded-[10px] pl-[2%] laptop_s:w-[72%] tablet:w-full" onClick={addToCart}>
                    <section id="Supreme" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Supreme</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.supreme.map((icecream, key) => (
                                <div key={key} className="max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    {/* <Link to={chocolatePowder.id}><img src={chocolatePowder.data().image} alt={chocolatePowder.data().name} /></Link> */}
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px]">{icecream}</h1>
                                    <div className="flex justify-center gap-x-[6px] py-[8px] bg-slate-300 mobile:flex-col mobile:py-0 mobile:gap-y-[4px]">
                                        <input type="number" min={1} className="w-[30%] h-[22px] rounded-[5px] outline-none mobile:w-[48%] mobile:h-[20px] mobile:mx-auto mobile:mt-1" />
                                        <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section id="Fan" className="mb-[5px]">
                        <h1 className="text-center py-[10px] text-2xl laptop_s:text-3xl">Fan</h1>
                        <div className="flex flex-wrap gap-x-[2%] gap-y-[20px] tablet:gap-x-[3%]">
                            {products.fan.map((icecream, key) => (
                                <div key={key} className="max-w-[18%] h-[10%] rounded-lg hover:shadow-slate-500 shadow-md overflow-hidden laptop_l:max-w-[23%] laptop_s:max-w-[30%] tablet:max-w-[22%] mobile:max-w-[30%]">
                                    {/* <Link to={chocolatePowder.id}><img src={chocolatePowder.data().image} alt={chocolatePowder.data().name} /></Link> */}
                                    <h1 className="text-center font-semibold text-[14px] mobile:text-[12px]">{icecream}</h1>
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
 
export default IceCream;