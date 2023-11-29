Using DndKit, part 1 is to have some cards within a canvas and to drag them around

- 1.1 Show some cards on a canvas
- 1.2 Hook up DndKit
- 1.3 Save dragged position

npm create vite@latest jeans-miro-part-1 -- --template react-ts

npm install

npm install @dnd-kit/core
(maybe show DndKit homepage)

?update index.html, remove icon and update title

delete contents of app.css

delete contents of index.css

App.tsx

```
export type Card = {
  id: UniqueIdentifier;
  coordinates: Coordinates;
  text: string;
};


function App() {
  const [cards, setCards] = useState<Card[]>([
    { id: "Red", coordinates: { x: 0, y: 0 }, text: "Red" },
    { id: "Badger", coordinates: { x: 50, y: 50 }, text: "Badger" },
    { id: "is", coordinates: { x: 100, y: 100 }, text: "is" },
    { id: "great", coordinates: { x: 150, y: 150 }, text: "great" },
  ]);

  return (
      <Canvas cards={cards} />
  );
}
```

Canvas.tsx (just show cards at a position)

```
export const Canvas = ({
  cards,
}: {
  cards: Card[];
}) => {

  return (
    <div
      className="canvas"
      style={{
        height: "300px",
        position: "relative",
      }}
    >
        {cards.map((card) => (
          <div
            className="card"
            style={{
                position: "absolute",
                top: `${card.coordinates.y}px`,
                left: `${card.coordinates.x}px`,
            }}
            >
            {card.text}
          </div>
        ))}
    </div>
  );
};
```

App.css

```
.card {
    box-sizing: content-box;
    padding: 10px;
    border-radius: 3px;
    border-color:chocolate;
    border-width: 1px;
    border-style: solid;
    background-color:bisque;
    color:black;
    cursor: grab
  }

  .canvas {
    overflow: hidden;
    border-radius: 3px;
    border-color:chocolate;
    border-width: 1px;
    border-style: solid;
    background-color:snow;
  }
```

Run it now, should see the cards on the canvas at their assigned positions

Modify Canvas.tsx to use draggable etc

- Add DndContext, use Draggable component

```
     <DndContext>
        {cards.map((card) => (
          <Draggable
            id={card.id.toString()}
            coordinates={card.coordinates}
            key={card.id}
          >
            {card.text}
          </Draggable>
        ))}
      </DndContext>
```

Add Draggable (copy div from canvas, but modify as below)

```
export const Draggable = ({
  card,
  children,
}: {
  card: Card;
  children?: ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
  });

  return (
    <div
      className="card"
      style={{
        position: "absolute",
        top: `${card.coordinates.y}px`,
        left: `${card.coordinates.x}px`,
        // temporary change to this position when dragging
        ...(transform
          ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0px)`,
            }
          : {}),
      }}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
};
```

Doesn't update when we finish the drag though, so add handleDragEnd to Canvas (and DndContext).
Set in DndContext first and then hopefully we can generate the function
Add setCards to Canvas and pass in from App
Should work now

```
  const saveDragEndPosition = ({ delta, active }: DragEndEvent) => {
    if (!delta.x && !delta.y) return;

    setCards(
      cards.map((card) => {
        if (card.id === active.id) {
          return {
            ...card,
            coordinates: {
              x: card.coordinates.x + delta.x,
              y: card.coordinates.y + delta.y,
            },
          };
        }
        return card;
      })
    );
  };
```

## Part 2, add drop from tray

yarn run dev, see where we got to last time

going to add a tray now, and drg stuff from tray and drop on canvas

Roughly, what we have to do is:

- Create an Addable component that hooks in to DndKit and allows things to be drag / dropped. Its simpler than the draggable component we made in part 1, as it doesn't need to position itself.
- Create a tray component with some Addables we want to add to the canvas
- Create another DndContext, for the purpose of drag dropping to the canvas, instead of dragging around the canvas. This is ok as DndContexts can be nested, just liek normal react Contexts
- Use a DragOverlay component, for DndKit to show while a thing is being dragged. This is optional but usually easier (we didn't do it in part one, because the component doesn't get dropped to another place, it just moves within the place). This is why the Addable component is simpler than the Draggable one.
- Add some state for the item being dragged
- Create a dragStart handler to set this state
- Create a dragEnd handler to update the cards state when dropping to the canvas. This also requires us to work out the position on the canvas that we need to drop to.

Create Addable.tsx

Add fridgePoetryWords to App.tsx

Add DndContext for Tray to canvas dragging
<DndContext
onDragStart={handleDragStart} // store the active card in state
onDragEnd={handleDragEnd} // add the active card to the canvas >

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

<existing canvas component>

      <DragOverlay>
        <div className="trayOverlayCard">
          {activeId}
        </div>
      </DragOverlay>
    </DndContext>

Add state for tray item being dragged
const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

Add handleDragStart
const handleDragStart = ({ active }: DragStartEvent) => {
setActiveId(active.id);
};

Add handleDragEnd
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
          delta,
        ),
        text: active.id.toString(),
      },
    ]);

};
