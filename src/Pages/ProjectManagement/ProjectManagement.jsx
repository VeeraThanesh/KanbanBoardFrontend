import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MasterTable from "../../Components/MasterTable/MasterTable";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../Services/projectService";
import AddProjectManagement from "./AddProjectManagement";

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");

  const columns = [
    { id: "serialNo", label: "SI.NO", sortable: false },
    { id: "name", label: "Name", sortable: true },
    { id: "description", label: "Description", sortable: true },
    { id: "formattedDate", label: "Created At", sortable: true },
  ];

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      console.log(res, "DATA");
      setProjects(res.data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateClick = () => {
    setCurrentProject(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (project) => {
    setCurrentProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this project? Tasks associated with it might become orphaned."
      )
    ) {
      try {
        await deleteProject(id);
        fetchProjects();
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  };

  const handleSaveProject = async (projectData) => {
    try {
      if (currentProject) {
        await updateProject(currentProject._id, projectData);
      } else {
        await createProject(projectData);
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      console.error("Save failed", error);
    }
  };

  return (
    <Box>
      <Box className="mb-2">
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} sm={3.5}>
            <Box className="SearchInputBoxContainer">
              <SearchOutlinedIcon className="Search_Icon" />
              <input
                className="SearchInputBox"
                placeholder="Search projects"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              className="AddButton w-100"
              onClick={handleCreateClick}
              startIcon={<AddOutlinedIcon />}
            >
              Add Project
            </Button>
          </Grid>
        </Grid>
      </Box>

      <MasterTable
        columns={columns}
        data={
          projects
            .filter((p) =>
              p.name.toLowerCase().includes(filter.toLowerCase())
            )
            .map((p) => ({
              ...p,
              formattedDate: new Date(p.createdAt).toLocaleDateString(),
            })) || []
        }
        page={page}
        rowsPerPage={5}
        onPageChange={(p) => setPage(p)}
        onEdit={handleEditClick}
        onDelete={(p) => handleDeleteClick(p._id)}
        editIcon={<EditIcon />}
        deleteIcon={<DeleteIcon />}
      />

      <AddProjectManagement
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        project={currentProject}
      />
    </Box>
  );
};

export default ProjectManagement;
