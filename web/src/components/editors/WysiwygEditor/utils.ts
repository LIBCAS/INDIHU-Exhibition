export const getTextFromHtml = (htmlMarkup: string) => {
  const replacedEnters =
    htmlMarkup === "<p><br></p>"
      ? "<p></p>"
      : htmlMarkup.replaceAll("<br>", "\n");

  const plainText = new DOMParser().parseFromString(replacedEnters, "text/html")
    .body.textContent;

  return plainText;
};

export const wrapTextInParagraph = (text: string) => {
  return `<p>${text}</p>`;
};
