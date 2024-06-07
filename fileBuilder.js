const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");


const writeData = data => {
    // extrayendo informacion
    const content = fs.readFileSync(
        path.resolve(__dirname, "docs/formato.docx"),
        "binary"
    );

    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    // ###################### inputs ################
    doc.render(data);
    const buf = doc.getZip().generate({
        type: "nodebuffer",
        compression: "DEFLATE",
    });

    fs.writeFileSync(path.resolve(__dirname, "docs/output.docx"), buf);
    return path.resolve(__dirname, "docs/output.docx");
}
module.exports = {
    writeData
}