// Import Node.js dependencies
import fs from "node:fs";
import path from "node:path";


// Import des constantes
const kDefaultFile = "input.txt";
const kFilePath = process.argv[2] ?? path.join(process.cwd(), kDefaultFile);
const kLiteral = /[a-zA-Z0-9]/;
const kSpecial = new Set(["@", "_", "-"]);
const kSymbols = new Set(["{", ":", "}"]);


export function getDataFromFile() {
  if (!fs.existsSync(kFilePath)) {
    console.log("File doesn't exist");
    process.exit();
  }

  const data = fs.readFileSync(kFilePath, { encoding: "utf-8" });

  return data;
}


export function* tokenizer(data) {
  let output = "";
  for (const character of data) {
    if (kLiteral.test(character)) {
      output += character;
      yield { type: "LITERAL", value: output };
    }
    if (kSpecial.has(character)) {
      output += character;
      yield { type: "LITERAL", value: output };
    }
    if (kSymbols.has(character)) {
      output += character;
      yield { type: "SYMBOL", value: output };
    }
    output = "";
  }
}

const data = getDataFromFile();

for (const token of tokenizer(data)) {
  console.log(token);
}
