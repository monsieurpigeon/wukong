import { readFile, writeFile } from "node:fs";
const remove = [
  "\n",
  "。",
  "“",
  "”",
  "，",
  "！",
  "？",
  "?",
  "：",
  ".",
  "#",
  '"',
  "《",
  "》",
  "、",
  "；",
  "（",
  "）",
  "…",
  "*",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];
function getFrequency() {
  readFile("public/full.txt", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const chars = data.split("");

    const result = chars.reduce((acc, char) => {
      if (remove.includes(char)) {
        return acc;
      }
      if (!acc[char]) {
        acc[char] = 0;
      }
      acc[char]++;
      return acc;
    }, {});

    const list = Object.entries(result).sort((a, b) => b[1] - a[1]);
    console.log(list);

    const csv = list.map((item) => item.join(",")).join("\n");

    writeFile("public/stats.csv", csv, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("done");
    });
  });
}

function splitChapters() {
  readFile("public/full.txt", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const chapters = data.split("#");

    chapters.forEach((chapter, index) => {
      writeFile(`public/words/${index}.txt`, chapter, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(`chapter-${index} done`);
      });
    });
  });
}

getFrequency();
