// Import Node.js dependencies
import fs from "node:fs";
import { EOL } from "node:os";
import path from "node:path";


// Import des constantes
const kDefaultFile = "example.txt";
const kFilePath = process.argv[2] ?? path.join(process.cwd(), kDefaultFile);

// Lecture du fichier d'entrée
export function getDataFromFile() {
  if (!fs.existsSync(kFilePath)) {
    console.log("File doesn't exist");

    return null;
  }

  const inputTxtFile = fs.readFileSync(kFilePath, { encoding: "utf-8" });

  return inputTxtFile;
}


export function parseInput(txtFile) {
  const lines = txtFile.trim().split(EOL);
  // console.log("EOL:", lines);

  for (const line of lines) {
    const trimmedLine = line.trim();
    const condition = trimmedLine.startsWith("@") ? trimmedLine.slice(1) : trimmedLine;
    const splitCondition = trimmedLine.startsWith("@") ? condition.split("{") : condition;
    const key = Array.isArray(splitCondition) ? splitCondition[0].toString() : splitCondition;
    const stringifyKey = trimmedLine.startsWith("@") ? JSON.stringify(key.trimEnd()) : key;
    console.log(stringifyKey);
  }
}


function main() {
  const txtFile = getDataFromFile();
  parseInput(txtFile);
}

main();
