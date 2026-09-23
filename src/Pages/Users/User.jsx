import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import MasterTable from "../../Components/MasterTable/MasterTable";
import { getUser, deleteUser, updateUser } from "../../Services/user.service";
import AddUserDialog from "./AddUser";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToast } from "../../Redux/Reducer/ToastReducer";

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);



  // Dialog State
  const [openAddUser, setOpenAddUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Delete Dialog
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const dispatch = useDispatch();

  const loadUsers = async () => {
    try {
      const res = await getUser();
      setUsers(res.data);
    } catch (error) {
      dispatch(
        setToast({
          message: error.message || "Failed to load users",
          type: "error",
        })
      );
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Handlers
  const handleAddUser = () => {
    setSelectedUser(null);
    setOpenAddUser(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenAddUser(true);
  };

  const handleDelete = (user) => {
    setDeleteUserId(user.id);
    setOpenDelete(true);
  };

  const confirmDelete = () => {
    deleteUser(deleteUserId).then(() => {
      loadUsers();
      setOpenDelete(false);
    });
  };

  // Filter users
  const filteredUsers = users.filter((u) =>
    u.userName.toLowerCase().includes(filter.toLowerCase())
  );

  const columns = [
    { id: "serialNo", label: "SI.NO", sortable: false },
    { id: "userName", label: "Username", sortable: true },
    { id: "email", label: "Email", sortable: true },
    { id: "createdAt", label: "Created At", sortable: true },
  ];

  return (
    <Box>
      <Box className="mb-2">
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} sm={3.5}>
            <Box className="SearchInputBoxContainer">
              <SearchOutlinedIcon className="Search_Icon" />
              <input
                className="SearchInputBox"
                placeholder="Search by Username"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              className="AddButton w-100"
              onClick={handleAddUser}
              startIcon={<AddOutlinedIcon />}
            >
              Add User
            </Button>
          </Grid>
        </Grid>
      </Box>

      <MasterTable
        columns={columns}
        data={filteredUsers || []}
        page={page}
        rowsPerPage={5}
        onPageChange={(p) => setPage(p)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        editIcon={<EditIcon />}
        deleteIcon={<DeleteIcon />}
      />



      <AddUserDialog
        open={openAddUser}
        onClose={() => setOpenAddUser(false)}
        onSave={loadUsers}
        user={selectedUser}
      />

      {/* Delete Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete User?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
