/**
 * Downloads a file
 *
 * @param file blob object or URL for the file
 * @param filename name for the file that will be downloaded
 */
export const downloadFile = (file: Blob | string, filename: string) => {
  const url =
    typeof file === "string" ? file : window.URL.createObjectURL(file);

  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  window.URL.revokeObjectURL(url);
};
