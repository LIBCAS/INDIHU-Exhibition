import "./preview-video-section.scss";
import previewVideoSrc from "../../../assets/video/INDIHU_preview_video.mp4";
import previewVideoPoster from "../../../assets/img/landing-page/video-preview-poster.png";

const PreviewVideoSection = () => {
  return (
    <div className="preview-video-section flex justify-center items-center">
      <div className="px-[30px] md:px-[46px] flex flex-col gap-16 max-w-[540px] mx-auto md:max-w-none lg:max-w-[1140px]">
        {/* <h2>TODO: Sem nejaký pekný nadpis</h2> */}

        {/* Video */}
        <div className="w-full h-full flex justify-center items-center">
          <video
            controls
            playsInline
            controlsList="nodownload"
            disablePictureInPicture
            poster={previewVideoPoster}
            style={{ width: "auto", height: "auto" }}
          >
            <source src={previewVideoSrc} type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
};

export default PreviewVideoSection;
