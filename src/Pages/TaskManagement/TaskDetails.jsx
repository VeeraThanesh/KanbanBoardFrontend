import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToast } from "../../Redux/Reducer/ToastReducer";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  Paper,
  CircularProgress,
  Avatar,
  Chip,
  IconButton,
  Breadcrumbs,
  Link,
  Tooltip,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import FlagIcon from "@mui/icons-material/Flag";
import InfoIcon from "@mui/icons-material/Info";
import HistoryIcon from "@mui/icons-material/History";

import { getTaskById, updateTask, getTask } from "../../Services/taskService";
import { getUser } from "../../Services/user.service";
import { getHistory } from "../../Services/history.service";
import HistoryLog from "../../Components/History/HistoryLog";
import styles from "./TaskDetails.module.scss";
import DescriptionBox from "../../Components/DescriptionBox/DescriptionBox";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState([]);

  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [showSidebar, setShowSidebar] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "",
    status: "",
    issueType: "",
    estimation: "",
    hold: false,
    actualDeadline: null,
  });

  const [openWorkLog, setOpenWorkLog] = useState(false);
  const [workLogData, setWorkLogData] = useState({
    date: new Date().toISOString().split("T")[0],
    startTime: "",
    endTime: "",
    description: "",
  });
  const [editingLogIndex, setEditingLogIndex] = useState(-1);
  const [openBugDialog, setOpenBugDialog] = useState(false);
  const [bugData, setBugData] = useState({
    description: "",
    assignee: "",
  });
  const [editingBugId, setEditingBugId] = useState(null);

  useEffect(() => {
    fetchTaskDetails();
    fetchUsers();
  }, [id]);

  useEffect(() => {
    if (showHistory) {
      fetchTaskHistory();
    }
  }, [showHistory]);


  const fetchTaskHistory = async () => {
    try {
      setHistoryLoading(true);
      const historyData = await getHistory({ entityId: id });
      setHistory(historyData.data || []);
    } catch (error) {
      console.log("Failed to fetch history", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const response = await getTaskById(id);
      if (response && !response.error) {
        const taskData = response.data;
        setTask(taskData);
        setFormData({
          title: taskData.title || "",
          description: taskData.description || "",
          assignee: taskData.assignee?._id || "",
          priority: taskData.priority || "Medium",
          status: taskData.status || "ToDo",
          issueType: taskData.issueType || "Task",
          estimation: taskData.estimation || "",
          hold: taskData.hold || false,
          actualDeadline: taskData.actualDeadline
            ? taskData.actualDeadline.split("T")[0]
            : "",
        });
      }
    } catch (error) {
      console.error("Error fetching task:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUser();
      if (response && !response.data.error) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData };
      const response = await updateTask(id, payload);
      if (response && !response.data.error) {
        setIsEditing(false);
        fetchTaskDetails();
        if (showHistory) {
          fetchTaskHistory();
        }
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleAddWorkLog = async () => {
    try {
      if (!workLogData.startTime || !workLogData.endTime) {
        dispatch(
          setToast({
            message: "Please enter start and end time",
            type: "error",
          }),
        );
        return;
      }

      // Check for overlapping work logs (excluding the one being edited)
      const isOverlapping = task.workLogs?.some((log, index) => {
        if (index === editingLogIndex) return false;

        // Handle different date formats (ISO string vs YYYY-MM-DD)
        const logDateStr =
          typeof log.date === "string"
            ? log.date.split("T")[0]
            : new Date(log.date).toISOString().split("T")[0];
        if (logDateStr !== workLogData.date) return false;

        const newStart = workLogData.startTime;
        const newEnd = workLogData.endTime;
        const existStart = log.startTime;
        const existEnd = log.endTime;

        return newStart < existEnd && newEnd > existStart;
      });

      if (isOverlapping) {
        dispatch(
          setToast({
            message: "A work log already exists for this time range",
            type: "error",
          }),
        );
        return;
      }

      const duration = calculateDuration(
        workLogData.startTime,
        workLogData.endTime,
      );

      let updatedWorkLogs = [...(task.workLogs || [])];

      if (editingLogIndex >= 0) {
        // preserve original log metadata while updating fields
        const originalLog = task.workLogs[editingLogIndex];
        updatedWorkLogs[editingLogIndex] = {
          ...originalLog,
          ...workLogData,
          assignee: originalLog.assignee?._id || originalLog.assignee, // keep original assignee ID
          duration,
        };
      } else {
        updatedWorkLogs.push({
          ...workLogData,
          assignee: task.assignee?._id, // Default to current task assignee
          duration,
        });
      }

      const response = await updateTask(id, {
        workLogs: updatedWorkLogs.map((log) => ({
          ...log,
          assignee: log.assignee?._id || log.assignee,
        })),
      });

      if (response && !response.data.error) {
        handleCloseWorkLogDialog();
        fetchTaskDetails();
        dispatch(
          setToast({
            message:
              editingLogIndex >= 0
                ? "Work log updated successfully"
                : "Work log added successfully",
            type: "success",
          }),
        );
      } else {
        dispatch(
          setToast({
            message: response?.data?.message || "Failed to save work log",
            type: "error",
          }),
        );
      }
    } catch (error) {
      console.error("Error adding/updating work log:", error);
      dispatch(
        setToast({ message: "An unexpected error occurred", type: "error" }),
      );
    }
  };

  const handleOpenAddWorkLog = () => {
    setWorkLogData({
      date: new Date().toISOString().split("T")[0],
      startTime: "",
      endTime: "",
      description: "",
    });
    setEditingLogIndex(-1);
    setOpenWorkLog(true);
  };

  const handleEditWorkLog = (index) => {
    const log = task.workLogs[index];
    const logDateStr =
      typeof log.date === "string"
        ? log.date.split("T")[0]
        : new Date(log.date).toISOString().split("T")[0];

    setWorkLogData({
      date: logDateStr,
      startTime: log.startTime,
      endTime: log.endTime,
      description: log.description || "",
    });
    setEditingLogIndex(index);
    setOpenWorkLog(true);
  };

  const handleDeleteWorkLog = async (index) => {
    if (!window.confirm("Are you sure you want to delete this work log?"))
      return;

    try {
      const updatedWorkLogs = task.workLogs
        .filter((_, i) => i !== index)
        .map((log) => ({
          ...log,
          assignee: log.assignee?._id || log.assignee,
        }));

      const response = await updateTask(id, { workLogs: updatedWorkLogs });
      if (response && !response.data.error) {
        fetchTaskDetails();
        dispatch(
          setToast({
            message: "Work log deleted successfully",
            type: "success",
          }),
        );
      } else {
        dispatch(
          setToast({ message: "Failed to delete work log", type: "error" }),
        );
      }
    } catch (error) {
      console.error("Error deleting work log:", error);
      dispatch(
        setToast({
          message: "An error occurred during deletion",
          type: "error",
        }),
      );
    }
  };

  const handleCloseWorkLogDialog = () => {
    setOpenWorkLog(false);
    setEditingLogIndex(-1);
    setWorkLogData({
      date: new Date().toISOString().split("T")[0],
      startTime: "",
      endTime: "",
      description: "",
    });
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return "0h 0m";
    const [sH, sM] = start.split(":").map(Number);
    const [eH, eM] = end.split(":").map(Number);
    let totalMinutes = eH * 60 + eM - (sH * 60 + sM);
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m`;
  };

  const handleOpenAddBug = () => {
    setBugData({
      description: "",
      assignee: task.assignee?._id || "",
    });
    setEditingBugId(-1); // Use index instead of ID for embedded array
    setOpenBugDialog(true);
  };

  const handleOpenEditBug = (index) => {
    const bug = task.bugs[index];
    setBugData({
      description: bug.description || "",
      assignee: bug.assignee?._id || bug.assignee || "",
    });
    setEditingBugId(index);
    setOpenBugDialog(true);
  };

  const handleCloseBugDialog = () => {
    setOpenBugDialog(false);
    setEditingBugId(null);
  };

  const handleSaveBug = async () => {
    try {
      if (!bugData.description) {
        dispatch(setToast({ message: "Please enter a description", type: "error" }));
        return;
      }

      let updatedBugs = [...(task.bugs || [])];
      
      if (editingBugId >= 0) {
        // Update existing bug in array
        updatedBugs[editingBugId] = {
          ...updatedBugs[editingBugId],
          ...bugData,
        };
      } else {
        // Add new bug to array
        updatedBugs.push({
          ...bugData,
          date: new Date(),
        });
      }

      const response = await updateTask(id, {
        bugs: updatedBugs.map(bug => ({
          ...bug,
          assignee: bug.assignee?._id || bug.assignee
        }))
      });

      if (response && !response.data.error) {
        handleCloseBugDialog();
        fetchTaskDetails(); // Refresh task to get updated bugs array
        dispatch(
          setToast({
            message: editingBugId >= 0
              ? "Bug updated successfully"
              : "Bug added successfully",
            type: "success",
          }),
        );
      } else {
        dispatch(
          setToast({
            message: response?.data?.message || "Failed to save bug",
            type: "error",
          }),
        );
      }
    } catch (error) {
      console.error("Error saving bug:", error);
      dispatch(
        setToast({ message: "An unexpected error occurred", type: "error" }),
      );
    }
  };

  const handleDeleteBug = async (index) => {
    if (!window.confirm("Are you sure you want to delete this bug?")) return;

    try {
      const updatedBugs = task.bugs.filter((_, i) => i !== index);
      const response = await updateTask(id, {
        bugs: updatedBugs.map(bug => ({
          ...bug,
          assignee: bug.assignee?._id || bug.assignee
        }))
      });
      
      if (response && !response.data.error) {
        fetchTaskDetails();
        dispatch(
          setToast({ message: "Bug deleted successfully", type: "success" }),
        );
      } else {
        dispatch(setToast({ message: "Failed to delete bug", type: "error" }));
      }
    } catch (error) {
      console.error("Error deleting bug:", error);
      dispatch(
        setToast({ message: "An unexpected error occurred", type: "error" }),
      );
    }
  };

  if (loading) {
    return (
      <Box
        className={styles.container}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress thickness={4} size={50} />
      </Box>
    );
  }

  if (!task) {
    return (
      <Box className={styles.container}>
        <Typography variant="h5">Task not found</Typography>
      </Box>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "error";
      case "Medium":
        return "warning";
      case "Low":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Box className={styles.container}>
      <Paper className={styles.mainPaper} elevation={0}>
        <Box className={styles.header}>
          <Box className={styles.topNav}>
            <Checkbox checked color="primary" size="small" />
            <Typography variant="subtitle1" fontWeight="600" color="#42526e">
              Task Details
            </Typography>
          </Box>
          <Box className={styles.headerActions}>
            <IconButton onClick={() => setShowSidebar(!showSidebar)}>
              <InfoIcon sx={{ color: showSidebar ? "#0052cc" : "#5e6c84" }} />
            </IconButton>
            <IconButton onClick={() => navigate(-1)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Box
          className={`${styles.contentWrapper} ${showSidebar ? styles.withSidebar : ""}`}
        >
          <Box className={styles.mainContent}>
            <Box className={styles.taskTitleSection}>
              {isEditing ? (
                <TextField
                  name="title"
                  fullWidth
                  value={formData.title}
                  onChange={handleInputChange}
                  variant="standard"
                  sx={{
                    mb: 2,
                    "& .MuiInput-root": { fontSize: "1.5rem", fontWeight: 700 },
                  }}
                />
              ) : (
                <Typography variant="h5" className={styles.titleText}>
                  {task.title}
                </Typography>
              )}
            </Box>

            <Box className={styles.section}>
              <Typography variant="subtitle2" className={styles.sectionLabel}>
                Description
              </Typography>
              <DescriptionBox
                initialDescription={formData?.description || ""}
                onSave={handleInputChange}
                forceEdit={isEditing}
              />
            </Box>

            <Box className={styles.section}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="subtitle2" className={styles.sectionLabel}>
                  Work Logs
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                className={styles.addWorkLogBtn}
                startIcon={<span>+</span>}
                onClick={handleOpenAddWorkLog}
              >
                Add Work Log
              </Button>
              <TableContainer
                sx={{ mt: 2, border: "1px solid #dfe1e6", borderRadius: "4px" }}
              >
                <Table size="small">
                  <TableHead sx={{ bgcolor: "#fafbfc" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Assignee</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Start Time</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>End Time</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {task.workLogs && task.workLogs.length > 0 ? (
                      task.workLogs.map((log, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Avatar
                                sx={{ width: 24, height: 24, fontSize: 10 }}
                              >
                                {log.assignee?.userName?.[0]?.toUpperCase()}
                              </Avatar>
                              {log.assignee?.userName}
                            </Box>
                          </TableCell>
                          <TableCell>
                            {new Date(log.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{log.startTime}</TableCell>
                          <TableCell>{log.endTime}</TableCell>
                          <TableCell>{log.duration}</TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditWorkLog(index)}
                            >
                              <EditIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteWorkLog(index)}
                            >
                              <CloseIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          align="center"
                          sx={{ color: "#5e6c84", py: 3 }}
                        >
                          No work logs yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box className={styles.section}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="subtitle2" className={styles.sectionLabel}>
                  Attachments
                </Typography>
                <IconButton size="small">
                  <span style={{ fontSize: "1.2rem" }}>+</span>
                </IconButton>
              </Box>
              <Typography variant="body2" color="#5e6c84">
                No Files
              </Typography>
            </Box>

            <Box className={styles.section}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="subtitle2" className={styles.sectionLabel}>
                  Related Bugs ({(task.bugs || []).length})
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  className={styles.addBugBtn}
                  startIcon={<span>+</span>}
                  onClick={handleOpenAddBug}
                >
                  Add Bug
                </Button>
              </Box>
                <TableContainer
                  sx={{
                    mt: 2,
                    border: "1px solid #dfe1e6",
                    borderRadius: "4px",
                  }}
                >
                  <Table size="small">
                    <TableHead sx={{ bgcolor: "#fafbfc" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, width: "15%" }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 600, width: "20%" }}>Assignee</TableCell>
                        <TableCell sx={{ fontWeight: 600, width: "50%" }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 600, width: "15%" }} align="right">
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {task.bugs && task.bugs.length > 0 ? (
                        task.bugs.map((bug, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ verticalAlign: "top" }}>
                              <Typography variant="body2" color="#5e6c84">
                                {new Date(bug.date || bug.createdAt).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ verticalAlign: "top" }}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Avatar sx={{ width: 20, height: 20, fontSize: 10 }}>
                                  {bug.assignee?.userName?.[0]?.toUpperCase() || "U"}
                                </Avatar>
                                <Typography variant="body2">
                                  {bug.assignee?.userName || "Unassigned"}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ verticalAlign: "top" }}>
                              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                                {bug.description}
                              </Typography>
                            </TableCell>
                            <TableCell align="right" sx={{ verticalAlign: "top" }}>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleOpenEditBug(index)}
                              >
                                <EditIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteBug(index)}
                              >
                                <CloseIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 3, color: "#a5adba", fontStyle: "italic" }}>
                            No bugs reported for this task
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

            <Box mt={4} display="flex" gap={2}>
              {!isEditing ? (
                <Button variant="contained" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </>
              )}
              <Button
                variant="outlined"
                startIcon={<HistoryIcon />}
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? "Hide Activity Log" : "Show Activity Log"}
              </Button>
            </Box>

            {showHistory && (
              <Box className={styles.historySection}>
                <HistoryLog
                  history={history}
                  showFilter={false}
                  loading={historyLoading}
                />
              </Box>
            )}
          </Box>

          {showSidebar && (
            <Box className={styles.sidebar}>
              <Typography
                variant="h6"
                sx={{ color: "#172b4d", fontWeight: 700, mb: 2 }}
              >
                Details
              </Typography>
              <Box sx={{ borderBottom: "1px solid #dfe1e6", mb: 3 }} />

              <Box className={styles.sidebarSection}>
                <Typography className={styles.label}>Project Name</Typography>
                <Box className={styles.valueContainer}>
                  {task.project?.name || "N/A"}
                </Box>
              </Box>

              <Box className={styles.sidebarSection}>
                <Typography className={styles.label}>Task No</Typography>
                <Box className={styles.valueContainer}>{task.token}</Box>
              </Box>

              <Box className={styles.sidebarSection}>
                <Typography className={styles.label}>Assignee</Typography>
                <Box className={styles.valueContainer}>
                  <FormControl fullWidth size="small">
                    <Select
                      name="assignee"
                      value={formData.assignee}
                      onChange={handleInputChange}
                      displayEmpty
                    >
                      <MenuItem value="">Unassigned</MenuItem>
                      {users.map((user) => (
                        <MenuItem key={user._id} value={user._id}>
                          {user.userName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <Box className={styles.sidebarSection}>
                <Typography className={styles.label}>Parent Task</Typography>
                <Box className={styles.valueContainer}>
                  {task.parentTask
                    ? `${task.parentTask.token} - ${task.parentTask.title}`
                    : "None"}
                </Box>
              </Box>

              <Box className={styles.sidebarSection}>
                <Typography className={styles.label}>
                  Actual Deadline
                </Typography>
                <Box className={styles.valueContainer}>
                  <TextField
                    type="date"
                    name="actualDeadline"
                    value={formData.actualDeadline || ""}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              </Box>

              <Box className={styles.sidebarSection}>
                <Typography className={styles.label}>Estimated time</Typography>
                <Box className={styles.valueContainer}>
                  <TextField
                    name="estimation"
                    placeholder="Enter Hour"
                    value={formData.estimation}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                  />
                </Box>
              </Box>

              <Box className={styles.sidebarSection}>
                <Typography className={styles.label}>Hold</Typography>
                <Box className={styles.valueContainer}>
                  <Switch
                    name="hold"
                    checked={formData.hold}
                    onChange={handleInputChange}
                    size="small"
                  />
                </Box>
              </Box>

              <Box className={styles.sidebarSection}>
                <Typography className={styles.label}>Status</Typography>
                <Box className={styles.valueContainer}>
                  <FormControl fullWidth size="small">
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <MenuItem value="ToDo">To Do</MenuItem>
                      <MenuItem value="Inprogress">In Progress</MenuItem>
                      <MenuItem value="QA">QA</MenuItem>
                      <MenuItem value="Production">Production</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <Box className={styles.sidebarSection}>
                <Typography className={styles.label}>Priority</Typography>
                <Box className={styles.valueContainer}>
                  <FormControl fullWidth size="small">
                    <Select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                    >
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <Box className={styles.sidebarSection}>
                <Typography className={styles.label}>Task Type</Typography>
                <Box className={styles.valueContainer}>
                  <FormControl fullWidth size="small">
                    <Select
                      name="issueType"
                      value={formData.issueType}
                      onChange={handleInputChange}
                    >
                      <MenuItem value="Task">Task</MenuItem>
                      <MenuItem value="Bug">Bug</MenuItem>
                      <MenuItem value="Story">Story</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Add/Edit Work Log Dialog */}
      <Dialog
        open={openWorkLog}
        onClose={handleCloseWorkLogDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          {editingLogIndex >= 0 ? "Edit Work Log" : "Add Work Log"}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              type="date"
              label="Date"
              value={workLogData.date}
              onChange={(e) =>
                setWorkLogData({ ...workLogData, date: e.target.value })
              }
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <Box display="flex" gap={2}>
              <TextField
                type="time"
                label="Start Time"
                value={workLogData.startTime}
                onChange={(e) =>
                  setWorkLogData({ ...workLogData, startTime: e.target.value })
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="time"
                label="End Time"
                value={workLogData.endTime}
                onChange={(e) =>
                  setWorkLogData({ ...workLogData, endTime: e.target.value })
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <TextField
              label="Description"
              value={workLogData.description}
              onChange={(e) =>
                setWorkLogData({ ...workLogData, description: e.target.value })
              }
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWorkLogDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleAddWorkLog}>
            {editingLogIndex >= 0 ? "Update Log" : "Add Log"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Bug Dialog */}
      <Dialog
        open={openBugDialog}
        onClose={handleCloseBugDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          {editingBugId >= 0 ? "Edit Bug Log" : "Add Bug Log"}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <FormControl fullWidth size="small">
              <Typography variant="caption" sx={{ mb: 0.5, color: "#5e6c84" }}>
                Assignee
              </Typography>
              <Select
                value={bugData.assignee}
                onChange={(e) =>
                  setBugData({ ...bugData, assignee: e.target.value })
                }
                displayEmpty
              >
                <MenuItem value="">Unassigned</MenuItem>
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.userName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Description"
              placeholder="Describe the bug or issue..."
              value={bugData.description}
              onChange={(e) =>
                setBugData({ ...bugData, description: e.target.value })
              }
              fullWidth
              multiline
              rows={4}
              size="small"
              autoFocus
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBugDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveBug}>
            {editingBugId >= 0 ? "Update Log" : "Add Log"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskDetails;
