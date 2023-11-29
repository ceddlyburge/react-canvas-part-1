import {
  ClientRect,
  DndContext,
  DragOverlay,
  Over,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  Coordinates,
  DragEndEvent,
  DragStartEvent,
  Translate,
} from "@dnd-kit/core/dist/types";
import { useState } from "react";
import { Addable } from "./Addable";
import "./App.css";
import { Canvas } from "./Canvas";

export type Card = {
  id: UniqueIdentifier;
  coordinates: Coordinates;
  text: string;
};

const fridgePoetryWords = [
  "walk",
  "time",
  "it",
  "and",
  "very",
  "wish",
  "run",
  "person",
  "that",
  "in",
  "quite",
  "ed",
  "play",
  "year",
  "you",
  "but",
  "to",
  "rather",
  "ing",
  "read",
  "way",
  "he",
  "or",
  "for",
  "the",
  "er",
  "learn",
  "day",
  "they",
  "as",
  "with",
  "more",
  "dog",
  "be",
  "thing",
  "we",
  "if",
  "on",
  "most",
  "cat",
  "have",
  "man",
  "she",
  "when",
  "at",
  "less",
  "mom",
  "do",
  "who",
  "than",
  "from",
  "least",
  "dad",
  "say",
  "life",
  "them",
  "because",
  "by",
  "too",
  "the",
  "get",
  "hand",
  "me",
  "while",
  "about",
  "so",
  "grandma",
  "make",
  "part",
  "him",
  "where",
  "as",
  "just",
  "aunt",
  "go",
  "child",
  "one",
  "after",
  "into",
  "enough",
  "uncle",
  "know",
  "eye",
  "her",
  "so",
  "like",
  "indeed",
  "seem",
  "take",
  "woman",
  "us",
  "though",
  "through",
  "still",
  "feel",
  "see",
  "place",
  "something",
  "since",
  "after",
  "almost",
  "try",
  "come",
  "work",
  "nothing",
  "until",
  "over",
  "fairly",
  "leave",
  "think",
  "week",
  "anything",
  "whether",
  "between",
  "really",
  "call",
  "look",
  "case",
  "himself",
  "before",
  "out",
  "pretty",
  "ride",
  "want",
  "point",
  "everything",
  "although",
  "against",
  "even",
  "love",
  "give",
  "grandpa",
  "someone",
  "nor",
  "during",
  "bit",
  "sort",
  "of",
  "use",
  "number",
  "themselves",
  "like",
  "without",
  "little",
  "a",
  "is",
  "find",
  "group",
  "everyone",
  "once",
  "before",
  "lot",
  "was",
  "tell",
  "problem",
  "itself",
  "unless",
  "under",
  "were",
  "ask",
  "fact",
  "anyone",
  "now",
  "around",
  "school",
  "can",
  "could",
  "would",
  "will",
  "I",
  "food",
  "love",
];

const calculateCanvasPosition = (
  initialRect: ClientRect,
  over: Over,
  delta: Translate
): Coordinates => ({
  x: initialRect.left + delta.x - (over?.rect?.left ?? 0),
  y: initialRect.top + delta.y - (over?.rect?.top ?? 0),
});

function App() {
  const [cards, setCards] = useState<Card[]>([
    { id: "Red", coordinates: { x: 0, y: 0 }, text: "Red" },
    { id: "world", coordinates: { x: 50, y: 50 }, text: "Badger" },
    { id: "is", coordinates: { x: 100, y: 100 }, text: "is" },
    { id: "great", coordinates: { x: 150, y: 150 }, text: "great" },
  ]);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id);
  };

  const handleDragEnd = ({ over, active, delta }: DragEndEvent) => {
    setActiveId(null);

    if (over?.id !== "canvas") return;
    if (!active.rect.current.initial) return;

    setCards([
      ...cards,
      {
        id: active.id,
        coordinates: calculateCanvasPosition(
          active.rect.current.initial,
          over,
          delta
        ),
        text: active.id.toString(),
      },
    ]);
  };

  return (
    <DndContext
      onDragStart={handleDragStart} // store the active card in state
      onDragEnd={handleDragEnd} // add the active card to the canvas
    >
      <div className="tray">
        {fridgePoetryWords.map((word) => {
          if (cards.find((card) => card.id === word)) return null;

          return (
            <Addable id={word}>
              <div className="trayCard">{word}</div>
            </Addable>
          );
        })}
      </div>

      <Canvas cards={cards} setCards={setCards} />
      <DragOverlay>
        <div className="trayOverlayCard">{activeId}</div>
      </DragOverlay>
    </DndContext>
  );
}

export default App;
