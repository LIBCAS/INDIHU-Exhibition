import bgImage from "../../assets/img/mountain-background.jpg";

const ViewPrepared = () => {
  return (
    <div className="w-full h-full">
      {/* Background image */}
      <div
        className="w-full h-full -z-50 blur-sm"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
        }}
      />

      <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 flex items-center">
        <div className="text-white text-[270px] opacity-20 font-bold overflow-hidden">
          INDIHU
        </div>
      </div>

      {/* Text above the bg image */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="h-full flex flex-col gap-10 sm:gap-12 justify-center ml-[10%]">
          {/* First col item */}
          <div className="flex align-items gap-6 bg-white py-4 px-6 rounded-md w-fit">
            <div className="w-5 h-5 bg-[#ecae1a] rounded-full self-center " />
            <div className="font-['Roboto'] font-bold text-xl sm:text-2xl text-black">
              V PROCESE
            </div>
          </div>

          {/* Second col item */}
          <div className="font-['Roboto'] font-bold text-7xl sm:text-9xl text-white">
            INDIHU
          </div>

          {/* Third col item */}
          <div className="font-['Roboto'] font-medium text-4xl sm:text-5xl text-white max-w-[700px] leading-10 sm:leading-[48px] opacity-80">
            Kreativní nástroj pro tvorbu virtuálních výstav
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPrepared;
