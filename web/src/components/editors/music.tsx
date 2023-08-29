import { MuteChapterMusicCheckbox } from "./Checkboxes";
import AudioMusic from "./audio-music";

import { File as IndihuFile } from "models";

// - -

type MusicProps = {
  aloneScreen: boolean;
  muteChapterMusic: boolean;
  musicFile: IndihuFile | null;
  helpIconTitle: string;
  id: string;
};

const Music = ({
  aloneScreen,
  muteChapterMusic,
  musicFile,
  helpIconTitle,
  id,
}: MusicProps) => {
  if (aloneScreen) {
    return (
      <AudioMusic
        isAudio={false}
        music={musicFile}
        id={id}
        helpIconTitle={helpIconTitle}
      />
    );
  }

  return <MuteChapterMusicCheckbox muteChapterMusicValue={muteChapterMusic} />;
};

export default Music;
