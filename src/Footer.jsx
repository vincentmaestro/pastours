import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-[#212529] text-[#dbdbdb] py-6 px-12 laptop_s:px-10 tablet:px-[4%] tablet:py-3">
            <div className="brand inline-block mb-2">
                <Link to="/" className="brand">
                    <h1 className="logo text-5xl tablet:text-3xl">Pastours<span className="material-symbols-outlined bg-[#ffc107f1] text-black rounded-[50%] text-[18px] relative top-[-12px] tablet:text-[14px]">electric_bolt</span></h1>
                    <span className="motto text-[19px] text-[rgb(255,255,255)] font-bold tracking-[.7px] relative left-[32%] bottom-1 tablet:text-[15px] tablet:left-[15%] tablet:top-[-8px]">we dey deliver...</span>
                </Link>
            </div>
            <div className="flex justify-center gap-x-[20%] pb-12 laptop_s:gap-[16%] tablet:gap-[8%] mobile:flex-col mobile:pl-[24%] mobile:pb-4 mobile:gap-y-[20px]">
                <section className="need-help">
                    <h1 className="mb-3 font-semibold text-[24px] tablet:mb-2 tablet:text-[20px] mobile:mb-0">Need Help?</h1>
                    <ul className="footer-links font-medium text-[17px] tablet:text-[15px] tablet:font-normal">
                        <li><Link to="">About us</Link></li>
                        <li><Link to="">FAQ</Link></li>
                        <li><Link to="">Guide</Link></li>
                        <li><Link to="">Terms of use</Link></li>
                        <li><Link to="">Privacy policy</Link></li>
                    </ul>
                </section>
                <section className="business">
                    <h1 className="mb-3 font-semibold text-[24px] tablet:mb-2 tablet:text-[20px] mobile:mb-0">Business</h1>
                    <ul className="footer-links font-medium text-[17px] tablet:text-[15px] tablet:font-normal">
                        <li><Link to="">Add your store</Link></li>
                        <li><Link to="">Become a rider</Link></li>
                        <li><Link to="">Become a partner</Link></li>
                        <li><Link to="">Advertise your brand</Link></li>
                    </ul>
                </section>
                <section className="contact-us" id="contact-us">
                    <h1 className="mb-3 font-semibold text-[24px] tablet:mb-2 tablet:text-[20px] mobile:mb-0">Contact us</h1>
                    <div className="">
                        <div className="flex gap-2 items-center mb-2">
                            <span className="material-symbols-outlined text-[20px]">mail</span>
                            <p>info@pastours.com.ng</p>
                        </div>
                        <div className="flex gap-2 items-center mb-2">
                            <i className="fa-solid fa-phone"></i>
                            <p>(+234) 000 111 2222</p>
                        </div>
                        <div className="flex gap-2 items-center mb-2">
                            <i className="fa-brands fa-whatsapp"></i>
                            <p>(+234) 000 333 4444</p>
                        </div>
                    </div>
                    <div className="w-[90%] mb-4 tablet:mb-2">
                        <h1 className="text-lg tracking-widest">We are social</h1>
                        <div className="social-icons text-2xl flex gap-[16%] tablet:text-lg">
                            <a href=""><i className="fa-brands fa-facebook"></i></a>
                            <a href=""><i className="fa-brands fa-twitter"></i></a>
                            <a href=""><i className="fa-brands fa-instagram"></i></a>
                        </div>
                    </div>
                    <p className="tracking-widest font-semibold">&copy;2023 Pastours</p>
                </section>   
            </div>
        </footer>
    );
}
 
export default Footer;