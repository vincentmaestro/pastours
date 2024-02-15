import { useState, useContext, useReducer, useEffect, useRef } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail, sendEmailVerification, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { applicationState } from "./App";
import { useLocation } from "react-router-dom";

export function VerifyEmail({auth, showPrompt}) {
    const {dispatch} = useContext(applicationState);
    const [verificationEmailSent, setVerificationEmailSent] = useState(false);
    const [error, setError] = useState(false);
    
    function verifyEmail(e) {
        e.preventDefault();
        dispatch({case: 'loading', state: true});
        sendEmailVerification(auth.currentUser)
        .then(() => {setVerificationEmailSent(true); dispatch({case: 'loading', state: false})})
        .catch(() => {setError(true); dispatch({case: 'loading', state: false})});
    }

    return (
        <div className="verify-email fixed top-0 w-full h-full z-[1] bg-[#001122e7]">
            <form className="relative top-[20%] text-white tablet:top-[10%]" onSubmit={verifyEmail}>
                <span className="material-symbols-outlined cursor-pointer relative left-[85%]" onClick={() => showPrompt(false)}>close</span>
                <h1 className="text-center font-bold text-3xl mt-[3%] mb-5">Verify Email</h1>
                <div className="email flex flex-col gap-y-1 mb-4 w-[45%] mx-auto laptop:w-[55%] tablet:w-[70%] mobile:w-[92%]">
                    {auth.currentUser && <p className="text-center pb-2 text-lg font-semibold mobile:text-base">Dear {auth.currentUser.displayName}, we need you to verify your email to ease account operations.</p>}
                    {!verificationEmailSent ? <button type="submit" className="py-[4px] my-[4%] font-semibold text-lg bg-[#fd7e14] w-[40%] mx-auto rounded-[20px] mobile:text-base mobile:py-[2px] mobile:w-[45%] mobile_m:w-[50%] mobile_s:w-[60%]">Send verification mail</button> 
                    : <p className="text-xl font-semibold text-center">Check your mailbox!</p>}
                    {error && <p className="text-xl my-[2%] font-semibold mx-auto">An error occured</p>}
                </div>
            </form>
        </div>
    );
}

