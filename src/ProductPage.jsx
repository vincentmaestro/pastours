import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
    <div className="bg-slate-100">
        {currentState.isLoading && <Loading />}
        {error && <p className="text-center relative top-[20%]">{error}</p>}
        {
            <div className="flex flex-col items-center relative top-[5%] tablet:top-[8%]">
                <div className="w-[20%] laptop:w-[25%] mobile:w-[40%]"><img src={product.image} alt={product.name} /></div>
                <div className="mt-[1%] laptop:mt-[2%] mobile:mt-[4%]">
                    <p className="text-2xl tablet:text-xl">{product.name} <span>{product.size}</span></p>
                    <p>{product.price}</p>
                    <p>{product.description}</p>
                </div>
            </div>
        }
    </div>
    );
}
 
export default ProductPage;