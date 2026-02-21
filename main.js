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
    this.source = document.querySelector(".source__link");
    this.searchInput = document.getElementById("search-input");
    this.lowerSection = document.querySelector(".lower");
    this.welcomeSection = document.querySelector(".start-screen");
    this.noResultsSection = document.querySelector(".no-results");

    this.USER_STATE = { screen: "start" };

    this.init();
  }

  async init() {
    this.setScreen("start");
    this.themeToggle();
    await this.search();
  }

  updateView() {
    const viewState = {
      start: { welcome: true, noDefinition: false, word: false },
      result: { welcome: false, noDefinition: false, word: true },
      noResult: { welcome: false, noDefinition: true, word: false },
    };

    const state = viewState[this.USER_STATE.screen];
    if (!state) return;

    this.welcomeSection.classList.toggle("hidden", !state.welcome);
    this.lowerSection.classList.toggle("hidden", !state.word);
    this.noResultsSection.classList.toggle("hidden", !state.noDefinition);
  }

  themeToggle() {
    this.toggle.addEventListener("change", () => {
      document.body.dataset.theme = toggle.checked ? "dark" : "light";
    });
  }

  setScreen(phase) {
    this.USER_STATE.screen = phase;
    this.updateView();
  }

  async search() {
    this.searchInput.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.resultMeanings.innerHTML = "";
        try {
          const word = e.target.value;
          const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
          );
          if (!response.ok) throw new Error("response not ok");
          this.data = await response.json();
          this.getMainResult();
          this.renderPartOfSpeech();

          this.setScreen("result");
        } catch (error) {
          this.setScreen("noResult");
        }
      }
    });
  }

  renderPartOfSpeech() {
    this.data[0].meanings.forEach((item) => {
      if ("content" in document.createElement("template")) {
        const cloneDefinitions = document.importNode(
          this.tempDefinition.content,
          true,
        );
        const lexicalCategory =
          cloneDefinitions.querySelector(".lexical__category");

        const lexicalList = cloneDefinitions.querySelector(".lexical__list");

        const definitions = item.definitions;

        const synonymsValue = cloneDefinitions.getElementById("synonyms-value");

        const synonyms = item.synonyms;

        lexicalCategory.textContent = item.partOfSpeech;

        if (synonyms.length !== 0) {
          synonymsValue.textContent = synonyms.join(", ");
        } else {
          cloneDefinitions
            .querySelector(".synonyms__title")
            .classList.add("hidden");
          cloneDefinitions
            .querySelector(".synonyms__value")
            .classList.add("hidden");
        }

        this.renderMeanings(lexicalList, definitions);
        this.resultMeanings.appendChild(cloneDefinitions);
      }
    });
  }

  renderMeanings(list, data) {
    data.forEach((item) => {
      if ("content" in document.createElement("template")) {
        const cloneMeanings = document.importNode(
          this.tempMeanings.content,
          true,
        );

        const definition = cloneMeanings.querySelector(".lexical__meaning");

        definition.textContent = item.definition;
        list.appendChild(cloneMeanings);
      }
    });
  }

  getMainResult() {
    this.mainResult.textContent = this.data[0].word;
    this.phonetic.textContent = this.data[0].phonetic;
    this.source.textContent = this.data[0].sourceUrls;
  }
}

new Dictionary();
