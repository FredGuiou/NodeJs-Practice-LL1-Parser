// Import NodeJs dependencies
import fs from "node:fs";
import path from "node:path";


// Import des constantes
const kDefaultFile = "example.txt";
const kFilePath = process.argv[2] ?? path.join(process.cwd(), kDefaultFile);

function getDataFromfile() {
  if (!fs.existsSync(kFilePath)) {
    console.log("File doesn't exist");

    return null;
  }

  const txtFile = fs.readFileSync(kFilePath, { encoding: "utf-8" });
  console.log(txtFile);

  return txtFile;
}

const txtFile = getDataFromfile();
