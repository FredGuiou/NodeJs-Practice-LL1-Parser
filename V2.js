// Import Node.js dependencies
import fs from "node:fs";
import { EOL } from "node:os";
import path from "node:path";
import prettyJSON from "@slimio/pretty-json";


// Import des constantes
const kDefaultFile = "input.txt";
const kFilePath = process.argv[2] ?? path.join(process.cwd(), kDefaultFile);
const kJsonChunkType = {
  START_NEW_OBJECT: 0,
  KEY: 1,
  VALUE: 2,
  END_OBJECT: 3
};

const propertyDelimiter = new Set(["{", ":"]);
const forbidenPropertyFirstCharacter = new Set(["@"]);

// dataGetter | Lecture du fichier d'entrée
export function getDataFromFile() {
  if (!fs.existsSync(kFilePath)) {
    console.log("File doesn't exist");

    return null;
  }

  const dataSource = fs.readFileSync(kFilePath, { encoding: "utf-8" });

  return dataSource;
}

export function createChunk(type, value = "", nextType = null) {
  return { type, value, nextType };
}

export function* tokenizer(dataSource) {
  const firstChunk = createChunk(kJsonChunkType.START_NEW_OBJECT);
  yield firstChunk;

  let previousChunk = firstChunk;
  let currentChunk = createChunk(kJsonChunkType.KEY);


  for (let i = 0; i < dataSource.length; i++) {
    const character = dataSource[i];
    // const chunk = new Chunk(character);
    // if (chunk.isKey)
    if (currentChunk.type === kJsonChunkType.KEY) {
      if (propertyDelimiter.has(character)) {
        // pb #1 : currentChunk.value commence par un @ on doit le supprimer
        // pb #2 : il est suivi par un espace, il faut le supprimer.
        currentChunk.value = currentChunk.value.trim();
        while (forbidenPropertyFirstCharacter.has(currentChunk.value[0])) {
          currentChunk.value = currentChunk.value.slice(1);
        }
        yield currentChunk;
        previousChunk = currentChunk;

        if (character === "{") {
          yield createChunk(kJsonChunkType.START_NEW_OBJECT);
          currentChunk = createChunk(kJsonChunkType.KEY);
          continue;
        }
        else {
          // Character = :
          currentChunk = createChunk(kJsonChunkType.VALUE);
          continue;
        }
      }
      else {
        currentChunk.value += character;
      }
    }
    else if (currentChunk.type === kJsonChunkType.VALUE) {
      if (character === "\n") {
        currentChunk.value = currentChunk.value.trim();
        yield currentChunk;
        previousChunk = currentChunk;

        const nextCharacter = dataSource[i + 1];
        if (nextCharacter === "}") {
          yield createChunk(kJsonChunkType.END_OBJECT);
          // eslint-disable-next-line max-depth
          if (i + 1 === dataSource.length - 1) {
            yield createChunk(kJsonChunkType.END_OBJECT);

            return ;
          }
          i++;
        }
        currentChunk = createChunk(kJsonChunkType.KEY);
      }
      else {
        currentChunk.value += character;
      }
    }
  }
  yield createChunk(kJsonChunkType.END_OBJECT);
}


export function main() {
  // Point d'entrée principal
  const data = getDataFromFile();
  let finalString = "";
  // chunk = { type: kJsonChunkType, value?: string }
  let previousChunk = null;
  for (const chunk of tokenizer(data)) {
    if (chunk.type === kJsonChunkType.START_NEW_OBJECT) {
      finalString += "{";
    }
    else if (chunk.type === kJsonChunkType.KEY) {
      if (previousChunk.type === kJsonChunkType.VALUE || previousChunk.type === kJsonChunkType.END_OBJECT) {
        finalString += ",";
      }
      finalString += `"${chunk.value}":`;
    }
    else if (chunk.type === kJsonChunkType.VALUE) {
      finalString += `"${chunk.value}"`;
    }
    else {
      finalString += "}";
    }
    previousChunk = chunk;
  }
  console.log(finalString);
  console.log(JSON.parse(finalString));
  prettyJSON(JSON.parse(finalString));
}

main();
