import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Foodoutlets() {
    const [stores, setStores] = useState(null);

    useEffect( () => {
        fetch('http://localhost:8000/eateries')
        .then(data => data.json())
        .then(data => setStores(data));
    }, []);

    return (
        <section className="stores grid grid-cols-3 gap-[30px] px-[40px] py-[20px]">
            <div className="bg-slate-300 rounded-[10px] flex items-center justify-center">
                <h1 className="type-of-store text-3xl font-semibold">Eatries</h1>
            </div>
            {
                stores && stores.map(store => (
                    <Link key={store.id} to={`/stores/${store.name}`} className="flex h-[150px] gap-x-4 p-[10px] bg-slate-100 rounded-[10px] transition delay-150 hover:scale-105">
                        <img src={store.image} className="block w-[200px]" alt={store.name} />
                        <div className="store-section">
                            <h1 className="store-name text-2xl font-medium mb-2">{store.name}</h1>
                            <p className="services text-lg leading-6">{store.services}</p>
                        </div>
                    </Link>
                ))
            }
        </section>
    );
}
 
export default Foodoutlets;