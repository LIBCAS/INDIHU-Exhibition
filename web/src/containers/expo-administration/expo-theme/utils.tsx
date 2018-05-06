import { Dispatch, SetStateAction } from "react";
import { FormikProps } from "formik";

import { ThemeFormData, ThemeFormDataProcessed } from "./models";
import { ActiveExpo, File as IndihuFile } from "models";

import { DialogType } from "components/dialogs/dialog-types";

// Redux stuff
import { dispatch } from "index";
import { showLoader } from "actions/app-actions";
import { addFile } from "actions/file-actions";
import { setDialog } from "actions/dialog-actions";
import { setExpoDesignData } from "actions/expoActions";

// - - -

export const defaultInitialValues: ThemeFormData = {
  theme: "LIGHT",
  backgroundColor: "#393d41",
  iconsColor: "#d2a473",
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

// - - -

export const createThemeProcessedFormData = (
  formData: ThemeFormData
): ThemeFormDataProcessed => {
  const formDataProcessed: ThemeFormDataProcessed = {
    // 1
    theme: formData.theme || "LIGHT",
    backgroundColor: formData.backgroundColor || "#393d41",
    iconsColor: formData.iconsColor || "#d2a473",
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

    const respBody = (await response.json()) as ThemeFormDataProcessed;

    // When POSTing this route, BE automatically auto detects whether the logo and icon file is not part of the expo and should be added to .expoFiles
    // FE needs to auto detect aswell in order to add these files to structure.files if are currently not part of
    if (shouldUpdateLogoFile || shouldUpdateInfopointIconFile) {
      if (shouldUpdateLogoFile && respBody.logoFile) {
        await dispatch(addFile(respBody.logoFile));
      }
      if (shouldUpdateInfopointIconFile && respBody.defaultInfopointIconFile) {
        await dispatch(addFile(respBody.defaultInfopointIconFile));
      }
    }

    dispatch(showLoader(false));
    return response.status === 200 ? respBody : false;
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

// - - -

export const handleImportedFile = async (
  activeExpo: ActiveExpo,
  formik: FormikProps<ThemeFormData>,
  importedFile: File,
  setImportedFile: Dispatch<SetStateAction<File | null>>
) => {
  const fileReader = new FileReader();
  fileReader.onload = async (event) => {
    try {
      // 1. Read form properties from imported file
      const content = event.target?.result;
      if (content) {
        const importedFileData = JSON.parse(
          content as string
        ) as ThemeFormDataProcessed;

        // 2. Get the information whether the FE redux store (.expoFiles) will need to be updated according to the new imported files
        const importedLogoFile = importedFileData.logoFile;
        const importedIconFile = importedFileData.defaultInfopointIconFile;

        const shouldUpdateLogoFile =
          !!importedLogoFile &&
          !isFileInActiveExpoStructureFiles(activeExpo, importedLogoFile);
        const shouldUpdateIconFile =
          !!importedIconFile &&
          !isFileInActiveExpoStructureFiles(activeExpo, importedIconFile);

        // 3. Use read properties in order to contact BE which will create new icon and logo file and responds with the newly created IDs
        // Does not save all changes, manual save will be required
        const respBody = await saveExpoDesignData(
          importedFileData,
          activeExpo.id,
          shouldUpdateLogoFile,
          shouldUpdateIconFile
        );
        if (!respBody) {
          throw new Error(); // jump to error handling
        }

        // 4. Set the form based on retrieved response body with newly created file ids!
        Object.entries(respBody).forEach(([formKeyName, value]) => {
          if (formKeyName === "logoFile") {
            formik.setFieldValue("logoFile", respBody.logoFile);
            formik.setFieldValue("logoFileName", respBody.logoFile?.name ?? "");
          } else if (formKeyName === "defaultInfopointIconFile") {
            formik.setFieldValue(
              "defaultInfopointIconFile",
              respBody.defaultInfopointIconFile
            );
            formik.setFieldValue(
              "defaultInfopointIconFileName",
              respBody.defaultInfopointIconFile?.name ?? ""
            );
          } else {
            formik.setFieldValue(formKeyName, value);
          }
        });

        // 5. Can happen (if not part of previous export) that the logoFile and infopoint icon file will not be included in response
        // thus, the form for these two fields will be in old previous state
        if (!respBody.logoFile) {
          formik.setFieldValue("logoFile", null);
          formik.setFieldValue("logoFileName", "");
        }
        if (!respBody.defaultInfopointIconFile) {
          formik.setFieldValue("defaultInfopointIconFile", null);
          formik.setFieldValue("defaultInfopointIconFileName", "");
        }

        // 6. Store the current state in global local state (needs manual save)
        dispatch(setExpoDesignData(respBody));

        // 7. Show succesful dialog
        dispatch(
          setDialog(DialogType.InfoDialog, {
            title: "Import bol úspešný!",
            text: "Import prebehol úspešne. Na uloženie zmien nezabudnite kliknúť na tlačítko 'Uložiť zmeny'",
            noStornoButton: true,
          })
        );
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "";

      dispatch(
        setDialog(DialogType.InfoDialog, {
          title: "Import se nezdaril!",
          content: (
            <div>
              <p className="font-bold">
                Neplatný formát importovaného souboru.
              </p>
              {errMsg && <p className="mt-2 italic">{`'${errMsg}'`}</p>}
            </div>
          ),
          noStornoButton: true,
        })
      );
    } finally {
      setImportedFile(null);
    }
  };

  fileReader.readAsText(importedFile);
};
