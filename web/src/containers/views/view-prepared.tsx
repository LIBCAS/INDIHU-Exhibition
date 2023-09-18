import bgImage from "../../assets/img/mountain-background.jpg";

const ViewPrepared = () => {
  return (
    <div className="w-full h-full relative">
      {/* Background image */}
      <div className="w-full h-full">
        <img src={bgImage} className="w-full h-full object-cover object-top" />
      </div>

      <div className="absolute left-0 top-1/2 w-full h-1/2 flex justify-end items-center text-white font-bold opacity-20 overflow-hidden text-[110px] sm:text-[160px] md:text-[200px] lg:text-[270px]">
        INDIHU
      </div>

      {/* Text above the bg image */}
      <div className="absolute left-0 top-0 w-full h-full px-[10%] py-[10%] overflow-y-auto flex flex-col justify-center gap-10 sm:gap-12">
        <div className="flex items-center gap-6 bg-white px-6 py-4 rounded-md w-fit">
          <div className="w-5 h-5 bg-[#ecae1a] rounded-full self-center " />
          <div className="font-['Roboto'] font-bold text-xl sm:text-2xl text-black">
            V PROCESE
          </div>
        </div>

        <div
          className="font-['Roboto'] text-white font-bold text-7xl sm:text-9xl"
          style={{ textShadow: "1px 1px 1px black, -1px -1px 1px black" }}
        >
          INDIHU
        </div>

        <div
          className="font-['Roboto'] text-white font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
          style={{ textShadow: "1px 1px 1px black, -1px -1px 1px black" }}
        >
          Kreativní nástroj pro tvorbu virtuálních výstav
        </div>
      </div>
    </div>
  );
};

export default ViewPrepared;
