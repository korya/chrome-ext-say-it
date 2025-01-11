// textExtraction.js

export async function extractTextFromPage() {
  // This could be a content script function that runs in the context of the
  // page. As of now, there is no stable API for extensions to directly access
  // Reading Mode.
  // Hence we just do something naive:
  console.log('+++ extractTextFromPage: running +++');
  const bodyText = document.body.innerText || "";
  return bodyText.trim();
}
  