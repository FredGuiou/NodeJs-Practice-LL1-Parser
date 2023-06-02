// Import Node.js dependencies
import fs from "node:fs";
import path from "node:path";


// Import des constantes
const kdefaultFile = "example.txt";
const kfilePath = process.argv[2] ?? path.join(process.cwd(), kdefaultFile);

export function getDataFromFile() {
  if (!fs.existsSync(kfilePath)) {
    console.log("File doesn't exist");

    return null;
  }

  const txtFile = fs.readFileSync(kfilePath, { encoding: "utf-8" });

  return txtFile;
}

export async function createJsonObject() {
  const content = getDataFromFile();
  const jsonObject = {};

  // console.log(jsonObject);
  console.log("Work in progress on tryCode.js line 22");
}

getDataFromFile();
createJsonObject();
