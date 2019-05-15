const button = document.querySelector("button");
const sim = document.querySelector("#sim");
const intro = document.querySelector("#intro");
const textarea = document.querySelector("textarea");
const content = document.querySelector("#content");
const pushtray = document.querySelector(".overlay");

const forestEmojis = [
  "🐊",
  "🌲",
  "🌱",
  "☘️",
  "🌷",
  "🐢",
  "🐀",
  "🌴",
  "🌳",
  "🌿",
  "🌹",
  "🌻",
  "🌺",
  "🌾",
  "🐢",
  "🐺",
  "🐇",
  "🕊",
  "🐰",
  "🦊",
  "🐻",
  "🦇",
  "🦉",
  "🦅",
  "🐝",
  "🍄",
  "🍂"
];

let OJSimpson;
let forestRows = Array(64).fill("&nbsp");
let firstRound = true;
let allRows = {};

const generateHTML = (element, inner, classes) => {
  const newEl = document.createElement(element);
  newEl.innerHTML = inner;
  newEl.classList.add(classes);
  return newEl;
};

const simpsonIndex = generateHTML("div", ``, "simpsonIndex");
const container = generateHTML("div", "", "forestContainer");
const resetButton = generateHTML("button", "reset", "resetButton");

sim.appendChild(simpsonIndex);

const reset = () => {
  OJSimpson = undefined;
  firstRound = true;
  forestRows = Array(64).fill("&nbsp");
  allRows = { row: "", pinned: false };

  simpsonIndex.innerHTML = "";
  container.innerHTML = "";
  sim.removeChild(resetButton);

  intro.classList.remove("hidden");
  intro.appendChild(button);
  sim.classList.add("hidden");
};

const warning = generateHTML("div", "be careful..fuck. it's below", "warn");
const warn = document.querySelector(".warn");
pushtray.appendChild(warning);
warning.classList.add("hidden");

const checkOJ = () => {
  if (OJSimpson < 0.7) {
    warning.classList.remove("hidden");
  }
  if (OJSimpson > 0.7) {
    warning.classList.add("hidden");
  }
};

const simpsonsIndex = forest =>
  1 -
  Object.entries(
    [...forest.join("")].reduce(
      (counts, emoji) => ({ ...counts, [emoji]: (counts[emoji] || 0) + 1 }),
      {}
    )
  )
    .reduce(
      ([top, bottom], [species, count]) => [
        top + count * (count - 1),
        bottom + count
      ],
      [0, 0]
    )
    .reduce((sumLilN, bigN) => sumLilN / (bigN * (bigN - 1)))
    .toFixed(2);

const getRandomForestArray = () => {
  const randomNumberOfEmojis = Math.floor(Math.random() * 64);

  for (let i = 0; i < randomNumberOfEmojis; i++) {
    const randomEmoji = Math.floor(Math.random() * forestEmojis.length);
    const randomIndex = Math.floor(Math.random() * forestRows.length);
    forestRows.splice(randomIndex, 1, forestEmojis[randomEmoji]);
  }
  return forestRows;
};

const generateForest = (values, pinIndex) => {
  let newVals = values;

  forestRows = Array(64).fill("&nbsp");
  if (!values || pinIndex) {
    newVals = getRandomForestArray();
  }
  const valArr = [...newVals];

  valArr.forEach((el, i) => {
    if (i < 64) forestRows.splice(i, 1, el);
  });

  forestRows = forestRows.reduce(
    (acc, _, ind) =>
      ind % 8 === 0
        ? acc.concat(forestRows.slice(ind, ind + 8).join(" "))
        : acc,
    []
  );

  forestRows.forEach((_, i) => {
    if (allRows[i] && allRows[i].pinned) {
      forestRows[i] = allRows[i].row;
    }
  });
  return forestRows;
};

const appendRows = (contain, rows) => {
  rows.forEach(row => {
    if (typeof row === "object") {
      contain.appendChild(row);
    } else contain.appendChild(generateHTML("div", row, "forestRow"));
  });

  const forestRow = contain.querySelectorAll(".forestRow");

  forestRow.forEach((row, i) => {
    if (!row.classList.contains("pinned"))
      row.addEventListener("click", () => {
        allRows[i] = { row, pinned: allRows[i] ? !allRows[i].pinned : true };
        row.classList.toggle("pinned");
      });
  });
};

const setState = () => {
  sim.classList.remove("hidden");
  intro.classList.add("hidden");

  sim.appendChild(container);
  sim.appendChild(button);

  if (firstRound) {
    forestRows = generateForest(textarea.value);
    appendRows(container, forestRows);

    OJSimpson = simpsonsIndex(forestRows);
    checkOJ();

    simpsonIndex.innerHTML = `the current Simpsons Index is: ${OJSimpson}`;

    firstRound = false;
  } else {
    const pinnedValues = document.querySelectorAll(".pinned");
    container.innerHTML = "";

    forestRows = generateForest(pinnedValues, allRows);
    appendRows(container, forestRows);

    OJSimpson = simpsonsIndex(forestRows);
    checkOJ();

    simpsonIndex.innerHTML = `the current Simpsons Index is: ${OJSimpson}`;

    sim.appendChild(resetButton);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  button.addEventListener("click", () => setState());
  resetButton.addEventListener("click", () => reset());
});
