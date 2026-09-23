import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Box } from "@mui/material";
import KanbanColumn from "./KanbanColumn";
import TaskCard from "./TaskCard";

const KanbanBoard = ({ tasks, onDragEnd, onTaskClick }) => {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columns = ["ToDo", "Inprogress", "QA", "Production"];

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    onDragEnd(event);
  };

  const getFilteredTasks = (status) => tasks.filter((t) => t.status === status);

  const activeTask = tasks.find(t => t._id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box
        display="flex"
        gap={2}
        overflow="auto"
        pb={2}
        sx={{
          width: "100%",
          height: "calc(100vh - 100px)",
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {columns.map((col) => (
          <KanbanColumn
            key={col}
            id={col}
            title={col}
            tasks={getFilteredTasks(col)}
            onTaskClick={onTaskClick}
          />
        ))}
      </Box>
      <DragOverlay>
        {activeId && activeTask ? (
             <TaskCard task={activeTask} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
