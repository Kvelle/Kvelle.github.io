var gameObject = {
  distance: 0,
  kongmunist_multiplier: 1,
  travelPower: 1,
  total_dps: 0,
  start_date: undefined,
  theme: "light",

  generators: {
    gen1: {
      amount: 0,
      cost: 10,
      start_cost: 10,
      dps: 1,
      name: "Generator 1",
    },
    gen2: {
      amount: 0,
      cost: 150,
      start_cost: 100,
      dps: 3,
      name: "Generator 2",
    },
    gen3: {
      amount: 0,
      cost: 2000,
      start_cost: 2000,
      dps: 15,
      name: "Generator 3",
    },
    gen4: {
      amount: 0,
      cost: 10000,
      start_cost: 12500,
      dps: 120,
      name: "Generator 4",
    },
    gen5: {
      amount: 0,
      cost: 100000,
      start_cost: 100000,
      dps: 900,
      name: "Generator 5",
    },
    gen6: {
      amount: 0,
      cost: 5000000,
      start_cost: 5000000,
      dps: 15000,
      name: "Generator 6",
    }
  },

  upgrades: {
    click_boost: {
      amount: 0,
      cost: 100,
      start_cost: 100,
      name: "Double Click Power"
    },
    multiplier: {
      amount: 0,
      cost: 1000,
      start_cost: 1000,
      name: "Upgradable Multiplier"
    },
  }
};

const gameObjectCopy = gameObject;
var d = new Date();
let delay = 3000;
var saveString = "";

showTab(1);
showTravelTab(1);
updateDistance(100);

setTheme();
loadGame();

var theme = "light";
function setTheme() {
    const themeSelector = document.querySelector("#themeSelector");
    document.querySelector("#body").classList.remove(theme);
    theme = themeSelector.value;
    document.querySelector("#body").classList.add(theme);
    gameObject.theme = theme;
}

function saveGame() {
  localStorage.setItem("save", JSON.stringify(gameObject));
  delay = 0;
}

function loadGame() {
  let game_save = JSON.parse(localStorage.getItem("save"));
  const merge = { ...gameObject, ...game_save };
  gameObject = merge;
  for (let i in gameObject.generators) {
    if (gameObject.generators[i] == null) {
      gameObject.generators[i] = gameObjectCopy.generators[i];
    }
  }
  for (let i in gameObject.upgrades) {
    if (gameObject.upgrades[i] == null) {
      gameObject.upgrades[i] = gameObjectCopy.upgrades[i];
    }
  }
  if (gameObject.start_date == undefined) {
    gameObject.start_date =
      d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
    saveGame();
  }
  document.querySelector("#startDate").innerHTML =
    "Save Start: " + gameObject.start_date;
  document.querySelector("#editedSave").innerHTML =
    "Save Edited: " + gameObject.save_edit;
  updateGenerators();
  updateUpgrades();
  setTheme(gameObject.theme)
}

function wipeGame() {
  if (confirm("Are you sure? The local save will be deleted.")) {
    gameObject = gameObjectCopy;
    saveGame();
    loadGame();
  }
}

function exportSaveString() {
  document.querySelector("#saveBox").value = btoa(JSON.stringify(gameObject));
}

function importSaveString() {
  let val = document.querySelector("#saveBox").value;
  let game_save = JSON.parse(atob(val));
  const merge = { ...gameObject, ...game_save };
  gameObject = merge;
  for (let i in gameObject.generators) {
    if (gameObject.generators[i] == null) {
      gameObject.generators[i] = gameObjectCopy.generators[i];
    }
  }
  for (let i in gameObject.upgrades) {
    if (gameObject.upgrades[i] == null) {
      gameObject.upgrades[i] = gameObjectCopy.upgrades[i];
    }
  }
  saveGame();
  updateGenerators();
  updateUpgrades();
}

function clearSaveBox() {
  document.querySelector("#saveBox").value = "";
}

function copySave() {
  document.querySelector("#saveBox").select();
  document.execCommand("copy");
}

function close_window() {
  saveGame();
  close();
}

function value_limit(val, min, max) {
  return (val >= min && val <= max);
}

function showTab(i) {
  document.querySelector("#tab1").style.display = "none";
  document.querySelector("#tab2").style.display = "none";
  document.querySelector("#tab3").style.display = "none";
  document.querySelector("#tab4").style.display = "none";
  document.querySelector("#tab" + i).style.display = "block";
}

function showTravelTab(i) {
  document.querySelector("#travelTab1").style.display = "none";
  document.querySelector("#travelTab2").style.display = "none";
  document.querySelector("#travelTab3").style.display = "none";
  document.querySelector("#travelTab4").style.display = "none";
  document.querySelector("#travelTab" + i).style.display = "block";
}