function LoginandSignup({auth}) { 
    const initialState = { mailLogin: true };
    function reducer(s, a) {
        switch(a) {
            case 'mailLogin': return { mailLogin: true };
            case 'mailSignup': return { mailSignup: true };
            case 'phoneLogin': return { phoneLogin: true };
            case 'confirmOtp': return { confirmOtp: true };
            case 'resetPassword': return { resetpassword: true };
            default: return s;
        }
    }
    
    const {dispatch} = useContext(applicationState);
    const [passwordVisible, setpasswordVisible] = useState(false);
    const [authStage, toggleAuthStage] = useReducer(reducer, initialState);
    const [passwordResetMailSent, setPasswordResetMailSent] = useState(null);
    const location = useLocation();
    const actionCodeSettings = {
        url: 'https://pastours.netlify.app/' + location.pathname
        // iOS: {
        //   bundleId: 'com.example.ios'
        // },
        // android: {
        //   packageName: 'com.example.android',
        //   installApp: true,
        //   minimumVersion: '12'
        // },
        // handleCodeInApp: false,
        // dynamicLinkDomain: "example.page.link"
    };

    const [signupData, setsignupData] = useState({
        email: '',
        cc: '+234',
        phone: '',
        username: '',
        password: ''
    });

    const [loginData, setloginData] = useState({
        email: '',
        cc: '+234',
        phone: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        phone: '',
        otp: '',
        username: '',
        password: ''
    });   

    function handleSignupInput(e) {
        const {name, value} = e.target;
        setsignupData({ ...signupData, [name]: value });
    }

    function handleLoginInput(e) {
        const { name, value} = e.target;
        setloginData({ ...loginData, [name]: value });
    }

    function validateSignup() {
        let isValid = true;
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const usernamePattern = /^[a-zA-Z0-9-.]{3,10}$/;
        const passwordPattern = /^[a-zA-Z0-9-.]{7,}$/;
        const newErrors = { ...errors }

        if(!emailPattern.test(signupData.email.trim())) {
            newErrors.email = 'That\'s not quite a valid Email :(';
            isValid = false;
        }
        else {
            newErrors.email = ''; 
        }

        if(!usernamePattern.test(signupData.username.trim())) {
            newErrors.username = 'Username criteria not met';
            isValid = false;
        }
        else {
            newErrors.username = '';
        }

        if(!passwordPattern.test(signupData.password.trim())) {
            newErrors.password = 'Password criteria not met';
            isValid = false; 
        }
        else {
            newErrors.password = '';
        }

        setErrors(newErrors);
        return isValid;
    }

    function handleMailSignup(e) {
        e.preventDefault();
        if(validateSignup()) {
            dispatch({case: 'loading', state: true});
            createUserWithEmailAndPassword(auth, signupData.email, signupData.password)
            .then(() => {
                updateProfile(auth.currentUser, {
                    displayName: signupData.username
                });
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    setErrors({email: 'This Email is already in use'});
                    dispatch({case: 'loading', state: false});
                    dispatch({case: 'start', state: true});
                }
                else {
                    dispatch({case: 'sign_in_error'});
                    dispatch({case: 'start', state: true});
                    dispatch({case: 'animate', state: true});
                }
            });

            onAuthStateChanged(auth, (user) => {
                if(user) {
                    dispatch({case: 'sign_in_successful', message: 'Account created'});
                    dispatch({case: 'animate', state: true});
                }
            });
        }
    }

    function mailLogin(e) {
        e.preventDefault();
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if(localStorage.getItem('rememberMail')) {
            if (!emailPattern.test(localStorage.getItem('savedEmail'))) {
                setErrors({email: 'Invalid email'});
            }
            else {
                dispatch({case: 'loading', state: true});
                signInWithEmailAndPassword(auth, localStorage.getItem('savedEmail'), loginData.password)
                .then(() => {
                    dispatch({case: 'sign_in_successful', message: 'Welcome'});
                    dispatch({case: 'animate', state: true});
                })
                .catch(error => {
                    if (error.code === 'auth/invalid-login-credentials') {
                        setErrors({password: 'Invalid email/password combination'});
                        dispatch({case: 'loading', state: false});
                        dispatch({case: 'start', state: true});
                    }
                    else {
                        dispatch({case: 'sign_in_error'});
                        dispatch({case: 'start', state: true});
                        dispatch({case: 'animate', state: true});
                    }
                });
            }
        }
        else {
            if (!emailPattern.test(loginData.email)) {
                setErrors({email: 'Invalid email'});
            }
            else {
                dispatch({case: 'loading', state: true});
                signInWithEmailAndPassword(auth, loginData.email, loginData.password)
                .then(() => {
                    dispatch({case: 'sign_in_successful', message: 'Welcome'});
                    dispatch({case: 'animate', state: true});
                })
                .catch(error => {
                    if (error.code === 'auth/invalid-login-credentials' || 'auth/missing-password') {
                        setErrors({password: 'Invalid email/password combination'});
                        dispatch({case: 'loading', state: false});
                        dispatch({case: 'start', state: true});
                    }
                    else {
                        dispatch({case: 'sign_in_error'});
                        dispatch({case: 'start', state: true});
                        dispatch({case: 'animate', state: true});
                    }
                });
            }
        }
    }

    function phoneLogin(e) {
        e.preventDefault();
        const ccPattern = /^\+[1-9]{1,3}[0-9]{10}$/;
        if(ccPattern.test(loginData.cc+loginData.phone)) {
            auth.useDeviceLanguage();
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'phone-sign-in', {
                'size': 'invisible',
                'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                }
            });
            dispatch({case: 'loading', state: true});
            const appVerifier = window.recaptchaVerifier;
            signInWithPhoneNumber(auth, loginData.cc+loginData.phone, appVerifier)
            .then(confirmationResult => {
            window.confirmationResult = confirmationResult;
            dispatch({case: 'loading', state: false});
            toggleAuthStage('confirmOtp');
            })
            .catch(error => {
            console.log(error);
            });
        }
        else setErrors({ ...errors, phone: 'Phone number supplied is incorrect/invalid. Confirm country code and exclude first zero from phone number'});
    }

    const otp = useRef();
    let cc = [];
    function handleConfirmationCode(e) {
        const currentInput = e.target;
        const nextInput = e.target.nextElementSibling;
        const previousInput = e.target.previousElementSibling;
        const cp = Array.from(otp.current.childNodes).findIndex(input => input == e.target);
        
        if(currentInput.value.length > 1) {
            currentInput.value = "";
            return;
        }
        if(nextInput && nextInput.hasAttribute('disabled') && currentInput.value) {
            nextInput.removeAttribute('disabled');
            nextInput.focus();
        }
        if(e.key === "Backspace") {
            cc.length = cc.length - 1;
            if(previousInput) {
                previousInput.focus();
                currentInput.setAttribute('disabled', true);
            }
        }
        cc[cp] = currentInput.value;
    }
    useEffect(() => {
        if(authStage.confirmOtp) {
            otp.current.childNodes[0].focus();
        }
    });

    function signInWithOtp(e) {
        e.preventDefault();
        // otp.current.childNodes.forEach(input => {
        //     cc = [...cc, input.value];
        // });
        // cc = cc.join('');
        if(cc.length === 6) {
            confirmationResult.confirm(cc.join(''))
            .then(result => {
                // const user = result.user;
                dispatch({case: 'sign_in_successful', message: 'Welcome'});
                dispatch({case: 'animate', state: true});
            })
            .catch(error => {
                console.log(error);
                setErrors({...errors, phone: error.code})
            });
        }
        else {
            setErrors({ ...errors, otp: 'code is incomplete'});
        }
    }

    function rememberMail(e) {
        if (e.target.checked) {
            localStorage.setItem('rememberMail', true);
            localStorage.setItem('savedEmail', loginData.email);
        }
        else {
            localStorage.removeItem('rememberMail');
            localStorage.removeItem('savedEmail');
        }
    }

    function rememberPhone(e) {
        if (e.target.checked) {
            localStorage.setItem('rememberPhone', true);
            localStorage.setItem('savedPhone', loginData.phone);
        }
        else {
            localStorage.removeItem('rememberPhone');
            localStorage.removeItem('savedPhone');
        }
    }

    function resetPassword(e) {
        e.preventDefault();
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if(!emailPattern.test(loginData.email.trim())) {
            setErrors({email: 'Please enter a valid email'});
        }
        else {
            dispatch({case: 'loading', state: true});
            sendPasswordResetEmail(auth, loginData.email, actionCodeSettings)
            .then(() => {
                dispatch({case: 'loading', state: false});
                setPasswordResetMailSent(true);
            })
            .catch(() => {
                dispatch({case: 'loading', state: false});
                setPasswordResetMailSent(false);
            })
        }
    }

    return (
        <div className="loginandsignup fixed top-0 left-0 w-full h-full z-[1] bg-[#001122e7]">
            {authStage.mailLogin &&
                <form className="bg-orange-200 relative top-[7%] w-[65%] pt-[1%] pb-[5%] mx-auto laptop_s:top-[14%] tablet:top-[15%] tablet_s:w-[90%]" onSubmit={mailLogin}>
                    <span className="material-symbols-outlined cursor-pointer relative left-[95%] tablet:left-[92%]" onClick={() => dispatch({case: 'start', state: false})}>close</span>
                    <h1 className="text-center font-bold text-3xl mt-[2%] mb-[4%] tablet:mt-0">Login</h1>
                    <div className="email border rounded-[16px] flex flex-col gap-y-1 py-2 mb-6 w-[40%] mx-auto bg-white laptop_l:w-[45%] tablet:w-[60%] tablet:mb-[4%] tablet_s:w-[68%] mobile_m:w-[78%] mobile_s:w-[85%]">
                        <span className="email-error block text-center text-sm text-red-500 font-semibold">{errors.email}</span>
                        <div className="flex justify-center gap-x-3">
                            <input type="email" name="email" id="savedEmail" placeholder="Email" className="w-[80%] outline-none" value={localStorage.getItem('rememberMail') ? localStorage.getItem('savedEmail') : loginData.email} onChange={handleLoginInput} />
                            <span className="material-symbols-outlined">mail</span>
                        </div>
                    </div>
                    <div className="password border rounded-[16px] flex flex-col gap-y-1 py-2 mb-6 w-[40%] mx-auto bg-white laptop_l:w-[45%] tablet:w-[60%] tablet:mb-[3%] tablet_s:w-[68%] mobile_m:w-[78%] mobile_s:w-[85%]">
                        <span className="password-error block text-center text-sm text-red-500 font-semibold">{errors.password}</span>
                        <div className="flex justify-center gap-x-3">
                            <input type={passwordVisible ? 'text' : 'password'} name="password" placeholder="Password" className="w-[80%] outline-none" value={loginData.password} onChange={handleLoginInput} />
                            <span className="material-symbols-outlined cursor-pointer" onClick={() => {setpasswordVisible(!passwordVisible)}}>{passwordVisible ? 'visibility' : 'visibility_off'}</span>
                        </div>
                    </div>
                    <div className="remember-me flex gap-x-2 w-[40%] mx-auto mb-5 laptop_l:w-[45%] tablet:w-[60%] tablet:mb-[3%] tablet_s:gap-x-3 tablet_s:mb-[5%] tablet_s:w-[68%] mobile_m:w-[78%]">
                        <input type="checkbox" defaultChecked = {localStorage.getItem('rememberMail') ? true : false} onChange={rememberMail} />
                        <p className="text-sm font-semibold">Remember me</p>
                    </div>
                    <div className="flex justify-end gap-x-16 w-[35%] mx-auto mb-6 laptop:w-[44%] laptop:gap-x-12">
                        <button type="submit" className="py-[3px] px-[10px] rounded-[20px] bg-[#fd7e14] font-bold tablet:px-[14px] tablet:py-[1px]">Login</button>
                        <button className="text-sm font-semibold" onClick={() => toggleAuthStage('resetPassword')}>Forgot password?</button>
                    </div>
                    <div className="flex items-center gap-x-[20%] w-[40%] mx-auto mb-1 laptop_l:w-[45%] tablet:w-[60%] tablet:gap-x-[18%] tablet:mb-[2%] tablet_s:mb-[1%] mobile:w-[75%] mobile:gap-x-[8%]">
                        <p className="text-sm font-medium">Don't have an account?</p>
                        <button className="font-semibold" onClick={() => toggleAuthStage('mailSignup')}>Create Account</button>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-xl mb-1 font-semibold">OR</p>
                        <span className="font-semibold bg-white rounded-[50px] py-2 px-4 cursor-pointer" onClick={() => toggleAuthStage('phoneLogin')}>Use phone number</span>
                    </div>
                </form>
            }
            {authStage.phoneLogin &&
                <form className="bg-orange-200 relative top-[18%] w-[65%] pt-[1%] pb-[2%] mx-auto tablet:top-[25%] tablet_s:w-[90%]" onSubmit={phoneLogin}>
                    <span className="material-symbols-outlined cursor-pointer relative left-[95%] tablet:left-[92%]" onClick={() => dispatch({case: 'start', state: false})}>close</span>
                    <h1 className="text-center font-bold text-3xl mt-[2%] mb-[4%] tablet:mt-0">Login</h1>
                    <div className="email border rounded-[16px] flex flex-col gap-y-1 py-2 mb-3 w-[30%] mx-auto bg-white laptop:w-[40%] tablet:w-[50%] mobile:w-[65%] mobile_m:w-[78%]">
                        <span className="block text-center text-sm text-red-500 font-semibold">{errors.phone}</span>
                        <div className="flex justify-center px-2">
                            <div className="flex gap-x-1 mobile_m:gap-x-2">
                                <input input="number" name="cc" className="w-[20%] outline-none" placeholder="code" value={loginData.cc} onChange={handleLoginInput} />
                                <input type="tel" name="phone" className="w-[70%] outline-none" placeholder="phone" value={localStorage.getItem('savedPhone') ? localStorage.getItem('savedPhone') : loginData.phone} onChange={handleLoginInput} />
                            </div>
                            <span className="material-symbols-outlined">phone_enabled</span>
                        </div>
                    </div>
                    <div className="remember-me flex gap-x-2 w-[30%] ml-[35%] mb-5 laptop:ml-[30%] tablet:ml-[25%] mobile:ml-[19%] mobile_m:w-[40%] mobile_m:ml-[14%]">
                        <input type="checkbox" defaultChecked = {localStorage.getItem('rememberPhone') ? true : false} onChange={rememberPhone}/>
                        <p className="text-sm font-semibold">Remember me</p>
                    </div>
                    <div className="flex justify-center mb-6 tablet:mb-[3%] tablet_s:mb-[4%]">
                        <button type="submit" id="phone-sign-in" className="py-[3px] px-[10px] rounded-[20px] bg-[#fd7e14] font-bold tablet:px-[14px] tablet:py-[1.5px]">Continue</button>
                    </div>
                </form>
            }
            {authStage.confirmOtp &&
                <form className="bg-orange-200 relative top-[24%] w-[65%] pt-[1%] py-[1%] mx-auto laptop_s:top-[4%] laptop_l:top-[14%] tablet:top-[15%] tablet_s:w-[90%]" onSubmit={signInWithOtp}>
                    <span className="material-symbols-outlined cursor-pointer relative left-[95%] tablet:left-[92%]" onClick={() => dispatch({case: 'start', state: false})}>close</span>
                    <h1 className="text-center font-bold text-3xl mt-[2%] mb-[3%] tablet:mt-0">Enter OTP</h1>
                    <span className="block text-center text-sm text-red-500 font-semibold">{errors.otp}</span>
                    <div ref={otp} className="flex justify-center gap-x-2 mb-[3%] tablet:mb-[5%]">
                        <input type="number" className="otp w-[46px] h-[46px] rounded-[8px] text-center text-xl outline-none mobile_m:h-[38px] mobile_m:w-[38px]" onKeyUp={handleConfirmationCode} />
                        <input type="number" disabled className="otp w-[46px] h-[46px] rounded-[8px] text-center text-xl outline-none mobile_m:h-[38px] mobile_m:w-[38px]" onKeyUp={handleConfirmationCode} />
                        <input type="number" disabled className="otp w-[46px] h-[46px] rounded-[8px] text-center text-xl outline-none mobile_m:h-[38px] mobile_m:w-[38px]" onKeyUp={handleConfirmationCode} />
                        <input type="number" disabled className="otp w-[46px] h-[46px] rounded-[8px] text-center text-xl outline-none mobile_m:h-[38px] mobile_m:w-[38px]" onKeyUp={handleConfirmationCode} />
                        <input type="number" disabled className="otp w-[46px] h-[46px] rounded-[8px] text-center text-xl outline-none mobile_m:h-[38px] mobile_m:w-[38px]" onKeyUp={handleConfirmationCode} />
                        <input type="number" disabled className="otp w-[46px] h-[46px] rounded-[8px] text-center text-xl outline-none mobile_m:h-[38px] mobile_m:w-[38px]" onKeyUp={handleConfirmationCode} />
                    </div>
                    <div className="flex justify-center mb-6 tablet:mb-[3%] tablet_s:mb-[4%]">
                        <button type="submit" id="phone-sign-in" className="py-[3px] px-[10px] rounded-[20px] bg-[#fd7e14] font-bold tablet:px-[14px] tablet:py-[1px]">Confirm</button>
                    </div>
                </form>
            }
            {authStage.mailSignup && 
                <form className="bg-orange-200 relative top-[6%] w-[65%] pt-[1%] pb-[2%] mx-auto laptop_s:top-[4%] laptop_l:top-[12%] tablet:top-[11%] tablet_s:w-[90%]" onSubmit={handleMailSignup}>
                    <span className="material-symbols-outlined cursor-pointer relative left-[95%] tablet:left-[92%]" onClick={() => dispatch({case: 'start', state: false})}>close</span>
                    <h1 className="text-center font-bold text-3xl mb-[3%] laptop_s:mb-[2%] laptop_s:mt-[-2%]">Sign up</h1>
                    <div className="email border rounded-[16px] flex flex-col gap-y-1 py-2 mb-4 w-[40%] mx-auto bg-white laptop_l:w-[45%] tablet:w-[60%] tablet:mb-[3%] tablet_s:w-[68%] mobile_m:w-[78%] mobile_s:w-[85%]">
                        <span className="email-error block text-center text-sm text-red-500 font-semibold">{errors.email}</span>
                        <div className="flex justify-center gap-x-3">
                            <input type="email" name="email" placeholder="Email" className="w-[80%] outline-none py-[1px]" value={signupData.email} onChange={handleSignupInput} />
                            <span className="material-symbols-outlined">mail</span>
                        </div>
                    </div>
                    <div className="username border rounded-[16px] flex flex-col gap-y-1 py-2 mb-4 w-[40%] mx-auto bg-white laptop_l:w-[45%] tablet:w-[60%] tablet:mb-[3%] tablet_s:w-[68%] mobile_m:w-[78%] mobile_s:w-[85%]">
                        <span className="username-error block text-center text-sm text-red-500 font-semibold">{errors.username}</span>
                        <div className="flex justify-center gap-x-3">
                            <input type="text" name="username" placeholder="Username" className="w-[80%] outline-none py-[1px]" value={signupData.username} onChange={handleSignupInput} />
                            <span className="material-symbols-outlined">person</span>
                        </div>
                        <span className="text-xs text-gray-700 font-semibold px-4">*minimum of 3 characters, maximum of 10. Can include letters, numbers, "-" and "."</span>
                    </div>
                    <div className="password border rounded-[16px] flex flex-col gap-y-1 py-2 mb-4 w-[40%] mx-auto bg-white laptop_l:w-[45%] tablet:w-[60%] tablet:mb-[3%] tablet_s:w-[68%] mobile_m:w-[78%] mobile_s:w-[85%]">
                        <span className="password-error block text-center text-sm text-red-500 font-semibold">{errors.password}</span>
                        <div className="flex justify-center gap-x-3">
                            <input type={passwordVisible ? 'text' : 'password'} name="password" placeholder="Password" className="w-[80%] outline-none py-[1px]" value={signupData.password} onChange={handleSignupInput} />
                            <span className="material-symbols-outlined cursor-pointer" onClick={() => {setpasswordVisible(!passwordVisible)}}>{passwordVisible ? 'visibility' : 'visibility_off'}</span>
                        </div>
                        <span className="text-xs text-gray-700 font-semibold px-4">*minimum of 7 characters. Can include letters, numbers, "-" and "."</span>
                    </div>
                    <button type="submit" className="w-[18%] ml-[40%] mb-2 py-[3px] rounded-[20px] bg-[#fd7e14] font-bold laptop_s:w-[26%] laptop_s:ml-[37%] tablet:ml-[35%] tablet:py-[1px] mobile:w-[36%] mobile:ml-[32%] mobile_m:w-[45%] mobile_m:ml-[28%]">Create Account</button>
                    <div className="flex items-center gap-x-[30%] w-[40%] mx-auto mb-1 laptop_s:mb-[1%] tablet:w-[60%] tablet:gap-[24%] mobile_m:w-[72%] mobile_m:gap-[30%]">
                        <p className="text-sm font-medium">Already have an account?</p>
                        <button className="font-semibold" onClick={() => toggleAuthStage('mailLogin')}>Login</button>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-xl mb-1 font-semibold">OR</p>
                        <span className="font-semibold bg-white rounded-[50px] py-2 px-4 cursor-pointer" onClick={() => toggleAuthStage('phoneLogin')}>Use phone number</span>
                    </div>
                </form>
            }
            {authStage.resetpassword && 
                <form className="forgot-password bg-orange-200 relative top-[20%] w-[60%] pt-[1%] pb-[40px] mx-auto laptop_l:top-[30%] laptop_l:w-[70%] tablet:w-[90%]" onSubmit={resetPassword}>
                    <span className="material-symbols-outlined cursor-pointer relative left-[95%] mobile:left-[93%] mobile_m:left-[90%]" onClick={() => dispatch({case: 'start', state: false})}>close</span>
                    <h1 className="text-center font-bold text-3xl mb-5">Forgot password</h1>
                    <div className="email border rounded-[16px] flex flex-col gap-y-1 mb-4 w-[40%] mx-auto bg-white laptop_l:w-[45%] tablet:w-[60%] mobile:w-[75%] mobile_m:w-[85%]">
                        <span className="email-error block text-center text-sm text-red-500 font-semibold">{errors.email}</span>
                        <span className="email-error block text-center text-red-500 font-semibold">{passwordResetMailSent === false && 'An error occured'}</span>
                        {<p className="text-center pb-2 font-semibold">{passwordResetMailSent ? 'Password reset email sent' : "Let's start with your Email"}</p>}
                        <div className="flex justify-center gap-x-3 pb-4">
                            <input type="email" name="email" placeholder="email" className="w-[80%] outline-none py-[1px]" value={loginData.email} onChange={handleLoginInput} />
                            <span className="material-symbols-outlined">mail</span>
                        </div>
                    </div>
                    { passwordResetMailSent ? <button className="py-[2px] font-semibold bg-[#fd7e14] w-[18%] ml-[40%] rounded-[20px]" onClick={() => dispatch({case: 'start', state: false})}>Close</button>
                        : <button type="submit" className="py-[2px] font-semibold bg-[#fd7e14] w-[18%] ml-[40%] rounded-[20px]">Next</button>
                    }
                </form>
            }
        </div>
    );
}
 
export default LoginandSignup;