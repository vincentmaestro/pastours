import { useState, useEffect,  useRef, useContext } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import './css/store.css';
import { database } from "./App";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

function Store() {
    const db = useContext(database);
    const [section, setSection] = useState(sessionStorage.getItem('currentSection') || 'beverages');
    const [subSections, setSubSections] = useState([]);
    const navigate = useNavigate();
    const [promos, setPromos] = useState([]);
    const promosRef = useRef();
    let scrollCount = 0;
    const scrollWidth = window.innerWidth > 530 ? 35 : 52;
    const maxForwardCount = window.innerWidth > 530 ? 4 : 5;
    const maxBackwardCount = window.innerWidth > 530 ? 3 : 4;
    const sectionRef = useRef();
    const subSectionsRef = useRef();

    function moveToSlide(direction) {
        getDocs(collection(db, 'promotions'))
        .then(promos => {
            setPromos(promos.docs);
            promosRef.current.childNodes[0].classList.add('current-slide');
        });

        const cs = Array.from(promosRef.current.childNodes).filter(slide => slide.classList.contains('current-slide'));
        const currentSlide = cs[0];
        const previousSlide = currentSlide.previousElementSibling;
        const nextSlide = currentSlide.nextElementSibling;

        if(direction === 'next') {
            scrollCount++;

            if(scrollCount === maxForwardCount) {
                scrollCount = 0;
                promosRef.current.style.transform = 'translateX(0%)';
                currentSlide.classList.remove('current-slide');
                promosRef.current.childNodes[0].classList.add('current-slide');
            }
            else {
                promosRef.current.style.transform = `translateX(-${scrollWidth * scrollCount}%)`;
                currentSlide.classList.remove('current-slide');
                nextSlide.classList.add('current-slide');
            }
        }

        if(direction === 'previous') {
            scrollCount--;
            
            if(scrollCount < 0) {
                scrollCount = maxBackwardCount;
                promosRef.current.style.transform = `translateX(-${scrollWidth * scrollCount}%)`;
                currentSlide.classList.remove('current-slide');
                promosRef.current.childNodes[5].classList.add('current-slide');
            }
            else {
                promosRef.current.style.transform = `translateX(-${scrollWidth * scrollCount}%)`;
                currentSlide.classList.remove('current-slide');
                previousSlide.classList.add('current-slide');
            }
        }
    }

    function navigateToSection(e) {
        setSection(e.target.value);
        navigate(e.target.value);
    }

    useEffect(() => {
        // fetch('http://localhost:8000/promotions')
        // .then(promos => promos.json())
        // .then(promos => {
        //     setPromos(promos);
        //     promosRef.current.childNodes[0].classList.add('current-slide');
        //     console.log(promos);
        //     setDoc(doc(db, 'promotions', 'premiumPromotions'), promos[5])
        //     .then(() => console.log('product added'))
        //     .catch((error) => console.log(error));
        // });

        const timer = setInterval(() => {
            moveToSlide('next');
        }, 4000);

        onscroll = () => {
            window.scrollY > 140 ? document.querySelector('.Store').setAttribute('data-fixed', 'true') : document.querySelector('.Store').removeAttribute('data-fixed');
            window.scrollY > 307 ? document.querySelector('.Store').setAttribute('data-fixed-tab', 'true') : document.querySelector('.Store').removeAttribute('data-fixed-tab');
            document.querySelector('.products').childNodes.forEach((section, index) => {
                if(window.scrollY >= section.offsetTop - section.clientHeight / 20) {
                    subSectionsRef.current.childNodes.forEach(nav => nav.style.backgroundColor = 'initial');
                    Array.from(subSectionsRef.current.childNodes).filter(nav => nav.getAttribute('id').includes(index))[0].style.backgroundColor = 'white';
                    // Array.from(subSectionsRef.current.childNodes).filter(nav => nav.getAttribute('id').includes(index))[0].scrollIntoView();
                }
                if(window.scrollY < document.querySelector('.products').childNodes[0].offsetTop) {
                    subSectionsRef.current.childNodes.forEach(nav => {
                        nav.style.backgroundColor = 'initial';
                    });
                }
            });
        }

        return () => clearInterval(timer);

    }, []);

    useEffect(() => {
        sessionStorage.setItem('currentSection', section);

        getDoc(doc(db, section, 'subSections'))
        .then(subSection => setSubSections(subSection.data().subSections));

        subSectionsRef.current.childNodes.forEach(nav => nav.style.backgroundColor = 'initial');

        sectionRef.current.childNodes.forEach((section, index) => section.setAttribute('id', `section-${index}`));
        if(location.pathname === '/store') {
            sectionRef.current.childNodes[0].classList.add('active-section');
            return;
        }
        Array.from(sectionRef.current.childNodes).filter(section => {
            if(location.pathname.includes(section.value)) return section;
            else section.classList.remove('active-section');
        })[0]
        .classList.add('active-section');
        Array.from(sectionRef.current.childNodes).filter(section => section.classList.contains('active-section'))[0].scrollIntoView({inline: 'center'});

    }, [section]);
    
    return (
        <div className="Store bg-slate-200 h-screen">
            <h1 className="title-heading text-3xl flex justify-center items-center py-[12px] tablet:text-2xl mobile:py-[4px]">STORE</h1>
            <div className="promotions-tab-mobile hidden tablet:block overflow-x-clip mb-2">
                {!promos.length && <p className="text-center text-xl">Cannot get promotions at this time, please try again</p>}
                <div ref={promosRef} className="w-[94%] mx-auto flex gap-x-[4%] mb-2 transition-transform duration-300 ease-in">
                    {promos.map((promo, position) => (
                        <div key={position} className="min-w-[31%] bg-white rounded-[10px] overflow-hidden mobile:min-w-[48%]">
                            <img src={promo.data().image} alt={promo.data().title} className="h-[160px] w-full mobile:h-[120px]" />
                            <h1 className="text-center font-medium text-[17px] mobile:text-[16px]">{promo.data().title}</h1>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center gap-x-4">
                    <button className="material-symbols-outlined text-lg rounded-sm" onClick={() => moveToSlide('previous')}>arrow_back_ios</button>
                    <button className="material-symbols-outlined text-lg rounded-sm" onClick={() => moveToSlide('next')}>arrow_forward_ios</button>
                </div>
            </div>
            {/* <div className="flex justify-end gap-x-[18%] pr-[10%]">
                <h1 className="title-heading text-3xl flex justify-center items-center py-[16px] tablet:text-2xl mobile:py-[4px]">STORE</h1>
                <button className="material-symbols-outlined text-[#fd7d14c9] cursor-pointer" onClick={() => dispatch({case: 'showCart', state: !currentState.showCart})}>shopping_cart</button>
            </div> */}
            <div className="w-full">
                <div ref={subSectionsRef} className="indicator w-full tablet:hidden select-none flex gap-x-6 justify-center mb-[16px] overflow-x-auto laptop_s:gap-3 laptop:justify-normal laptop:px-[4%] laptop_s:text-sm laptop_s:font-semibold">
                    {subSections && subSections.map((section, key) => (
                        <button key={key} id={key} className="bg-[#fd7d14c9] rounded-md px-2 laptop:min-w-[22%] laptop:px-0 tablet:min-w-[30%] tablet_s:min-w-[36%] mobile:min-w-[46%] mobile:text-[13px] mobile:px-1" onClick={() => {document.getElementById(section).scrollIntoView()}}>{section}</button>
                    ))}
                </div>
                <div className="indicator-tab-mobile w-full hidden bg-orange-400 tablet:block py-1">
                    <div ref={sectionRef} className="hidden select-none px-[8%] tablet:flex gap-[4%] mb-1 overflow-x-scroll text-sm font-semibold tablet_s:px-[4%]" onClick={e => e.target.tagName === 'BUTTON' ? navigateToSection(e) : null}>
                        <button value="beverages" className="min-w-[30%] rounded-md tablet_s:min-w-[34%] mobile:min-w-[46%]">Water & Beverages</button>
                        <button value="snacksandbaked" className="min-w-[30%] rounded-md tablet_s:min-w-[34%] mobile:min-w-[46%]">Snacks & Baked goods</button>
                        <button value="icecream" className="min-w-[30%] rounded-md tablet_s:min-w-[34%] mobile:min-w-[46%]">Ice cream</button>
                        <button value="provisions" className="min-w-[30%] rounded-md tablet_s:min-w-[34%] mobile:min-w-[46%]">Provisions</button>
                        <button value="cooking" className="min-w-[30%] rounded-md tablet_s:min-w-[34%] mobile:min-w-[46%]">Cooking</button>
                        <button value="fruits&vegs" className="min-w-[30%] rounded-md tablet_s:min-w-[34%] mobile:min-w-[46%]">Fruits & Vegetables</button>
                        <button value="homecare&laundry" className="min-w-[30%] rounded-md tablet_s:min-w-[34%] mobile:min-w-[46%]">Home care & Laundry</button>
                        <button value="personalcare" className="min-w-[30%] rounded-md tablet_s:min-w-[34%] mobile:min-w-[46%]">Personal care</button>
                        <button value="babycare" className="min-w-[30%] rounded-md tablet_s:min-w-[34%] mobile:min-w-[46%]">Baby care</button>
                        <button value="petfood" className="min-w-[30%] rounded-md tablet_s:min-w-[34%] mobile:min-w-[46%]">Pet food</button>
                    </div>
                    <div ref={subSectionsRef} className="select-none flex gap-x-6 justify-center overflow-x-auto laptop_s:gap-3 laptop:justify-normal laptop:px-[4%] laptop_s:text-sm laptop_s:font-semibold">
                        {subSections && subSections.map((section, key) => (
                            <button key={key} id={key} className="rounded-md px-2 laptop:min-w-[22%] laptop:px-0 tablet:min-w-[30%] tablet_s:min-w-[36%] mobile:min-w-[46%] mobile:text-[13px] mobile:px-1" onClick={() => {document.getElementById(section).scrollIntoView()}}>{section}</button>
                        ))}
                    </div>
                </div>
                <div className="flex gap-[2%] px-[2%]">
                    <div className="store-filters max-w-[18%] h-[20%] bg-slate-100 rounded-[10px] tablet:hidden">
                        <h1 className="text-center py-2 font-semibold text-xl">Sections</h1>
                        <div className="by-type px-2" onClick={e => {e.target.tagName === 'INPUT' ? navigateToSection(e) : null}}>
                            <label className="flex gap-x-3 mb-2 cursor-pointer">
                                <input type="radio" name="select" value="beverages" defaultChecked={(location.pathname === '/store' || location.pathname.includes('beverages')) ? true : false} />
                                <span className="text-lg leading-6">Water & Beverages</span>
                            </label>
                            <label className="flex gap-x-3 mb-2 cursor-pointer">
                                <input type="radio" name="select" value="snacksandbaked" defaultChecked={location.pathname.includes('snacksandbaked') ? true : false} />
                                <span className="text-lg">Snacks & Baked goods</span>
                            </label>
                            <label className="flex gap-x-3 mb-2 cursor-pointer">
                                <input type="radio" name="select" value="icecream" defaultChecked={location.pathname.includes('icecream') ? true : false} />
                                <span className="text-lg">Ice cream</span>
                            </label>
                            <label className="flex gap-x-3 mb-2 cursor-pointer">
                                <input type="radio" name="select" value="provisions" defaultChecked={location.pathname.includes('provisions') ? true : false} />
                                <span className="text-lg">Provisions</span>
                            </label>
                            <label className="flex gap-x-3 mb-2 cursor-pointer">
                                <input type="radio" name="select" value="cooking" defaultChecked={location.pathname.includes('cooking') ? true : false} />
                                <span className="text-lg">Cooking</span>
                            </label>
                            <label className="flex gap-x-3 mb-2 cursor-pointer">
                                <input type="radio" name="select" value="fruits&vegs" defaultChecked={location.pathname.includes('fruits&vegs') ? true : false} />
                                <span className="text-lg">Fruits & Vegetables</span>
                            </label>
                            <label className="flex gap-x-3 mb-2 cursor-pointer">
                                <input type="radio" name="select" value="homecare&laundry" defaultChecked={location.pathname.includes('homecare&laundry') ? true : false} />
                                <span className="text-lg">Home care & Laundry</span>
                            </label>
                            <label className="flex gap-x-3 mb-2 cursor-pointer">
                                <input type="radio" name="select" value="personalcare" defaultChecked={location.pathname.includes('personalcare') ? true : false} />
                                <span className="text-lg">Personal care</span>
                            </label>
                            <label className="flex gap-x-3 mb-2 cursor-pointer">
                                <input type="radio" name="select" value="babycare" defaultChecked={location.pathname.includes('babycare') ? true : false} />
                                <span className="text-lg">Baby care</span>
                            </label>
                            <label className="flex gap-x-3 mb-2 cursor-pointer">
                                <input type="radio" name="select" value="petfood" defaultChecked={location.pathname.includes('petfood') ? true : false} />
                                <span className="text-lg">Pet food</span>
                            </label>
                        </div>
                    </div>
                    <Outlet />
                    <div className="promotions w-[20%] h-[30%] rounded-[10px] py-4 laptop_s:w-[30%] tablet:hidden">
                        {!promos.length && <p className="text-center text-xl">Cannot get promotions at this time, please try again</p>}
                        {promos.map((promo, key) => (
                            <div key={key} className="discounts rounded-[10px] h-[180px] overflow-hidden border border-black mb-4">
                                <h1 className="text-center font-medium">{promo.data().title}</h1>
                                <img src={promo.data().image} alt={promo.data().title} className="w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default Store;