import { useState, useContext, useReducer } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail, sendEmailVerification } from "firebase/auth";
import { signInState } from "./App";
import { useLocation } from "react-router-dom";

export function VerifyEmail({auth, showPrompt}) {
    const {dispatch} = useContext(signInState);
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
    const initialState = { login: true };
    function reducer(s, a) {
        switch(a) {
            case 'login': return { login: true };
            case 'signup': return { signup: true };
            case 'resetPassword': return { resetpassword: true };
            default: return s;
        }
    }
    
    const {dispatch} = useContext(signInState);
    const [passwordVisible, setpasswordVisible] = useState(false);
    const [authStage, toggleAuthStage] = useReducer(reducer, initialState);
    const [passwordResetMailSent, setPasswordResetMailSent] = useState(null);
    const location = useLocation();
    const actionCodeSettings = {
        url: 'http://localhost:5173/' + location.pathname
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
        username: '',
        password: ''
    });

    const [loginData, setloginData] = useState({
        email: '',
        savedEmail: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        username: '',
        password: ''
    });   

    function handleSignupInput(e) {
        const {name, value} = e.target;
        setsignupData({ ...signupData, [name]: value });
    }

    function handleLoginInput(e) {
        const {id, name, value} = e.target;
        setloginData({ ...loginData, [name]: value, [id]: value });
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

    function handleSignup(e) {
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

    function login(e) {
        e.preventDefault();
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if(localStorage.getItem('rememberMe')) {
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

    function rememberMe(e) {
        if (e.target.checked) {
            localStorage.setItem('rememberMe', true);
            localStorage.setItem('savedEmail', loginData.savedEmail);
        }
        else {
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('savedEmail');
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
            .catch(error => {
                dispatch({case: 'loading', state: false});
                setPasswordResetMailSent(false);
            })
        }
    }

    return (
        <div className="loginandsignup fixed top-0 left-0 w-full h-full z-[1] bg-[#001122e7]">
            {authStage.login &&
                <form className="login bg-orange-200 relative top-[7%] w-[65%] pt-[1%] pb-[5%] mx-auto laptop_s:top-[4%] laptop_l:w-[75%] laptop_l:top-[14%] tablet:top-[12%] tablet_s:w-[90%]" onSubmit={login}>
                    <span className="material-symbols-outlined cursor-pointer relative left-[95%] tablet:left-[92%]" onClick={() => dispatch({case: 'start', state: false})}>close</span>
                    <h1 className="text-center font-bold text-3xl mt-[2%] mb-[4%] tablet:mt-0">Login</h1>
                    <div className="email border rounded-[16px] flex flex-col gap-y-1 py-2 mb-6 w-[40%] mx-auto laptop_l:w-[45%] tablet:w-[60%] tablet:mb-[4%] tablet_s:w-[68%] mobile_m:w-[78%] mobile_s:w-[85%]">
                        <span className="email-error block text-center text-sm text-red-500 font-semibold">{errors.email}</span>
                        <div className="flex justify-center gap-x-3">
                            <input type="email" name="email" placeholder="Email" id="savedEmail" className="w-[80%]" value={localStorage.getItem('rememberMe') ? localStorage.getItem('savedEmail') : loginData.email} onChange={handleLoginInput} />
                            <span className="material-symbols-outlined">mail</span>
                        </div>
                    </div>
                    <div className="password border rounded-[16px] flex flex-col gap-y-1 py-2 mb-6 w-[40%] mx-auto laptop_l:w-[45%] tablet:w-[60%] tablet:mb-[3%] tablet_s:w-[68%] mobile_m:w-[78%] mobile_s:w-[85%]">
                        <span className="password-error block text-center text-sm text-red-500 font-semibold">{errors.password}</span>
                        <div className="flex justify-center gap-x-3">
                            <input type={passwordVisible ? 'text' : 'password'} name="password" placeholder="Password" className="w-[80%]" value={loginData.password} onChange={handleLoginInput} />
                            <span className="material-symbols-outlined cursor-pointer" onClick={() => {setpasswordVisible(!passwordVisible)}}>{passwordVisible ? 'visibility' : 'visibility_off'}</span>
                        </div>
                    </div>
                    <div className="remember-me flex gap-x-2 w-[40%] mx-auto mb-5 laptop_l:w-[45%] tablet:w-[60%] tablet:mb-[3%] tablet_s:gap-x-3 tablet_s:mb-[5%] tablet_s:w-[68%] mobile_m:w-[78%]">
                        <input type="checkbox" defaultChecked = {localStorage.getItem('rememberMe') ? true : false} onChange={rememberMe} />
                        <p className="text-sm font-semibold">Remember me</p>
                    </div>
                    <div className="flex justify-end gap-8 w-[40%] mx-auto mb-6 laptop_l:w-[45%] tablet:w-[60%] tablet:mb-[3%] tablet:gap-[10%] tablet_s:gap-[6%] tablet_s:w-[68%] tablet_s:mb-[4%] mobile_m:w-[78%] mobile_s:w-[85%]">
                        <button type="submit" className="py-[3px] px-[10px] rounded-[20px] bg-[#fd7e14] font-bold tablet:px-[14px] tablet:py-[1px]">Login</button>
                        <button className="text-sm font-semibold" onClick={() => toggleAuthStage('resetPassword')}>Forgot password?</button>
                    </div>
                    <div className="flex items-center gap-x-[20%] w-[40%] mx-auto mb-3 laptop_l:w-[45%] tablet:w-[60%] tablet:gap-x-[18%] tablet:mb-[2%] tablet_s:mb-[1%] mobile:w-[75%] mobile:gap-x-[8%]">
                        <p className="text-sm font-medium">Don't have an account?</p>
                        <button className="font-semibold" onClick={() => toggleAuthStage('signup')}>Create Account</button>
                    </div>
                    <p className="text-center mb-3 font-semibold text-xl">OR</p>
                    <button className="mx-auto block cursor-pointer"><img src="/continuewithGoogle.svg" alt="continueWithGoogle" /></button>
                </form>
            }
            {authStage.signup && 
                <form className="signup bg-orange-200 relative top-[6%] w-[65%] pt-[1%] pb-[2%] mx-auto laptop_s:top-[4%] laptop_l:w-[75%] laptop_l:top-[12%] tablet:top-[12%] tablet_s:w-[90%]" onSubmit={handleSignup}>
                    <span className="material-symbols-outlined cursor-pointer relative left-[95%] tablet:left-[92%]" onClick={() => dispatch({case: 'start', state: false})}>close</span>
                    <h1 className="text-center font-bold text-3xl mb-[3%] laptop_s:mb-[2%] laptop_s:mt-[-2%]">Sign up</h1>
                    <div className="email border rounded-[16px] flex flex-col gap-y-1 py-2 mb-4 w-[40%] mx-auto laptop_l:w-[45%] tablet:w-[60%] tablet:mb-[3%] tablet_s:w-[68%] mobile_m:w-[78%] mobile_s:w-[85%]">
                        <span className="email-error block text-center text-sm text-red-500 font-semibold">{errors.email}</span>
                        <div className="flex justify-center gap-x-3">
                            <input type="email" name="email" placeholder="Email" className="w-[80%] py-[1px]" value={signupData.email} onChange={handleSignupInput} />
                            <span className="material-symbols-outlined">mail</span>
                        </div>
                    </div>
                    <div className="username border rounded-[16px] flex flex-col gap-y-1 py-2 mb-4 w-[40%] mx-auto laptop_l:w-[45%] tablet:w-[60%] tablet:mb-[3%] tablet_s:w-[68%] mobile_m:w-[78%] mobile_s:w-[85%]">
                        <span className="username-error block text-center text-sm text-red-500 font-semibold">{errors.username}</span>
                        <div className="flex justify-center gap-x-3">
                            <input type="text" name="username" placeholder="Username" className="w-[80%] py-[1px]" value={signupData.username} onChange={handleSignupInput} />
                            <span className="material-symbols-outlined">person</span>
                        </div>
                        <span className="text-xs font-semibold px-4">*minimum of 3 characters, maximum of 10. Can include letters, numbers, "-" and "."</span>
                    </div>
                    <div className="password border rounded-[16px] flex flex-col gap-y-1 py-2 mb-4 w-[40%] mx-auto laptop_l:w-[45%] tablet:w-[60%] tablet:mb-[3%] tablet_s:w-[68%] mobile_m:w-[78%] mobile_s:w-[85%]">
                        <span className="password-error block text-center text-sm text-red-500 font-semibold">{errors.password}</span>
                        <div className="flex justify-center gap-x-3">
                            <input type={passwordVisible ? 'text' : 'password'} name="password" placeholder="Password" className="w-[80%] py-[1px]" value={signupData.password} onChange={handleSignupInput} />
                            <span className="material-symbols-outlined cursor-pointer" onClick={() => {setpasswordVisible(!passwordVisible)}}>{passwordVisible ? 'visibility' : 'visibility_off'}</span>
                        </div>
                        <span className="text-xs font-semibold px-4">*minimum of 7 characters. Can include letters, numbers, "-" and "."</span>
                    </div>
                    <button type="submit" className="w-[18%] ml-[40%] mb-2 py-[3px] rounded-[20px] bg-[#fd7e14] font-bold laptop_s:w-[26%] laptop_s:ml-[37%] tablet:ml-[35%] tablet:py-[1px] mobile:w-[36%] mobile:ml-[32%] mobile_m:w-[45%] mobile_m:ml-[28%]">Create Account</button>
                    <div className="flex items-center gap-x-[12%] w-[35%] mx-auto mb-2 laptop_l:w-[40%] laptop_s:mb-[1%] tablet:w-[60%] tablet:gap-[24%] mobile_m:w-[72%] mobile_m:gap-[30%]">
                        <p className="text-sm font-medium">Already have an account?</p>
                        <button className="font-semibold" onClick={() => toggleAuthStage('login')}>Login</button>
                    </div>
                    <p className="text-center mb-3 font-semibold text-xl">OR</p>
                    <button className="mx-auto block cursor-pointer"><img src="/continuewithGoogle.svg" alt="continueWithGoogle" /></button>
                </form>
            }
            {authStage.resetpassword && 
                <form className="forgot-password bg-orange-200 relative top-[20%] pt-[1%] w-[60%] pb-[40px] mx-auto laptop_l:top-[30%] laptop_l:w-[70%]" onSubmit={resetPassword}>
                    <span className="material-symbols-outlined cursor-pointer relative left-[95%]" onClick={() => dispatch({case: 'start', state: false})}>close</span>
                    <h1 className="text-center font-bold text-3xl mb-5">Forgot password</h1>
                    <div className="email border rounded-[16px] flex flex-col gap-y-1 py-2 mb-4 w-[40%] mx-auto laptop_l:w-[45%]">
                        <span className="email-error block text-center text-sm text-red-500 font-semibold">{errors.email}</span>
                        <span className="email-error block text-center text-red-500 font-semibold">{passwordResetMailSent === false && 'An error occured'}</span>
                        {<p className="text-center pb-2 font-semibold">{passwordResetMailSent ? 'Password reset email sent' : "Let's start with your Email"}</p>}
                        <div className="flex justify-center gap-x-3 pb-4">
                            <input type="email" name="email" placeholder="email" className="w-[80%] py-[1px]" value={loginData.email} onChange={handleLoginInput} />
                            <span className="material-symbols-outlined">mail</span>
                        </div>
                        { passwordResetMailSent ? <button className="py-[4px] font-semibold bg-[#fd7e14] w-[35%] mx-auto rounded-[20px]" onClick={() => dispatch({case: 'start', state: false})}>Close</button>
                            : <button type="submit" className="py-[4px] font-semibold bg-[#fd7e14] w-[35%] mx-auto rounded-[20px]">Next</button>
                        }
                    </div>
                </form>
            }
        </div>
    );
}
 
export default LoginandSignup;