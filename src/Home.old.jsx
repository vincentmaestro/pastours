import { useState, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { signInState } from './App';
import Navbar from './Navbar';
import LoginandSignup from './LoginAndSignup';
import Loading from './loading';
import Footer from './Footer';

function Home({auth}) {
    const {currentState, dispatch} = useContext(signInState);
    const [restaurants, setRestaurants] = useState([]);
    const [fastfoods, setFastfoods] = useState([]);

    useEffect( () => {
        fetch('http://localhost:8000/Eateries')
        .then(data => data.json())
        .then(data => setRestaurants(data));

        fetch('http://localhost:8000/Fastfoods')
        .then(data => data.json())
        .then(data => setFastfoods(data));
    }, []);

    return (
        <>
            <Helmet>
                <script src="./src/js/jquery.js"></script>
                <script src="./src/js/jquerymigrate.js"></script>
                <script src="./src/js/slick.min.js"></script>
                <script src="./src/js/slickCarousel.js"></script>
                <link rel="stylesheet" href="./src/css/slick.css" />
                <link rel="stylesheet" href="./src/css/slick-theme.css" />
            </Helmet>

            { currentState.start && <LoginandSignup auth = {auth} /> }
            { currentState.isLoading ? <Loading /> : null }

            <Navbar auth = {auth} />

            <div className="landing-view">
                <section className="welcome-offers flex justify-center  mt-4">
                    <div className="briefing w-[45%]">
                        <h1 className="service-brief text-[45px] w-[80%] leading-[1.2] mb-5">Enjoy delicious meals from your favourite vendors delivered to you within snaps</h1>
                        <p className="briefing-continued text-[19px] font-light w-[90%] mb-5">With an optimized network of dispatch riders with professional experience and quality routes to get your meals/drinks delivered on time, we work all round the clock to see your taste buds timely cured</p>
                        <button type="button" name="place order" className="place-order py-[7px] px-[15px] rounded-[30px] text-yellow-50 text-[17px] font-medium">Place an order</button>
                    </div>

                    <div className="item-stores w-[45%] flex">
                        {
                            restaurants && restaurants.map(restaurant => (
                                <div className="store" key={restaurant.id}>
                                    <div className="store-snapshot">
                                        <img src={restaurant.image} alt={restaurant.name} className="w-full h-[400px] object-fill"/>
                                    </div>
                                    <div className="store-description">
                                        <h1>{restaurant.name}</h1>
                                        <p>{restaurant.address}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </section>
            </div>

            <section className="fastfood relative mb-6">
                <h1 className="heading text-center text-3xl my-8">Popular Delicacies...</h1>
                <i className="fa-solid fa-less-than text-gray-600 leading-[.7] absolute top-[43%] left-[5%] pointer-events-none"></i>
                <div className="joints flex w-[85%] mx-auto">
                    {
                        fastfoods && fastfoods.map(joint => (
                            <div className="fastfood-store" key={joint.id}>
                                <h1 className="fastfood-name text-center font-semibold">{joint.name}</h1>
                                <div className="product-capture w-[190px] h-[190px] mx-auto shadow-2xl my-4">
                                    <img src={joint.image} alt={joint.description} className="product-image w-full h-full object-cover"/>
                                </div>
                                <p className="product-description text-center">{joint.description}</p>
                            </div>
                        ))
                    }
                </div>
                <i className="fa-solid fa-greater-than text-gray-600 leading-[.7] absolute top-[43%] right-[5%] pointer-events-none"></i>
                <button type="button" className="place-order py-[7px] px-[19px] rounded-[30px] mx-auto mt-5 block text-yellow-50 text-[17px] font-medium">See all</button>
            </section>

            <section className="about-us bg-orange-200 py-6">
                <h1 className="text-center font-bold text-[40px]">Why choose us?</h1>
                <p className="w-3/4 mx-auto text-lg font-light">Situated in the heart of the Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit, fuga. mainland with networks and routes optimised to deliver effective service rendering. We are a goal-driven company committed to giving only the best to our customers. Our vision is Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vitae, consequuntur. to see what you need delivered to you right on time Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim consequuntur consequatur, dolorum autem neque excepturi. Exercitationem atque iste iusto sed. </p>
            </section>

            <Footer />
        </>
    );
}
 
export default Home;