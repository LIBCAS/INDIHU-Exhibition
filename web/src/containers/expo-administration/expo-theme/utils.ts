import { ThemeFormData, ThemeFormDataProcessed } from "./models";

import { ActiveExpo, File as IndihuFile } from "models";

// Redux stuff
import { dispatch } from "index";
import { showLoader } from "actions/app-actions";
import { addFile } from "actions/file-actions";

// - - -

export const defaultInitialValues: ThemeFormData = {
  theme: "LIGHT",
  backgroundColor: "#393d41",
  iconsColor: "#d2a473",
  startButtonColor: "#d2a473",
  tagsColor: "#000000",
  logoType: "LOGO",
  logoPosition: "UPPER_LEFT",
  logoFileName: "",
  logoFile: null,
  defaultInfopointShape: "SQUARE",
  defaultInfopointPxSize: 24,
  defaultInfopointColor: "#d2a473",
  defaultInfopointIconFileName: "",
  defaultInfopointIconFile: null,
};

export const createThemeProcessedFormData = (
  formData: ThemeFormData
): ThemeFormDataProcessed => {
  const formDataProcessed: ThemeFormDataProcessed = {
    // 1
    theme: formData.theme || "LIGHT",
    backgroundColor: formData.backgroundColor || "#393d41",
    iconsColor: formData.iconsColor || "#d2a473",
    startButtonColor: formData.startButtonColor || "#d2a473",
    tagsColor: formData.tagsColor || "#000000",
    // 2
    logoType: formData.logoType || "LOGO",
    logoPosition: formData.logoPosition || "UPPER_LEFT",
    logoFile: formData.logoFile ?? undefined,
    // 3
    defaultInfopointShape: formData.defaultInfopointShape || "SQUARE",
    defaultInfopointPxSize: formData.defaultInfopointPxSize || 24,
    defaultInfopointColor: formData.defaultInfopointColor || "#d2a473",
    defaultInfopointIconFile: formData.defaultInfopointIconFile ?? undefined,
  };
  return formDataProcessed;
};

// - - -

export const saveExpoDesignData = async (
  processedFormData: ThemeFormDataProcessed,
  expoId: string,
  shouldUpdateLogoFile?: boolean,
  shouldUpdateInfopointIconFile?: boolean
) => {
  dispatch(showLoader(true));
  try {
    const response = await fetch(`/api/exposition/${expoId}/design`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }),
      body: JSON.stringify(processedFormData),
    });

    // When POSTing this route, BE automatically auto detects whether the logo and icon file is not part of the expo and should be added to .expoFiles
    // FE needs to auto detect aswell in order to add these files to structure.files if are currently not part of
    if (shouldUpdateLogoFile || shouldUpdateInfopointIconFile) {
      const body = (await response.json()) as ThemeFormDataProcessed;

      if (shouldUpdateLogoFile && body.logoFile) {
        await dispatch(addFile(body.logoFile));
      }
      if (shouldUpdateInfopointIconFile && body.defaultInfopointIconFile) {
        await dispatch(addFile(body.defaultInfopointIconFile));
      }
    }

    dispatch(showLoader(false));
    return response.status === 200;
  } catch (error) {
    console.error("Error occured while saving expo design data: ", error);
    dispatch(showLoader(false));
    return false;
  }
};

// - - -

export const isFileInActiveExpoStructureFiles = (
  activeExpo: ActiveExpo,
  file: IndihuFile
) => {
  const folders = activeExpo.structure.files;

  const found = folders.find((currFolder) => {
    const found = currFolder.files?.find((currFile) => {
      if (currFile.id === file.id) {
        return true;
      }
    });

    return !!found;
  });

  return !!found;
};
