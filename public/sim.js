const emojis = [
  ..."🌵🎄🌲🌳🌴🌱🌿☘🍀🎋🍃🍄🐢🐤🐣🦆🐖🍄🌾💐🌷🌹🥀🌺🐪🐶🐱🐭🐹🐰🦅🦀🦇🐸🐉🌞🌈🌻"
];
const rows = {};
let simpsonsScore;
const generateRow = chars => {
  const randomChars = chars.sort(() => 0.5 - Math.random());
  return randomChars
    .slice(0, 8)
    .reduce((string, emoji) => {
      if (Math.random() > 0.6) {
        return string.concat("\u3000");
      }
      return string.concat(emoji);
    }, "")
    .concat("\n");
};
const appendNode = (parentNode, childTag, innerHTML, number) => {
  const node = document.createElement(childTag);
  node.innerHTML = innerHTML;
  node.classList.add("row");
  parentNode.appendChild(node);
  if (rows[number] && rows[number].pinned) {
    node.classList.add("pinned");
  }
  node.addEventListener("click", function onClickRow(e) {
    this.classList.toggle("pinned");
    rows[number].pinned = !rows[number].pinned;
    console.log(rows);
  });
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
      ([top, bottom], [_species, count]) => [
        top + count * (count - 1),
        bottom + count
      ],
      [0, 0]
    )
    .reduce((sumLilN, bigN) => sumLilN / (bigN * (bigN - 1)));
const generateRandom = () => {
  const sim = document.querySelector("div#sim");
  sim.innerHTML = "";
  const arrayofRows = [];
  for (let i = 0; i < 8; i += 1) {
    const row = generateRow(emojis);
    if (rows[i] && rows[i].pinned) {
      appendNode(sim, "P", rows[i].string, i);
      arrayofRows.push(rows[i].string);
      continue;
    }
    arrayofRows.push(row);
    appendNode(sim, "P", row, i);
    rows[i] = { string: row };
  }
  simpsonsScore = simpsonsIndex(arrayofRows);
  document.querySelector("h2").innerText = `SIMPSONS SCORE: ${simpsonsScore}`;
  console.log(rows);
};
const generateFromTextArea = () => {
  const sim = document.querySelector("div#sim");
  sim.innerHTML = "";
  const textArea = document.querySelector("textarea");
  const textAreaRows = textArea.value.split("\n");
  textAreaRows.forEach((taRow, index) => {
    rows[index] = { string: taRow };
    appendNode(sim, "P", taRow, index);
  });

  simpsonsScore = simpsonsIndex(textAreaRows);
  document.querySelector("h2").innerText = `SIMPSONS SCORE: ${simpsonsScore}`;
};
document.addEventListener("DOMContentLoaded", () => {
  console.log("it's loaded baby");
  const generateButton = document.querySelector("button");
  const intro = document.querySelector("div#intro");
  const h2dumb = document.createElement("H2");
  h2dumb.innerText = simpsonsScore ? `SIMPSONS SCORE: ${simpsonsScore}` : "";
  intro.appendChild(h2dumb);
  const textArea = document.querySelector("textarea");
  generateButton.addEventListener("click", () => {
    if (textArea.value) {
      generateFromTextArea();
      return;
    }
    generateRandom();
  });
});
