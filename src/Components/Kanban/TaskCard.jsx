import React from "react";
import { useNavigate } from "react-router-dom";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Avatar,
} from "@mui/material";

const TaskCard = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id, data: { status: task.status } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    marginBottom: "8px",
    cursor: "grab",
  };

  const priorityColor = {
    High: "error",
    Medium: "warning",
    Low: "success",
  };

  const navigate = useNavigate();

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        onClick={() => navigate(`/task/${task._id}`)}
        sx={{
          "&:hover": { boxShadow: 3 },
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Box {...listeners}>
            <Typography variant="subtitle1" component="div" gutterBottom>
              {task.title}
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Chip
              label={task.priority}
              size="small"
              color={priorityColor[task.priority] || "default"}
            />
            <Typography variant="caption" color="textSecondary">
              {task.token}
            </Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center">
              {task.assignee ? (
                <Avatar sx={{ width: 24, height: 24, fontSize: "10px" }}>
                  {task.assignee.userName
                    ? task.assignee.userName[0].toUpperCase()
                    : "U"}
                </Avatar>
              ) : (
                <Avatar sx={{ width: 24, height: 24, fontSize: "10px" }}>
                  ?
                </Avatar>
              )}
              {task.assignee && (
                <Typography variant="caption" sx={{ ml: 1 }}>
                  {task.assignee.userName}
                </Typography>
              )}
            </Box>
            <Typography variant="caption" color="textSecondary">
              {new Date(task.deadline).toLocaleDateString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskCard;
