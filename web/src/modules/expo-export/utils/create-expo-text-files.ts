import { ExpoStructure, Screen } from "models";
import { TextFile } from "../typings";
import { getScreenTextContent } from "./screen-text-parsers";

const screenTypeFileNames: Record<string, string> = {
  INTRO: "uvod_kapitoly",
  IMAGE: "obrazovka_s_obrazkem",
  VIDEO: "obrazovka_s_videem",
  TEXT: "obrazovka_s_textem",
  PARALLAX: "parallax",
  IMAGE_ZOOM: "animace_priblizeni",
  TIMELINE: "casova_osa",
  PHOTOGALERY: "slideshow",
  PHOTOGALLERY_NEW: "fotogalerie",
  IMAGE_CHANGE: "foto_pred_a_po",
  EXTERNAL: "externi_obsah",
  SIGNPOST: "rozcestnik",
  SURVEY: "anketa",
  GAME_FIND: "najdi_na_obrazku",
  GAME_DRAW: "dokresli",
  GAME_WIPE: "stiraci_los",
  GAME_SIZING: "hadej_velikost",
  GAME_MOVE: "posun_na_spravne_misto",
  GAME_OPTIONS: "kviz",
};

const getScreenFileName = (
  screen: Screen,
  chapterIndex: number,
  screenIndex: number
): string =>
  `${chapterIndex + 1}.${screenIndex + 1}_${
    screenTypeFileNames[screen.type]
  }.txt`;

/**
 * Returns every export file in the same order as the exhibition structure.
 */
export const createExpoTextFiles = (structure: ExpoStructure): TextFile[] => {
  const chapterFiles: TextFile[] = structure.screens.flatMap(
    (chapter, chapterIndex) =>
      chapter.map((screen, screenIndex) => ({
        name: getScreenFileName(screen, chapterIndex, screenIndex),
        content: getScreenTextContent(screen),
      }))
  );

  const startScreen: TextFile = {
    name: "0.uvod.txt",
    content: getScreenTextContent(structure.start),
  };

  const finishScreen: TextFile = {
    name: `${structure.screens.length + 1}.0_zaver.txt`,
    content: getScreenTextContent(structure.finish),
  };

  return [startScreen, ...chapterFiles, finishScreen];
};
