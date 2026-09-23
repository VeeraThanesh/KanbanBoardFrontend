import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

const HistoryLog = ({
  history,
  entityType,
  onFilterChange,
  showFilter = true,
  loading = false,
}) => {
  const renderHistoryContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
          <CircularProgress size={30} />
        </Box>
      );
    }

    if (!history || history.length === 0) {
      return (
        <Typography color="textSecondary" align="center" sx={{ mt: 2 }}>
          No history found.
        </Typography>
      );
    }

    return (
      <List>
        {history.map((record) => (
          <React.Fragment key={record._id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Box display="flex" justifyContent="space-between">
                    <Typography
                      variant="subtitle2"
                      component="span"
                      fontWeight="bold"
                    >
                      {record.performedBy?.userName || "Unknown User"}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(record.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      {record.action} {record.entityType}
                    </Typography>
                    {record.taskData && (
                      <Typography
                        component="span"
                        variant="body2"
                        fontWeight="bold"
                        color="primary"
                      >
                        {` "${
                          record.taskData.token
                            ? `[${record.taskData.token}] `
                            : ""
                        }${
                          record.taskData.title ||
                          record.taskData.name ||
                          "Unknown"
                        }"`}
                      </Typography>
                    )}
                    {" - "}
                    {record.action === "UPDATE"
                      ? formatReview(record.changes)
                      : `Action performed`}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    );
  };

  const formatReview = (changes) => {
    if (!changes) return "";
    return Object.entries(changes)
      .map(([key, val]) => {
        if (val.old && val.new) {
          return `${key} changed from '${val.old}' to '${val.new}'`;
        }
        return JSON.stringify(val);
      })
      .join(", ");
  };

  return (
    <Paper sx={{ maxHeight: 600, overflow: "auto", p: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        position="sticky"
        top={0}
        bgcolor="background.paper"
        zIndex={1}
      >
        <Typography variant="h6">Activity Log</Typography>
        {showFilter && (
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="entity-type-label">Entity Type</InputLabel>
            <Select
              labelId="entity-type-label"
              value={entityType || "Task"}
              label="Entity Type"
              onChange={onFilterChange}
            >
              <MenuItem value="Task">Task</MenuItem>
              <MenuItem value="Bug">Bug</MenuItem>
            </Select>
          </FormControl>
        )}
      </Box>
      {renderHistoryContent()}
    </Paper>
  );
};

export default HistoryLog;
