// Import NodeJs dependencies
import fs from "node:fs";
import path from "node:path";


// Import des constantes
const kdefaultFile = "example.txt";
const kfilePath = process.argv[2] ?? path.join(process.cwd(), kdefaultFile);

function getDataFromfile() {
  if (!fs.existsSync(kfilePath)) {
    console.log("File doesn't exist");

    return null;
  }

  const txtFile = fs.readFileSync(kfilePath, { encoding: "utf-8" });
  console.log(txtFile);

  return txtFile;
}

getDataFromfile();
