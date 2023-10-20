import { useDraggable } from "@dnd-kit/core";
import { ReactNode } from "react";
import { Card } from "./App";

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
