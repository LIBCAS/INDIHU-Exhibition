import "./creation-section.scss";

const CreationSection = () => {
  return (
    <section id="creation-section" className="creation-section py-[96px]">
      <div className="px-[30px] md:px-[46px] flex flex-col gap-12 max-w-[540px] mx-auto md:max-w-none lg:max-w-[1140px]">
        <h2>Vznik</h2>
        <div className="flex flex-col gap-8 pl-0 lg:pl-[13.5%] lg:max-w-[75%]">
          <p>
            Aliquam tempus nulla id pharetra lobortis. Proin id nisl sem. Etiam
            dictum velit a aliquam maximus. Ut ante neque, vulputate ac velit
            nec, sagittis fermentum ligula. Integer eu urna fermentum, imperdiet
            magna a, ultricies tortor. Nullam efficitur libero vitae magna
            tristique, sed tempus ex euismod. Nam pharetra mi eget eros luctus,
            non iaculis risus tincidunt. Nulla facilisi. Integer posuere purus
            enim, sed faucibus sem tempus non. Nullam maximus aliquet molestie.
            Praesent ut magna non turpis facilisis consectetur ac vel urna.
            Pellentesque fringilla ipsum at risus ullamcorper, sed pretium magna
            tempus.
          </p>
          <p>
            In molestie arcu sed nisi varius sodales. Donec non tortor vitae ex
            commodo rutrum ut sed nulla. Maecenas quis augue mauris. Phasellus
            nec laoreet erat. Mauris aliquet dolor risus, a semper augue luctus
            vitae. Proin mi metus, sollicitudin hendrerit varius nec, egestas
            quis ex. Sed scelerisque placerat nisl, blandit lobortis libero
            aliquet non.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CreationSection;
