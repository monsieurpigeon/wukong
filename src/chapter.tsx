import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "./components/ui/button";
import { cn } from "./lib/utils";

function synthText(rawText: string) {
  console.log(rawText);
  const text = rawText
    .split("\n")
    .slice(1)
    .map((sentence) => {
      // remove last 2 characters
      console.log(sentence);
      console.log(sentence.replaceAll("||", "|"));
      return sentence.replaceAll("||", "|");
    })
    .join("\n");
  return rawText.split("\n")[0] + "\n" + text;
}

const punctuation = [
  "\n",
  "，",
  "。",
  "“",
  "”",
  "？",
  "！",
  "：",
  "；",
  "、",
  "…",
];

export default function Chapter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialChapter = searchParams.get("chapter");

  const [chapter, setChapter] = useState(
    initialChapter ? Number(initialChapter) : 1
  );
  const [rawText, setRawText] = useState<string>("");
  const [split, setSplit] = useState("");
  const locked = useRef(true);

  useEffect(() => {
    fetch(`/words/${chapter}.txt`)
      .then((r) => r.text())
      .then((rawText) => {
        const text = rawText
          .split("")
          .map((char, index, array) => {
            if (punctuation.includes(char)) {
              if (array[index - 1] === "|" && array[index + 1] === "|") {
                return char;
              } else {
                return `|${char}|`;
              }
            } else {
              return char;
            }
          })
          .join("");
        setRawText(text);
      });
  }, [chapter]);

  useEffect(() => {
    if (!locked.current) {
      const [sentIndex, wordIndex, charIndex] = split.split("-").map(Number);

      setRawText((prev) => {
        const sentences = prev.split("\n");
        const sentence = sentences[sentIndex + 1];
        const words = sentence.split("|");
        const word = words[wordIndex];
        const chars = word.split("");
        if (charIndex !== chars.length - 1) {
          chars[charIndex] = chars[charIndex] + "|";
          words[wordIndex] = chars.join("");
        } else {
          if (
            wordIndex !== words.length - 1 &&
            !punctuation.includes(words[wordIndex + 1][0])
          ) {
            words[wordIndex] = words[wordIndex] + words[wordIndex + 1];
            words.splice(wordIndex + 1, 1);
          }
        }
        sentences[sentIndex + 1] = words.join("|");
        return sentences.join("\n");
      });

      setSplit("");
    }
    locked.current = true;
  }, [split]);

  const voc = useMemo(() => {
    const words = rawText
      .split("|")
      .filter((char) => char !== "" && !punctuation.includes(char[0]));
    const wordList = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    return Object.keys(wordList).sort((a, b) => wordList[b] - wordList[a]);
  }, [rawText]);

  const { title, sentences } = useMemo(() => {
    return {
      title: rawText.split("\n")[0].split("|"),
      sentences: rawText
        .split("\n")
        .slice(1)
        .map((sent) => sent.split("|")),
    };
  }, [rawText]);

  return (
    <div className="w-full bg-sky-200">
      <div className="flex gap-2 items-center px-4 py-2 justify-center">
        <div className="font-bold">西游记</div>
        <Button
          variant="secondary"
          onClick={() => {
            const newChapter = chapter > 1 ? chapter - 1 : 1;
            setSearchParams({ chapter: newChapter.toString() });
            setChapter(newChapter);
          }}
        >
          Previous
        </Button>
        <div>Chapter {chapter}</div>
        <Button
          variant="secondary"
          onClick={() => {
            const newChapter = chapter < 108 ? chapter + 1 : 108;
            setSearchParams({ chapter: newChapter.toString() });
            setChapter(chapter < 108 ? chapter + 1 : 108);
          }}
        >
          Next
        </Button>

        <Button
          onClick={() => {
            navigator.clipboard.writeText(synthText(rawText));
          }}
        >
          Copier
        </Button>
      </div>

      <div className="flex items-start gap-4 w-fit m-auto p-8">
        <div className="bg-background p-8 rounded-lg">
          <div className="max-w-prose whitespace-pre-wrap text-lg">
            <div className="text-lg font-semibold">{title}</div>
            <div className="flex flex-col gap-2">
              {sentences.map((sentence, sentIndex) => (
                <div
                  key={`${chapter}-${sentIndex}`}
                  className="p-4 border rounded shadow flex gap-1 flex-wrap"
                >
                  {sentence.map((word, wordIndex) => {
                    return (
                      <div
                        key={`${chapter}-${sentIndex}-${wordIndex}`}
                        className={cn(
                          "select-none",
                          !punctuation.includes(word[0]) &&
                            "border px-1 rounded",
                          word === "" && "hidden"
                        )}
                      >
                        {word.split("").map((char, charIndex) => {
                          return (
                            <span
                              key={`${chapter}-${sentIndex}-${wordIndex}-${charIndex}`}
                              className="hover:bg-secondary"
                              onClick={() => {
                                locked.current = false;
                                setSplit(
                                  `${sentIndex}-${wordIndex}-${charIndex}`
                                );
                              }}
                            >
                              {char}
                            </span>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-background p-8 rounded-lg">
          <div className="font-bold">Vocabulaire</div>
          <div>
            {voc &&
              voc.map((word) => {
                return <div key={word}>{word}</div>;
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
