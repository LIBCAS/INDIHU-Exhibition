import "./creators-section.scss";

import Carousel from "./Carousel";

// - -

const CreatorsSection = () => {
  return (
    <section id="creators-section" className="creators-section py-[96px]">
      <div className="px-[30px] md:px-[46px] flex flex-col gap-12 max-w-[540px] mx-auto md:max-w-none lg:max-w-[1140px]">
        <h2 className="title">Tým tvůrců</h2>
        <p className="description">
          Duis ultrices accumsan felis, vel rhoncus eros suscipit ac.
          Pellentesque quis leo ante. Cras vel ultricies sem, eu iaculis odio.
          Donec pellentesque urna id gravida bibendum. Nullam id semper neque,
          non suscipit tellus. Mauris interdum enim a hendredit mattis.
        </p>

        {/* Carousel */}
        <Carousel />
      </div>
    </section>
  );
};

export default CreatorsSection;
