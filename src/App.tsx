import { UniqueIdentifier } from "@dnd-kit/core";
import { Coordinates } from "@dnd-kit/core/dist/types";
import { useState } from "react";
import "./App.css";
import { Canvas } from "./Canvas";

export type Card = {
  id: UniqueIdentifier;
  coordinates: Coordinates;
  text: string;
};

function App() {
  const [cards, setCards] = useState<Card[]>([
    { id: "Red", coordinates: { x: 0, y: 0 }, text: "Red" },
    { id: "world", coordinates: { x: 50, y: 50 }, text: "Badger" },
    { id: "is", coordinates: { x: 100, y: 100 }, text: "is" },
    { id: "great", coordinates: { x: 150, y: 150 }, text: "great" },
  ]);

  return (
    <>
      <h1>Fridge Magnets</h1>

      <Canvas cards={cards} setCards={setCards} />
    </>
  );
}

export default App;
