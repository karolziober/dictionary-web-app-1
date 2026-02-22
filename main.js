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
    this.searchForm = document.querySelector(".search");
    this.lowerSection = document.querySelector(".lower");
    this.welcomeSection = document.querySelector(".start-screen");
    this.noResultsSection = document.querySelector(".no-results");
    this.validationMessage = document.getElementById("validation-message");
    this.play = document.getElementById("play");
    this.home = document.getElementById("home");
    this.dropDownBtn = document.getElementById("dropdown");
    this.dropDownList = document.querySelector(".dropdown-section__list");
    this.headerFont = document.getElementById("header-font");
    this.fontBtns = document.querySelectorAll(".dropdown-section__font");

    this.USER_STATE = { screen: "start" };

    this.init();
  }

  async init() {
    this.setScreen("start");
    this.themeToggle();
    await this.search();
    this.playBack();
    this.startPage();
    this.showDropDown();
    this.setFont();
  }

  updateView() {
    const viewState = {
      start: { welcome: true, noDefinition: false, word: false, empty: false },
      result: { welcome: false, noDefinition: false, word: true, empty: false },
      noResult: {
        welcome: false,
        noDefinition: true,
        word: false,
        empty: false,
      },
      emptyForm: {
        welcome: false,
        noDefinition: false,
        word: false,
        empty: true,
      },
    };

    const state = viewState[this.USER_STATE.screen];
    if (!state) return;

    this.welcomeSection.classList.toggle("hidden", !state.welcome);
    this.lowerSection.classList.toggle("hidden", !state.word);
    this.noResultsSection.classList.toggle("hidden", !state.noDefinition);
    this.validationMessage.classList.toggle("hidden", !state.empty);
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
        if (this.searchInput.value !== "") {
          try {
            const word = e.target.value;
            const response = await fetch(
              `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
            );
            if (!response.ok) throw new Error("response not ok");
            this.data = await response.json();
            this.fieldValidation(false);
            this.getMainResult();
            this.renderPartOfSpeech();

            this.setScreen("result");
          } catch (error) {
            this.setScreen("noResult");
          }
        } else {
          this.setScreen("emptyForm");
          this.fieldValidation(true);
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
    this.source.href = this.data[0].sourceUrls;
  }

  resetMainResult() {
    this.mainResult.textContent = "";
    this.phonetic.textContent = "";
    this.source.textContent = "";
    this.source.href = "";
  }

  fieldValidation(condition) {
    this.searchForm.classList.toggle("search--validation", condition);
  }

  playBack() {
    this.play.addEventListener("click", () => {
      if (!this.data) return;
      const url = this.data[0].phonetics.find(
        (item) => item.audio !== "",
      ).audio;
      const audio = new Audio(url);
      audio.play();
    });
  }

  clearInput() {
    this.searchInput.value = "";
  }

  startPage() {
    this.home.addEventListener("click", () => {
      this.setScreen("start");
      this.clearInput();
    });
  }

  showDropDown() {
    this.dropDownBtn.addEventListener("click", () => {
      this.dropDownList.classList.toggle("hidden");
    });
  }

  setFont() {
    this.fontBtns.forEach((btn) =>
      btn.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
          document.body.dataset.font = e.target.dataset.value;
          this.headerFont.textContent = e.target.textContent;
        }
      }),
    );
  }
}

new Dictionary();
