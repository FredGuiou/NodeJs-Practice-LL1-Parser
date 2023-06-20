// Import Node.js dependencies
import fs from "node:fs";
import path from "node:path";
import prettyJSON from "@slimio/pretty-json";


// Import des constantes
const kDefaultFile = "input.txt";
const kFilePath = process.argv[2] ?? path.join(process.cwd(), kDefaultFile);
// Définission des différents morceaux composant le fichier JSON
// (Ouverture d'objet, clé, valeur, fermeture d'objet)
const kJsonChunkType = {
  START_NEW_OBJECT: 0,
  KEY: 1,
  VALUE: 2,
  END_OBJECT: 3
};

// Délimiteurs des différents éléments
const propertyDelimiter = new Set(["{", ":"]);
// Caractères interdits en premier caractère.
const forbidenPropertyFirstCharacter = new Set(["@"]);

// Lecture du fichier d'entrée
export function getDataFromFile() {
  if (!fs.existsSync(kFilePath)) {
    console.log("File doesn't exist");
    process.exit();
  }

  const dataSource = fs.readFileSync(kFilePath, { encoding: "utf-8" });

  return dataSource;
}

// Fonction qui détermine les éléments de données.
export function createChunk(type, value = "", nextType = null) {
  return { type, value, nextType };
}

// Générator qui va créer les différents éléments du fichier output.
export function* tokenizer(dataSource) {
  // Création du premier élément "Ouverture d'objet"
  const firstChunk = createChunk(kJsonChunkType.START_NEW_OBJECT);
  yield firstChunk;

  // L'élément précédent la première clé est "{" (firstChunk)
  let previousChunk = firstChunk;
  // Je crée l'élément courant après l'ouverture d'objet (une clé)
  let currentChunk = createChunk(kJsonChunkType.KEY);

  // Je boucle sur l'index de datasource pour parcourir chaque caractère.
  for (let i = 0; i < dataSource.length; i++) {
    // Le caractère traité.
    const character = dataSource[i];
    // Si le type de l'élément courant est "clé"
    if (currentChunk.type === kJsonChunkType.KEY) {
      // Si le caractère traité est un propertyDlimiter ({ ou :)
      if (propertyDelimiter.has(character)) {
        // pb #1 : currentChunk.value commence par un @ on doit le supprimer
        // pb #2 : il est suivi par un espace, il faut le supprimer.

        // Je suprimme les espaces avant & après l'élément value avec trim().
        currentChunk.value = currentChunk.value.trim();
        // Tant que le premier caractère de lélément courant contient est un caractère interdit
        while (forbidenPropertyFirstCharacter.has(currentChunk.value[0])) {
          // J'utilise slice pour supprimer cet élément.
          currentChunk.value = currentChunk.value.slice(1);
        }
        // Je génère l'élément en cours.
        yield currentChunk;
        // J'actualise l'élément précédent.
        previousChunk = currentChunk;

        // Si le caractère est "{"
        if (character === "{") {
          // On généère un nouvel élément ayant le type "ouverture d'objet"
          yield createChunk(kJsonChunkType.START_NEW_OBJECT);
          // On crée l'élément courant qui est forcément une clé après une ouverture d'objet.
          currentChunk = createChunk(kJsonChunkType.KEY);
          // continue;
        }
        else {
          // Si le caractère est ":", on crée un nouvel élément qui sera donc une valeur
          currentChunk = createChunk(kJsonChunkType.VALUE);
          // continue;
        }
      }
      else {
        // Sinon le caractère n'est pas un propertyDelimiter
        // J'ajoute à la value de l'élément courant le caractère.
        currentChunk.value += character;
      }
    }
    // Sinon si l'élément courant est de type Value
    else if (currentChunk.type === kJsonChunkType.VALUE) {
      // Si le caractère traité est un retour à la ligne
      if (character === "\n") {
        // on utilise trim() pour le supprimer sur la valeur de l'élément courant.
        currentChunk.value = currentChunk.value.trim();
        // On génère l'élément courant et on actualise l'élément précédent.
        yield currentChunk;
        previousChunk = currentChunk;

        // Je définis le caractère suivant
        const nextCharacter = dataSource[i + 1];
        // Si le caractère suivant est "}" pour fermer un objet.
        if (nextCharacter === "}") {
          // Je génère un  nouvel élément avec pour type la fermeture d'objet.
          yield createChunk(kJsonChunkType.END_OBJECT);
          // OIn vérifie si le caractère actuel est l'avant dernier
          // eslint-disable-next-line max-depth
          if (i + 1 === dataSource.length - 1) {
            // On génère donc un nouvel élément fermant d'objet, puis on sort de la condition.
            yield createChunk(kJsonChunkType.END_OBJECT);

            return ;
          }
          // On incrémente 1 à i pour sauter le caractère suivant.
          i++;
        }
        // Dans le cas où le prochain caractère n'est pas une fermeture d'objet, on créé une nouvelle clé.
        currentChunk = createChunk(kJsonChunkType.KEY);
      }
      else {
        // Sinon si l'objet n'est pas un retour à la ligne alors j'ajoute le caractère à la valeur de l'élément courant.
        currentChunk.value += character;
      }
    }
  }
  // Je génère une fermeture d'objet.
  yield createChunk(kJsonChunkType.END_OBJECT);
}

// La fonction principale qui gère l'affichage des éléments.
export function main() {
  // R2cupération des données du fichier d'input.
  const data = getDataFromFile();

  // On initialise la string finale.
  // On initialise l'élément précédent à null.
  let finalString = "";
  let previousChunk = null;

  // Pour chaque élément en provenance de la fonction tokenizer à laquelle on passe data en argument.
  for (const chunk of tokenizer(data)) {
    // Si le type de l'élément est Couverture d'objet
    if (chunk.type === kJsonChunkType.START_NEW_OBJECT) {
      // J'ajoute à finalString une acolade ouvrante.
      finalString += "{";
    }
    // Sinon si le type de l'élément est Clé
    else if (chunk.type === kJsonChunkType.KEY) {
      // Si le type de l'élément précédent est value OU fermeture d'objet
      if (previousChunk.type === kJsonChunkType.VALUE || previousChunk.type === kJsonChunkType.END_OBJECT) {
        // J'ajoute à finalString une virgule
        finalString += ",";
      }
      // J'ajoute la template string à fianl string "valeur_de_la_clé":
      finalString += `"${chunk.value}":`;
    }
    // Sinon si le type de l'élément est Value
    else if (chunk.type === kJsonChunkType.VALUE) {
      // J'ajoute la temple string à final string. Ici "valeur_de_la_value".
      finalString += `"${chunk.value}"`;
    }
    // Sinon j'ajoute une accolade fermante à finalString pour pour fermer mon objet
    else {
      finalString += "}";
    }
    // Je met à jour préviousChunk avec la valeur courante de chunk
    previousChunk = chunk;
  }
  console.log(finalString);
  console.log(JSON.parse(finalString));
  prettyJSON(JSON.parse(finalString));
}

main();
