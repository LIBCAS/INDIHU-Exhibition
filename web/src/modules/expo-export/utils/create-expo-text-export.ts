import JSZip from "jszip";

import { ExpoStructure } from "models";
import { createExpoTextFiles } from "./create-expo-text-files";

/**
 *
 */
export const createExpoTextExport = async (
  structure: ExpoStructure
): Promise<Blob> => {
  const zip = new JSZip();

  const textFiles = createExpoTextFiles(structure);
  textFiles.forEach(({ name, content }) => {
    zip.file(name, content);
  });

  const generatedZip = await zip.generateAsync({ type: "blob" });
  return generatedZip;
};

/**
 * Makes a filesystem-safe name for the downloaded ZIP file.`
 */
export const getExpoTextExportFileName = (expoTitle: string): string => {
  const sanitizedTitle = expoTitle
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return `texty-vystavy-${sanitizedTitle || "vystava"}.zip`;
};
