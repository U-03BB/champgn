declare module "vue-chessboard";

declare module "pgn-parser" {
  export function parse(s: string): pgnDict[];
}

type PGN = {
  event?: string;
  site?: string;
  date?: string;
  round?: string;
  white?: string;
  black?: string;
  result?: string;
  annotator?: string;
  setup: SetupValues;
  fen: string;
  comments?: GameComment[];
  moves: string;
  label?: string;
};

type PromotionPiece = "q" | "r" | "b" | "n";
type SetupValues = "0" | "1";

type Move = {
  move: string;
  move_number?: string;
  comments?: GameComment[];
  ravs?: Move[];
};

type MoveData = {
  fen: string;
  history: Array<string>;
  turn?: "white" | "black";
  legal_white?: number;
  threat_white?: number;
  checks_white?: number;
  legal_black?: number;
  threat_black?: number;
  checks_black?: number;
};

type GameComment = { text: string };

type PgnDict = {
  headers: [{ name: string; value: string }];
  result: string;
  moves: Move[];
  comments?: GameComment[];
};
