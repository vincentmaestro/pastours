import { verifyPasswordResetCode, confirmPasswordReset, signInWithEmailAndPassword, applyActionCode } from "firebase/auth";
import { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signInState } from "./App";

function Validate({auth}) {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParam = location.search;
    const queryObj = new URLSearchParams(queryParam);
    const [mode, setMode] = useState(queryObj.get('mode'));
    const actionCode = queryObj.get('oobCode');
    const continueUrl = queryObj.get('continueUrl');
    const lang = queryObj.get('lang');
    const [email, setEmail] = useState(null);
    const [passwordVisible, setpasswordVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const passwordPattern = /^[a-zA-Z0-9-.]{7,}$/;
    const {dispatch} = useContext(signInState);
    const [passwordReset, setPasswordReset] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [tokenExpired, setTokenExpired] = useState(false);

    useEffect(() => {
        if(mode === 'resetPassword') {
            verifyPasswordResetCode(auth, actionCode)
            .then(email => {
                setEmail(email);
            })
            .catch(() => {
                // 'auth/expired-action-code'
                setMode(null);
                setTokenExpired(true);
                // Invalid or expired action code. Ask user to try to reset the password
                // again.
            });
        }
    
        if(mode === 'verifyEmail') {
            dispatch({case: 'loading', state: true});
            applyActionCode(auth, actionCode)
            .then(() => {
                dispatch({case: 'loading', state: false});
                setEmailVerified(true);
            })
            .catch(() => {
                dispatch({case: 'loading', state: false});
                setMode(null);
                setTokenExpired(true);
            });
        }
    }, []);

    function resetPassword() {
        if(passwordPattern.test(password)) {
            dispatch({case: 'loading', state: true});
            confirmPasswordReset(auth, actionCode, password)
            .then(() => {
                signInWithEmailAndPassword(auth, email, password)
                .then(() => navigate(continueUrl, {replace: true}))
                .catch(() => {dispatch({case: 'loading', state: false}); setPasswordReset(true)});
            })
            .catch(() => {dispatch({case: 'loading', state: false}); setPasswordReset(false)});
        }
        else {
            setPasswordError('Password criteria not met');
        }
    }
    
    return (
        <>
            {mode === 'resetPassword' &&
                <form className="reset-password select-none pb-[40px]" onSubmit={resetPassword}>
                    <h1 className="text-center font-bold text-3xl mt-4 mb-5">Reset password</h1>
                    <div className="email border flex flex-col gap-y-1 py-2 w-[40%] mx-auto">
                        <div className="flex justify-center w-[50%] mx-auto gap-x-3 pb-4">
                            {email && <input type="email" name="email" className="w-[80%] py-[1px]" value={email} />}
                            <span className="material-symbols-outlined">mail</span>
                        </div>
                        <p className="text-center font-semibold pb-2">Enter new password</p>
                        <div className="password border flex flex-col gap-y-1 py-2 mb-4 w-[50%] mx-auto">
                            <span className="password-error block text-center text-sm text-red-500 font-semibold">{passwordError}</span>
                            <div className="flex justify-center gap-x-3">
                                <input type={passwordVisible ? 'text' : 'password'} name="password" placeholder="Password" className="w-[80%] py-[1px]" value={password} onChange={e => setPassword(e.target.value)} />
                                <span className="material-symbols-outlined cursor-pointer" onClick={() => {setpasswordVisible(!passwordVisible)}}>{passwordVisible ? 'visibility' : 'visibility_off'}</span>
                            </div>
                            <span className="text-xs font-semibold px-4">*minimum of 7 characters. Can include letters, numbers, "-" and "."</span>
                        </div>
                        { passwordReset && <p className="px-2 text-justify font-semibold">Password was reset but we were unable to automatically sign you in</p> }
                        { passwordReset ? <button className="py-[4px] font-semibold bg-[#fd7e14] w-[30%] mx-auto rounded-[20px]" onClick={() => navigate('/')}>Back to home</button>
                            : <button type="submit" className="py-[4px] font-semibold bg-[#fd7e14] w-[25%] mx-auto rounded-[20px]">Update</button>
                        }
                    </div>
                </form>
            }
            {mode === 'verifyEmail' && 
                <div className="verify-email select-none">
                    <h1 className="text-center font-bold text-3xl">Verify email</h1>
                    {emailVerified && 
                        <div className="flex flex-col gap-y-1 py-2 mb-4 w-[40%] mx-auto">
                            <p className="text-center">Email verified</p>
                            <button className="py-[4px] font-semibold bg-[#fd7e14] w-[30%] mx-auto rounded-[20px]" onClick={() => navigate('/', {replace: true})}>Back to home</button>
                        </div>
                    }
                </div>
            }
            { tokenExpired && <p className="px-2 text-center text-xl font-semibold">Invalid action/Token expired. Kindly restart the process</p> }
        </>
    );
}
 
export default Validate;