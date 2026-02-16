"use strict";

class Dictionary {
  constructor() {
    this.resultMeanings = document.querySelector(".result__meanings");
    this.tempDefinition = document.getElementById("definition");
    this.tempMeanings = document.getElementById("meanings");
    this.toggle = document.getElementById("toggle");
    this.mainResult = document.getElementById("main-result");
    this.phonetic = document.getElementById("phonetic");
    this.synonyms = document.getElementById("synonyms-value");

    this.init();
  }

  async init() {
    await this.loadData();
    this.themeToggle();
    this.generateTemplate();
    this.getMainResult();
  }

  async loadData() {
    try {
      const response = await fetch("data.json");
      if (!response) throw new Error("response not ok");
      this.data = await response.json();
    } catch (error) {
      console.log("No data to load");
      this.data = null;
    }
  }

  themeToggle() {
    this.toggle.addEventListener("change", () => {
      document.body.dataset.theme = toggle.checked ? "dark" : "light";
    });
  }

  generateTemplate() {
    this.resultMeanings.innerHTML = "";

    this.data[0].meanings.forEach((meaning) => {
      const clone = this.tempDefinition.content.cloneNode(true);
      clone.querySelector(".lexical__category").textContent =
        meaning.partOfSpeech;
      clone.querySelector(".synonyms__value").textContent =
        meaning.synonyms.join(", ");

      const list = clone.querySelector(".lexical__list");
      meaning.definitions.forEach((def) => {
        const li = this.tempMeanings.content.cloneNode(true);
        li.querySelector(".lexical__meaning").textContent = def.definition;
        list.appendChild(li);
      });

      this.resultMeanings.appendChild(clone);
    });
  }

  getMainResult() {
    this.mainResult.textContent = this.data[0].word;
    this.phonetic.textContent = this.data[0].phonetic;
    this.synonyms.textContent = this.data[0].meanings[0].definitions[0];
  }
}

new Dictionary();
