// Import Node.js dependencies
import PrettyJSON from "@slimio/pretty-json";
import fs from "node:fs";
import path from "node:path";


// Import des constantes
const kDefaultFile = "input.txt";
const kFilePath = process.argv[2] ?? path.join(process.cwd(), kDefaultFile);
const kJsonCharacterType = {
  START_NEW_OBJECT: 0,
  KEY: 1,
  VALUE: 2,
  END_OBJECT: 3
};

// Lecture du fichier d'entrée.
export function getDataFromFile() {
  if (!fs.existsSync(kFilePath)) {
    console.log("File doesn't exist");
    process.exit();
  }

  const dataSource = fs.readFileSync(kFilePath, { encoding: "utf-8" });

  return dataSource;
}

// Utilisation d'une classe plutôt qu'une fonction pour créer un caractère.
export class Character {
  constructor(type, value = "", nextType = null) {
    this.type = type;
    this.value = value;
    this.nextType = nextType;
  }
}


// Tokenizer : analyse lexicale des inputData
export function* tokenizer(dataSource) {
  const firstCharacter = new Character(kJsonCharacterType.START_NEW_OBJECT);
  yield firstCharacter;

  // let previousCharacter = firstCharacter;
  // let currentCharacter = new Character(kJsonCharacterType.KEY);
}


// fonction des conditions d'affichage des caractères.
export function display() {
  let character = "";
  let previousCharacter = null;

  if (character.type === kJsonCharacterType.START_NEW_OBJECT) {
    character += "{";
  }
  else if (character.type === kJsonCharacterType.KEY) {
    if (previousCharacter.type === kJsonCharacterType.VALUE || previousCharacter.type === kJsonCharacterType.END_OBJECT) {
      character += ",";
    }
    character += `"${character.value}":`;
  }
  else if (character.type === kJsonCharacterType.VALUE) {
    character += `"${character.value}"`;
  }
  else {
    character += "}";
  }
  previousCharacter = character;

  return character;
}

// Principale fonction | Launcher.
export function main() {
  const data = getDataFromFile();
  for (const token of tokenizer(data)) {
    const displayedCharacter = display(token);
    console.log(displayedCharacter);
    // console.log(JSON.parse(displayedCharacter));
    // PrettyJSON(JSON.parse(displayedCharacter));
  }
}

main();
