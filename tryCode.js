// Import Node.js dependencies
import fs from "node:fs";
import path from "node:path";


// Import des constantes
const kDefaultFile = "input.txt";
const kFilePath = process.argv[2] ?? path.join(process.cwd(), kDefaultFile);
const kSpecialCharacters = new Set(["@", "{", ":", "}", "\""]);

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
  let previousCharacter = "";

  // Je boucle sur l'index et j'incrémente +1 tant que i < à la longueru de dataSource
  for (let i = 0; i < dataSource.length; i++) {
    // les constantes de la boucle & des règles du tokenizer
    // le caractère courant
    const character = dataSource[i];
    const kIsCurrentCharacterWordOrDigit = /[a-zA-Z0-9]/.test(character);
    const kIsPreviousCharacterWordOrDigit = /[a-zA-Z0-9]/.test(previousCharacter);
    const kIsCurrentCharacterSpace = /\s/.test(character);

    // Si l'index est égal à zéro OU qu'il est égal à 0 ET que le caractère courant est un "@"
    // J'insère "{\"" afin d'ouvrir ma structure JSson et l"ouverture de ma clé
    // Sinon si j'arrive à la fin de ma chaine de caractères alors je ferme ma structure Json avec "}"
    if ((i === 0 && (character !== "{" || character !== "\"")) || (i === 0 && character === "@")) {
      tmpString += "{\"";
      continue;
    }
    else if (i === dataSource.length - 1) {
      tmpString += "}";
    }

    // Si le caratère courant est @ ou : ou { ou encore } alors je les considère et je les insère dans ma variable
    if (kSpecialCharacters.has(character)) {
      tmpString += character;
    }

    // Si le caractère précédent est un espace et que le caractère courant est une lettre ou un chifre
    // alors on insère un "\"" dans la variable.
    if (previousCharacter === " " && kIsCurrentCharacterWordOrDigit) {
      tmpString += "\"";
    }

    // Si le caractère précédent est une lettre ou un chiffre ET que le caractère courrant est : OU un espace
    // j'insère "\"" dans ma variable.
    if (kIsPreviousCharacterWordOrDigit && (character === ":" || kIsCurrentCharacterSpace)) {
      tmpString += "\"";
    }

    if (previousCharacter === "\"" && kIsCurrentCharacterSpace) {
      tmpString += ":";
    }

    if (previousCharacter === "@" && character === ":") {
      tmpString += "\"";
    }

    if (character === "}" && i < dataSource.length) {
      tmpString += ",";
    }

    // si le caractère est une lettre minuscule || majuscule || un chiffre
    // alors je l'incrémente à la variable.
    if (kIsCurrentCharacterWordOrDigit) {
      tmpString += character;
    }
    // si le caractère est un espace alors, on l'affiche.
    if (kIsCurrentCharacterSpace) {
      tmpString += character;
    }

    previousCharacter = character;
    tmpString = tmpString.replace("\" ", "\": ");
    tmpString = tmpString.replace(":\"", "\":");
  }

  yield tmpString;

  // const jsonObject = JSON.parse(tmpString);

  // yield jsonObject;
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


// TODO: Reste les virgules & le @ de @hello + voir si possible refacto
