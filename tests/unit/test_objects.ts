/* istanbul ignore file */

// Mocking properties that are defined upstream
/* eslint-disable @typescript-eslint/camelcase */
export const mockPgnText = `[Event "White Mates in One Move"]
[Site "London"]
[Date "1623.??.??"]
[Round "?"]
[White "Gioachino Greco"]
[Black "?"]
[Result "1-0"]
[WhiteELO "?"]
[BlackELO "?"]
[Setup "1"]
[FEN "rn1qkb1r/p1ppp2P/1p6/7n/3P4/3B4/PPP2PbP/RNB1K1NR w KQkq - 0 7"]

1. e4 b6 2. d4 Bb7 3. Bd3 f5 4. exf5 Bxg2 5. Qh5+ g6 6. fxg6 Nf6 7. gxh7+
Nxh5 8. Bg6# 1-0

[Event "?"]
[Site "?"]
[Date "????.??.??"]
[Round "?"]
[White "?"]
[Black "?"]
[Result "1-0"]
[WhiteELO "?"]
[BlackELO "?"]
[Setup "1"]
[FEN "rb2r2k/pp4pp/8/1q2N3/5nP1/1Q6/PPB1PP2/R3K2R w KQkq - 0 1"]

1. Nf7+ Kg8 2. Nh6+ Kh8 3. Qg8+ Rxg8 4. Nf7# 1-0

[Event "No Annotation Test"]
[Site "?"]
[Date "????.??.??"]
[Round "?"]
[White "?"]
[Black "?"]
[Result "1-0"]
[WhiteELO "?"]
[BlackELO "?"]
[Setup "1"]
[FEN "rb2r2k/pp4pp/8/1q2N3/5nP1/1Q6/PPB1PP2/R3K2R w KQkq - 0 1"]

*

[Event "NP vs. RBP"]
[Site "?"]
[Date "2013.??.??"]
[Round "?"]
[White "Chepishny"]
[Black "Helpmate in 2 moves"]
[Result "1-0"]
[Annotator "Wall,Bill"]
[SetUp "1"]
[FEN "8/8/Pr6/Np6/k7/b1K5/8/8 b - - 0 1"]
[PlyCount "4"]
[EventDate "2013.??.??"]

1... Rxa6 (1... Kxa5 2. a7 Ka6 3. a8=Q#) 2. Nc4 Ra5 3. Nb6# 1-0
`;

export const mockMoveListWhiteStarts: Array<Move> = [
  { move: "Nf3", comments: [], move_number: "1", nags: ["$2"] },
  { move: "d5", comments: [], move_number: "1", nags: ["$2"] }
];
export const mockMoveListBlackStarts: Array<Move> = [
  { move: "c3", comments: [], move_number: "1", nags: ["$2"] },
  { move: "Nf3", comments: [], move_number: "2", nags: ["$2"] }
];

export const mockNags = ["$1", "$11", "$111"];
export const mockNagsOutput = [
  "(!)",
  "(equal chances, quiet position)",
  "(Black has played the opening well)"
];
