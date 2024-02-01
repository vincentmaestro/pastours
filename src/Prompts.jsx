import { useContext } from "react";
import { signInState } from "./App";

function Prompt() {
    const {currentState, dispatch} = useContext(signInState);
    return (
        <>
            <div className="prompts fixed top-[50%] left-[50%] bg-orange-400 w-[25%] py-[50px] rounded-[12px] z-[1] laptop:w-[30%] tablet:w-[40%] mobile:w-[55%] mobile:top-[45%] mobile:text-xl mobile_s:w-[75%]" onAnimationEnd={() => dispatch({case: 'userAction', state: false, prompt: ''})}>
                <p className="text-white text-center">{currentState.prompt}</p>
            </div>
        </>
    );
}
 
export default Prompt;