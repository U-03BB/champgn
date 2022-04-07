export const defaultStartingFen =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Flattens and transforms PGN data */
export const parseGame = (pgnInput: PgnDict): PGN => {
  const pgnOutput: PGN = {
    setup: "0",
    fen: defaultStartingFen,
    moves: []
  };

  const pgnKeys: Array<keyof PGN> = [
    "event",
    "site",
    "date",
    "round",
    "white",
    "black",
    "result",
    "annotator",
    "setup",
    "fen",
    "comments",
    "moves",
    "label"
  ];

  // Turn header tuples into dictionary
  const pgnInputHeaderDict: { [key: string]: string } = {};
  pgnInput.headers.forEach(h => {
    pgnInputHeaderDict[h.name.toLowerCase()] = h.value;
  });

  function setProp<K extends keyof PGN>(key: K, value: PGN[K]) {
    pgnOutput[key] = value;
  }

  pgnKeys.forEach(k => {
    if (pgnInputHeaderDict[k]) {
      setProp(k, pgnInputHeaderDict[k]);
    }
  });

  pgnOutput.moves = pgnInput.moves;

  // Reduce Game comments to a single string
  // Comments for moves are handled individually.
  pgnOutput.comments = pgnInput.comments
    ?.map(c => {
      return c.text;
    })
    .reduce((a, b) => {
      return a + " " + b;
    });

  if (pgnOutput.date) {
    const [year, month, day] = pgnOutput.date.split(".");
    if (year && year === "????") pgnOutput.date = "";
    else if (month && month === "??") pgnOutput.date = year;
    else if (day && day === "??") pgnOutput.date = `${year}.${month}`;
  }

  pgnOutput.label =
    (pgnOutput.event && pgnOutput.event !== "?" ? pgnOutput.event : "") +
    (pgnOutput.event &&
    pgnOutput.event !== "?" &&
    pgnOutput.white &&
    pgnOutput.white !== "?"
      ? " : "
      : "") +
    (pgnOutput.white && pgnOutput.white !== "?" ? pgnOutput.white : "") +
    (pgnOutput.black && pgnOutput.black !== "?" ? " - " + pgnOutput.black : "");

  return pgnOutput;
};
