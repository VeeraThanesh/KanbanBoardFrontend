import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { getUser } from "../../Services/user.service";

const AddTaskManagement = ({
  open,
  onClose,
  onSave,
  task,
  projects,
  users,
}) => {
  const isEdit = !!task;
  const [userData, setUserData] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    project: "",
    assignee: "",
    issueType: "Task",
    priority: "Medium",
    deadline: "",
    estimation: "",
    description: "",
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        project: task.project?._id || task.project || "",
        assignee: task.assignee?._id || task.assignee || "",
        issueType: task.issueType || "Task",
        priority: task.priority || "Medium",
        deadline: task.deadline ? task.deadline.split("T")[0] : "",
        estimation: task.estimation || "",
        description: task.description || "",
      });
    } else {
      setFormData({
        title: "",
        project: "",
        assignee: "",
        issueType: "Task",
        priority: "Medium",
        deadline: "",
        estimation: "",
        description: "",
      });
    }
  }, [task, open]);

  const GetUserData = async () => {
    const userResponse = await getUser();

    setUserData(userResponse.data);
  };

  useEffect(() => {
    GetUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? "Edit Task" : "Create Task"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              name="title"
              fullWidth
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select
                name="project"
                value={formData.project}
                label="Project"
                onChange={handleChange}
                required
              >
                {projects.map((p) => (
                  <MenuItem key={p._id} value={p._id}>
                    {p.name}
                  </MenuItem>
                ))}
                {!projects.find((p) => p._id === formData.project) &&
                  formData.project && (
                    <MenuItem value={formData.project}>
                      Test Project ({formData.project})
                    </MenuItem>
                  )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Assignee</InputLabel>
              <Select
                name="assignee"
                value={formData.assignee}
                label="Assignee"
                onChange={handleChange}
              >
                <MenuItem value="">Unassigned</MenuItem>
                {userData.map((u) => (
                  <MenuItem key={u._id} value={u._id}>
                    {u.userName} ({u.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Issue Type</InputLabel>
              <Select
                name="issueType"
                value={formData.issueType}
                label="Issue Type"
                onChange={handleChange}
              >
                <MenuItem value="Bug">Bug</MenuItem>
                <MenuItem value="Task">Task</MenuItem>
                <MenuItem value="Story">Story</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={formData.priority}
                label="Priority"
                onChange={handleChange}
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Deadline"
              name="deadline"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.deadline}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Estimation (e.g., 10 hours)"
              name="estimation"
              type="text"
              fullWidth
              value={formData.estimation}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              multiline
              rows={4}
              fullWidth
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTaskManagement;
