"use strict";
const resultMeanings = document.querySelector(".result__meanings");
const tempDefinition = document.getElementById("definition");
const tempMeanings = document.getElementById("meanings");

if ("content" in document.createElement("template")) {
  const cloneDefinition = document.importNode(tempDefinition.content, true);
  resultMeanings.appendChild(cloneDefinition);
  const lexicalList = resultMeanings.querySelector(".lexical__list");
  const cloneLexicalList = document.importNode(tempMeanings.content, true);
  lexicalList.appendChild(cloneLexicalList);
}
