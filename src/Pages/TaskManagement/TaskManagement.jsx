import React, { useEffect, useState } from "react";
import { createTask, getTask, updateTask } from "../../Services/taskService";
import {
  Box,
  Button,
  Typography,
  Container,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { getHistory } from "../../Services/history.service";
import KanbanBoard from "../../Components/Kanban/KanbanBoard";
import HistoryLog from "../../Components/History/HistoryLog";
import { getProjects } from "../../Services/projectService";
import { getUser } from "../../Services/user.service";
import AddTaskManagement from "../../Pages/TaskManagement/AddTaskManagement";
import { ROLES } from "../../Constant/Common";

const TaskManagement = () => {
  const currentUserId = localStorage.getItem("userId");
  const currentUserRole = localStorage.getItem("role");
  const [data, setData] = useState([]);
  const [history, setHistory] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [view, setView] = useState("board"); // board or history
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [queryParam, setQueryParam] = useState({
    search: "",
    page: 1,
    limit: 10,
    sortType: "",
    sort: "",
  });
  const [historyFilter, setHistoryFilter] = useState("Task");

  const GetTaskData = async () => {
    try {
      const queryParams = {
        ...queryParam,
      };
      if (currentUserRole === ROLES[2]) {
        queryParams.currentUser = currentUserId;
      }
      const res = await getTask(queryParams);
      const modifiedData = res.data.map((e) => ({
        ...e,
      }));
      setData(modifiedData);
    } catch (error) {
      console.log(error);
    }
  };

  const GetProjectData = async () => {
    try {
      const res = await getProjects();
      const modifiedData = res?.data.map((e) => ({
        ...e,
      }));
      setProjects(modifiedData);
    } catch (error) {
      console.log(error);
    }
  };

  const GetUserData = async () => {
    try {
      const res = await getUser();
      const modifiedData = res?.data.map((e) => ({
        ...e,
      }));
      setUsers(modifiedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetTaskData();
    GetProjectData();
  }, []);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the task
    const task = data.find((t) => t._id === activeId);
    let newStatus = task.status;

    // Check if dropped on a column
    if (["ToDo", "Inprogress", "QA", "Production"].includes(overId)) {
      newStatus = overId;
    } else {
      // Dropped on another task, find that task's status
      const overTask = data.find((t) => t._id === overId);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    if (task.status !== newStatus) {
      // optimistically update
      setData((prev) =>
        prev.map((t) => (t._id === activeId ? { ...t, status: newStatus } : t))
      );
      try {
        await updateTask(activeId, { status: newStatus }); // Order not fully implemented yet
      } catch (error) {
        console.error("Move failed", error);
        GetTaskData(); // revert
      }
    }
  };

  const handleCreateClick = () => {
    setCurrentTask(null);
    setIsModalOpen(true);
  };

  const handleTaskClick = (task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const fetchHistory = async () => {
    try {
      const historyData = await getHistory({ entityType: historyFilter });
      setHistory(historyData.data || []);
    } catch (error) {
      console.error("Failed to fetch history", error);
    }
  };

  useEffect(() => {
    if (view === "history") {
      fetchHistory();
    }
  }, [view, historyFilter]);

  const handleSaveTask = async (taskData) => {
    try {
      if (currentTask) {
        await updateTask(currentTask._id, taskData);
      } else {
        await createTask(taskData);
      }
      setIsModalOpen(false);
      GetTaskData();
    } catch (error) {
      console.error("Save failed", error);
    }
  };

  return (
    <Box>
      <Box className="mb-2">
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Grid item xs={12} sm={3.5}>
            <Box className="SearchInputBoxContainer">
              <SearchOutlinedIcon className="Search_Icon" />
              <input
                className="SearchInputBox"
                placeholder="Search tasks"
                value={queryParam.search}
                onChange={(e) =>
                  setQueryParam((prev) => ({ ...prev, search: e.target.value }))
                }
              />
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={8}
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Box display="flex" alignItems="center" gap={2}>
              <ToggleButtonGroup
                value={view}
                exclusive
                onChange={(e, newView) => newView && setView(newView)}
                size="small"
              >
                <ToggleButton value="board">Board View</ToggleButton>
                <ToggleButton value="history">Activity Log</ToggleButton>
              </ToggleButtonGroup>
              <Button
                variant="contained"
                className="AddButton"
                onClick={handleCreateClick}
                startIcon={<AddOutlinedIcon />}
              >
                Add Task
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {view === "board" ? (
        <KanbanBoard
          tasks={data}
          onDragEnd={handleDragEnd}
          onTaskClick={handleTaskClick}
        />
      ) : (
        <HistoryLog
          history={history}
          entityType={historyFilter}
          onFilterChange={(e) => setHistoryFilter(e.target.value)}
        />
      )}

      <AddTaskManagement
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={currentTask}
        projects={projects}
        users={users}
      />
    </Box>
  );
};

export default TaskManagement;
