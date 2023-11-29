import { UniqueIdentifier, useDraggable } from "@dnd-kit/core";
import { ReactNode } from "react";

export const Addable = ({
  id,
  children,
}: {
  id: UniqueIdentifier;
  children?: ReactNode;
}) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {children}
    </div>
  );
};
