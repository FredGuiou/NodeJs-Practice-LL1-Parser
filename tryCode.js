// Import Node.js dependencies
import fs from "node:fs";
import path from "node:path";


// Import des constantes
const kDefaultFile = "example.txt";
const kFilePath = process.argv[2] ?? path.join(process.cwd(), kDefaultFile);

// dataGetter | Lecture du fichier d'entrée
export function getDataFromFile() {
  if (!fs.existsSync(kFilePath)) {
    console.log("File doesn't exist");

    return null;
  }

  const dataSource = fs.readFileSync(kFilePath, { encoding: "utf-8" });

  return dataSource;
}

// Tokenizer : analyse lexicale des inputData
export function* tokenizer(dataSource) {
  // Définition d'une string temporaire
  let tmpString = "";

  // Je boucle sur l'index et j'incrémente +1 tant que i < à la longueru de dataSource
  for (let i = 0; i < dataSource.length; i++) {
    // le caractère courant
    const character = dataSource[i];
    // Si le premier caractère de la string est un "@" alors on passe (équivaut à un delete du caractère)
    if (i === 0) {
      if (character === "@") {
        continue;
      }
    }
    else if (character === "@") {
      tmpString += character;
    }
    // si le caractère est une lettre minuscule || majuscule || un chiffre
    // alors je l'incrémente à tmpString
    if (/[a-zA-Z0-9]/.test(character)) {
      tmpString += character;
    }
    // // si le caractère est un espace alors les caractères qui le précèdent constituent une clé.
    // if (/\s/.test(character)) {
    //   const key = tmpString.slice(0, i);
    //   yield key;
    // }
  }
  yield tmpString;
}


// Principale fonction | Launcher
export function main() {
  // Point d'entrée principal
  const data = getDataFromFile();
  for (const token of tokenizer(data)) {
    console.log(token);
  }
}

main();
