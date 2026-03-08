const PDFParser = require("pdf2json");

const parsePDF = (filePath) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData) => {
      reject(errData.parserError);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      let text = "";

      pdfData.Pages.forEach((page) => {
        page.Texts.forEach((textItem) => {
          textItem.R.forEach((run) => {
            try {
              text += decodeURIComponent(run.T) + " ";
            } catch (err) {
              // fallback if decoding fails
              text += run.T + " ";
            }
          });
        });
      });

      resolve(text);
    });

    pdfParser.loadPDF(filePath);
  });
};

module.exports = parsePDF;