function percision(n, p = 1) {
  return Number.parseFloat(n).toPrecision(4);
}

function exponentialForm(n) {
  if (percision(n) >= 1000000000) {
    return Number.parseFloat(n).toExponential(2);
  } else return String(n).split(".")[0];
}

function travelPressed() {
  let n = gameObject.travelPower;
  gameObject.distance += n;
}

function buyGenerator(name) {
  if (gameObject.generators[name].cost <= gameObject.distance) {
    gameObject.distance -= gameObject.generators[name].cost;
    gameObject.generators[name].amount++;
    gameObject.generators[name].cost =
      gameObject.generators[name].start_cost *
      Math.pow(1.15, gameObject.generators[name].amount);
    updateGenerators();
  }
}

function buyUpgrade(name) {
  if (gameObject.upgrades[name].cost <= gameObject.distance) {
    gameObject.distance -= gameObject.upgrades[name].cost;
    gameObject.upgrades[name].amount++;
    if (name == "click_boost") {
      gameObject.upgrades[name].cost =
        gameObject.upgrades[name].start_cost *
        Math.pow(2.5, gameObject.upgrades[name].amount);
      gameObject.travelPower = Math.pow(2, gameObject.upgrades[name].amount);
    }
    if (name == "kongmunist_multiplier") {
      gameObject.upgrades[name].cost =
        gameObject.upgrades[name].start_cost *
        Math.pow(1.3, gameObject.upgrades[name].amount);
      gameObject.kongmunist_multiplier = Math.pow(1.03, gameObject.upgrades[name].amount);
    }
    updateUpgrades();
  }
}

function updateGenerators() {
  document.querySelector("#generators").innerHTML = "";
  for (let i in gameObject.generators) {
    document.querySelector(
      "#generators"
    ).innerHTML += `<div id="${i}" style="margin:1rem 0 0 10%">`;
    document.querySelector(
      "#" + i
    ).innerHTML += `<button id="${i}_btn" class="standardBtn generatorBtn" onclick="buyGenerator('${i}')">Cost: ${exponentialForm(
      gameObject.generators[i].cost
    )}</button>`;
    document.querySelector(
      "#" + i
    ).innerHTML += `<label for="${i}_btn" style="float:right; margin-right:10%">${gameObject.generators[i].name} (${exponentialForm(
      gameObject.generators[i].amount)}) </label>`;
  }
}

function updateUpgrades() {
  document.querySelector("#upgrades").innerHTML = "";
  for (let i in gameObject.upgrades) {
    document.querySelector(
      "#upgrades"
    ).innerHTML += `<div id="${i}" style="margin:1rem 0 0 10%">`;
    document.querySelector(
      "#" + i
    ).innerHTML += `<button id="${i}_btn" class="standardBtn generatorBtn" onclick="buyUpgrade('${i}')">Cost: ${exponentialForm(
      gameObject.upgrades[i].cost
    )}</button>`;
    document.querySelector(
      "#" + i
    ).innerHTML += `<label for="${i}_btn">${gameObject.upgrades[i].name}</label>`;
    document.querySelector(
      "#" + i
    ).innerHTML += `<p style="display: inline; float:right; margin-right: 10%;">Amount (${exponentialForm(
      gameObject.upgrades[i].amount
    )})</p>`;
  }
}

function updateDistance(fps) {
  updateGenerators();
  updateUpgrades();
  document.querySelector("#themeSelector").addEventListener("change", setTheme);
  setInterval(() => {
    gameObject.total_dps = 0;
    for (let i in gameObject.generators) {
      gameObject.distance +=
        (gameObject.generators[i].amount * gameObject.generators[i].dps) * gameObject.kongmunist_multiplier / fps;
      gameObject.total_dps +=
        gameObject.generators[i].amount * gameObject.generators[i].dps * gameObject.kongmunist_multiplier;
    }
    document.querySelector("#currencyAmount").innerHTML =
      exponentialForm(gameObject.distance) + " Meters";
    document.querySelector("#currencyPerSecond").innerHTML =
      exponentialForm(gameObject.total_dps) + " m/s";

    delay++;
    if (delay / 100 < 5) {
      document.querySelector("#lastSaveLabel").innerHTML = "Safe to Exit";
      document.querySelector("#lastSaveLabel").style.color = "#7AE465";
    } else {
      document.querySelector("#lastSaveLabel").innerHTML = "Progress Unsaved";
      document.querySelector("#lastSaveLabel").style.color = "#E04444";
    }
    if (delay >= 3000) {
      saveGame();
      updateGenerators();
      updateUpgrades();
      delay = 0;
    }
    document.querySelector("#test").innerHTML = "";
  }, 1000 / fps);
}
