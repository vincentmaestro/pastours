function Loading() {
    return (
        <div className="brand loading fixed top-0 left-0 h-full w-full flex flex-col gap-y-1 items-center justify-center bg-[rgba(6,7,7,0.8)] z-[2]">
            <h1 className="logo text-5xl text-[#ffc107f1] tablet:text-4xl mobile:text-3xl">Pastours<span className="material-symbols-outlined bg-[#ffc107f1] text-black rounded-[50%] text-[12px] relative top-[-20px] tablet:text-[10px] mobile:text-[9px]">electric_bolt</span></h1>
            <span className="motto text-[17px] text-white font-bold tracking-[.7px] ml-[4%] tablet:text-[14px] tablet:mt-[-5px] mobile:text-[12px]">we dey deliver...</span>
        </div>
    );
}

export default Loading;