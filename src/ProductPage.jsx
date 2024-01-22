import { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { database, signInState } from "./App";
import { doc, getDoc } from "firebase/firestore";
import Loading from "./loading";

function ProductPage () {
    const {currentState, dispatch} = useContext(signInState);
    const db = useContext(database);
    const [url] = useSearchParams();
    const category = url.get('category');
    const section = url.get('section');
    const productId = url.get('product');
    const [product, setProduct] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function getProduct() {
        const product = (await getDoc(doc(db, category, 'items', section, productId))).data();
        return product;
    }

    useEffect(() => {
        dispatch({case: 'loading', state: true});
        getProduct()
        .then(product => {
            dispatch({case: 'loading', state: false});
            setProduct(product);
        })
        .catch(() => {
            dispatch({case: 'loading', state: false});
            setError('Failed to fetch product. Please check your connection and retry');
        });
    }, []);

    return (
    <div className="">
        {currentState.isLoading && <Loading />}
        {error && <p className="text-center relative top-[20%]">{error}</p>}
        <div className="bg-orange-400">
            <button className="material-symbols-outlined relative top-[10px] ml-[2%] mobile:ml-[3%] mobile:text-[17px]" onClick={() => navigate(-1)}>arrow_back_ios</button>
            <div className="flex flex-col items-center relative top-[5%] tablet:top-[8%]">
                <div className="w-[20%] laptop:w-[25%] mobile:w-[40%]"><img src={product.image} alt={product.name} /></div>
                <div className="mt-[1%] laptop:mt-[2%] mobile:mt-[4%]">
                    <p className="text-2xl tablet:text-xl">{product.name} <span>{product.size}</span></p>
                    <p>{product.price}</p>
                    <p>{product.description}</p>
                </div>
            </div>
        </div>
        <div className="flex justify-center gap-x-[10px] py-[10px] bg-slate-300">
            <input type="number" min={1} className="w-[4%] h-[22px] rounded-[5px] outline-none laptop:w-[5%] tablet:w-[6%] mobile:w-[10%]" />
            <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[2px] rounded-[4px]">Add to cart</button>
        </div>
    </div>
    );
}

export default ProductPage;