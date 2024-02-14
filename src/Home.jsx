import { useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { Helmet } from 'react-helmet-async';
import Footer from './Footer';

function Home() {

    useEffect(() => {
        return () => {
            sessionStorage.removeItem('currentSection');
            sessionStorage.removeItem('scrollHeight');
        }
    }, []);

    return (
        <>
            {/* <Helmet>
                <script src="./src/js/jquery.js"></script>
                <script src="./src/js/jquerymigrate.js"></script>
                <script src="./src/js/slick.min.js"></script>
                <script src="./src/js/slickCarousel.js"></script>
                <link rel="stylesheet" href="./src/css/slick.css" />
                <link rel="stylesheet" href="./src/css/slick-theme.css" />
            </Helmet> */}

            <section className="select-service py-[4%] flex flex-col gap-y-[50px] tablet:gap-y-[30px] mobile:gap-y-[12px]">
                <div className="gap-[12%] flex justify-center laptop_s:gap-x-[8%] mobile:flex-col mobile:gap-y-[12px] mobile:items-center">
                    <Link to="store" className="store w-[320px] h-[190px] rounded-[16px] text-center hover:scale-[1.1] transition transition-duration: 150ms; laptop_s:w-[290px] tablet:w-[260px] tablet:h-[160px] tablet:hover:scale-[1.04] mobile:w-[210px] mobile:h-[120px] shadow-md shadow-slate-300">
                        <h1>STORE</h1>
                    </Link>
                    <Link to="food-outlets" className="food-outlets w-[320px] h-[190px] rounded-[16px] text-center hover:scale-[1.1] transition transition-duration: 150ms; laptop_s:w-[290px] tablet:w-[260px] tablet:h-[160px] tablet:hover:scale-[1.04] mobile:w-[210px] mobile:h-[120px] shadow-md shadow-slate-300">
                        <h1>Food Outlets</h1>
                    </Link>
                </div>
                <Link to="/stores" className="send-recieve inline-block self-center w-[320px] h-[190px] rounded-[16px] text-center hover:scale-[1.1] transition transition-duration: 150ms; laptop_s:w-[290px] tablet:w-[260px] tablet:h-[160px] tablet:hover:scale-[1.04] mobile:w-[210px] mobile:h-[120px] shadow-md shadow-slate-300">
                    <h1>Send&Receive</h1>
                </Link>
            </section>
            <section className="why-us bg-orange-200 py-6 tablet:py-2 mobile:pb-4 border-b border-slate-100">
                <h1 className="text-center font-bold text-[40px] tablet:text-[34px]">Why choose us?</h1>
                <p className="w-[75%] mx-auto text-lg font-light laptop_s:w-[85%] tablet:text-base mobile:text-sm">Situated in the heart of the city with networks and routes optimised to deliver effective service rendering. We are a goal-driven company committed to giving only the best to our customers. Our vision is to see what you need delivered to you right on time</p>
            </section>
            <Footer />
        </>
    );
}
 
export default Home;