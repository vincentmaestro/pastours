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
        <div className="bg-orange-300">
            <button className="material-symbols-outlined relative top-[10px] ml-[2%] mobile:ml-[3%] mobile:text-[17px]" onClick={() => navigate(-1)}>arrow_back_ios</button>
            <div className="flex flex-col items-center laptop:mt-[2%]">
                <div className="w-[16%] laptop:my-[2%] laptop:w-[25%] tablet:w-[45%] mobile:my-[4%]"><img src={product.image} alt={product.name} /></div>
                <div className="">
                    <p className="text-2xl tablet:text-xl text-center">{product.name} <span className="mobile:hidden">{product.size}</span></p>
                    <p className="hidden mobile:block text-xl tablet:text-xl text-center">{product.size}</p>
                    <p className="text-center text-2xl">NGN 500</p>
                    <p className="text-justify w-[85%] mx-auto">Lorem ipsum dolor sit amet consectetur ex non itaque illo corrupti quas nobis, neque veritatis totam dolorem architecto explicabo pariatur possimr sit, amet consectetur adipisicing elit. Cupiditate, nesciunt. Dolore blanditiis illo autem fugit numquam mollitia.</p>
                </div>
            </div>
        </div>
        <div className="flex justify-center gap-x-[10px] py-[20px] bg-slate-300">
            <input type="number" min={1} className="w-[4%] h-[22px] rounded-[5px] outline-none laptop:w-[5%] tablet:w-[6%] mobile:w-[10%] mobile_m:w-[12%]" />
            <button className="text-[14px] font-medium bg-[#fd7d14c9] px-[4px] rounded-[4px]">Add to cart</button>
        </div>
    </div>
    );
}

export default ProductPage;