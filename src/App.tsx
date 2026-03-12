import React, { useEffect, useState } from "react";
import { default as cn } from "classnames";
import wordsJson from "./assets/momxmom.json";
// import wordsJson from "./assets/10x10test.json";
import "./App.css";
import { cssFromRgb, GROUP_COLORS } from "./colors";

interface WordButtonProps {
  key: number;
  words: string[];
  group: string;
  groupNum: number;
  maxWords: number;
  selected: boolean;
  setSelected: (selected: boolean) => void;
  wrongCounter: number;  
}

const WordButton = ({
  words,
  maxWords,
  group,
  groupNum,
  selected,
  setSelected,
  wrongCounter,
}: WordButtonProps) => {
  const isFinished = words.length >= maxWords;

  let content: React.JSX.Element | undefined = undefined;
  let title: string | undefined = undefined;
  let style: React.CSSProperties = {};
  if (isFinished) {
    content = <>{group}</>;
    style["backgroundColor"] = cssFromRgb(
      GROUP_COLORS[groupNum % GROUP_COLORS.length],
      0.6,
    );
  } else {
    title = words.join("\n");
    // Show up to three words, then truncate.
    const label = words.slice(0, 3).map((word, i) => (
      <div key={word}>
        {word}
        {i == 2 && words.length > 3 && <>...</>}
      </div>
    ));
    const count =
      words.length > 1 ? (
        <span className="count">[{words.length}]</span>
      ) : undefined;
    content = (
      <>
        {label}
        {count}
      </>
    );
  }

  // Handle justAdded animation
  const [addedClass, setAddedClass] = useState("");
  const [wrongClass, setWrongClass] = useState("");

  useEffect(() => {
    if (words.length == 1) {
      return;
    }
    setAddedClass("added" + (words.length % 2 + 1));
    setWrongClass("");
  }, [words.length]);

  useEffect(() => {
    if (wrongCounter == 0) {
      return;
    }
    setAddedClass("");
    setWrongClass("wrong" + (wrongCounter % 2 + 1));
  }, [wrongCounter]);

  const classname = cn({
    selected: selected,
    "font-bold": isFinished,
    "max-h-[50vh] w-full h-full place-self-stretch": true,
    [addedClass]: true,
    [wrongClass]: true,
  });

  return (
    <button
      title={title}
      className={classname}
      disabled={isFinished}
      style={style}
      onClick={() => setSelected(!selected)}
    >
      {content}
    </button>
  );
};

const validateGroupSize = (): number => {
  return wordsJson
    .map((el) => [el.name, el.members.length])
    .reduce((prev, curr) => {
      if (prev !== curr[1]) {
        throw Error(
          `Group ${curr[0]} has ${curr[1]} members, should have ${prev}`,
        );
      }
      return prev;
    }, wordsJson[0].members.length);
};

const initialize = (wordCount: number) => {
  let wordButtons: WordButtonProps[] = [];
  let groupNum = 0;
  let counter = 0;
  for (const group of wordsJson) {
    for (const word of group.members) {
      wordButtons.push({
        key: counter++,
        words: [word],
        group: group.name,
        groupNum: groupNum,
        maxWords: wordCount,
        selected: false,
        setSelected: (_) => {},
        wrongCounter: 0,
      });
    }
    groupNum++;
  }

  wordButtons = wordButtons
    .map((el) => ({ el, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((el) => el.el);

  return wordButtons;
};

const deselectAll = (words: WordButtonProps[]) => {
  for (const el of words) {
    el.selected = false;
  }
};

function App() {
  const groupCount = wordsJson.length;
  const wordsPerGroup = validateGroupSize();

  const [wordState, setWordState] = useState(initialize(wordsPerGroup));

  const numCols = Math.min(groupCount, 8);
  const numRows = Math.max(4, Math.ceil(groupCount * wordsPerGroup / numCols));
  console.log(wordsPerGroup, numCols, numRows);

  const style: React.CSSProperties = {
    gridTemplateColumns: `repeat(${numCols}, 1fr)`,
    gridTemplateRows: `repeat(${numRows}, 1fr)`,
    gap: "0.5rem",
  };

  const setWordSelected = (key: number) => {
    return (selected: boolean) => {
      let wordStateCopy = [...wordState];

      for (const el of wordStateCopy) {
        if (el.key === key) {
          el.selected = selected;
        }
      }

      // Count how many are selected. If >= 2, try to do a match.
      const selectedThings = wordStateCopy.filter((el) => el.selected);
      if (selectedThings.length == 2) {
        const [a, b] = selectedThings;
        if (a.group == b.group) {
          a.words = [...a.words, ...b.words];
          wordStateCopy = wordStateCopy.filter((el) => el.key != b.key);
        } else {
          // Animate the one that was selected last.
          if (a.key === key) {
            a.wrongCounter++;
          } else {
            b.wrongCounter++;
          }
        }
        deselectAll(wordStateCopy);
      } else if (selectedThings.length > 2) {
        // Weird, just deselect all.
        deselectAll(wordStateCopy);
      }

      setWordState(wordStateCopy);
    };
  };

  return (
    <>
      <h1>{`${wordsPerGroup}x${groupCount}`}</h1>
      <div className="grid w-full h-full pb-4" style={style}>
        {wordState.map(({ key, setSelected: _, ...props }) => (
          <WordButton key={key} setSelected={setWordSelected(key)} {...props} />
        ))}
      </div>
    </>
  );
}

export default App;
