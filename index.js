// Import NodeJs dependencies
import fs from "node:fs";
import path from "node:path";


// Import des constantes
const kFile = "example.txt";

function getDataFromfile() {
  const cwd = process.cwd();

  const filePath = path.join(cwd, kFile);

  if (!fs.existsSync(filePath)) {
    throw new Error();
  }

  const txtFile = fs.readFileSync(filePath, { encoding: "utf-8" });
  console.log(txtFile);

  return txtFile;
}

getDataFromfile();
