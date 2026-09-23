import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Paper, Typography, Box } from "@mui/material";
import TaskCard from "./TaskCard";

const KanbanColumn = ({ id, tasks, title, onTaskClick }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <Paper
      ref={setNodeRef}
      sx={{
        flex: 1,
        minWidth: 250,
        minHeight: 500,
        backgroundColor: "#f4f5f7",
        p: 2,
        display: "flex",
        flexDirection: "column",
        maxHeight: "100%",
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        {title} ({tasks.length})
      </Typography>
      <Box
        sx={{
          mt: 2,
          flex: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <SortableContext
          id={id}
          items={tasks.map((t) => t._id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onClick={() => {
                console.log("11");
                onTaskClick(task);
              }}
            />
          ))}
        </SortableContext>
      </Box>
    </Paper>
  );
};

export default KanbanColumn;
