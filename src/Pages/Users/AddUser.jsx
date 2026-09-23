import React, { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { postUser, updateUser } from "../../Services/user.service";
import { useDispatch } from "react-redux";
import { setToast } from "../../Redux/Reducer/ToastReducer";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Box,
} from "@mui/material";

const AddUser = ({ open, onClose, onSave, user }) => {
  const dispatch = useDispatch();
  const isEdit = !!user;

  const initialValues = {
    userName: user?.userName || "",
    email: user?.email || "",
    role: user?.role || "",
    password: "",
  };

  const roles = ["USER", "ADMIN", "SUPERADMIN"];

  const AddUserSchema = Yup.object().shape({
    userName: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: isEdit
      ? Yup.string().min(6)
      : Yup.string().min(6).required("Password is required"),
    role: Yup.string().required("Role is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      let res;
      if (isEdit) {
        const userId = user._id || user.id;
        const payload = { ...values };
        if (!payload.password) delete payload.password;
        res = await updateUser(userId, payload);
      } else {
        res = await postUser(values);
      }
      console.log(res);
      dispatch(setToast({ message: isEdit ? "User Updated" : "User Created", type: "success" }));
      onSave(); // Refresh list
      onClose(); // Close dialog
    } catch (err) {
      dispatch(setToast({ message: err.message, type: "error" }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? "Edit User" : "Add User"}</DialogTitle>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={AddUserSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue, isSubmitting, submitForm }) => (
          <>
            <DialogContent>
              <Form>
                <Box mb={2}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Username"
                    name="userName"
                    error={touched.userName && !!errors.userName}
                    helperText={touched.userName && errors.userName}
                  />
                </Box>
                <Box mb={2}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                  />
                </Box>
                <Box mb={2}>
                  <Autocomplete
                    options={roles}
                    defaultValue={initialValues.role}
                    value={initialValues.role || null} // Controlled value
                    onChange={(event, value) => {
                         setFieldValue("role", value ? value : "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Role"
                        name="role"
                        error={touched.role && !!errors.role}
                        helperText={touched.role && errors.role}
                      />
                    )}
                  />
                </Box>
                <Box mb={2}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    error={touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                    placeholder={isEdit ? "Leave blank to keep current" : ""}
                  />
                </Box>
              </Form>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="inherit">
                Cancel
              </Button>
              <Button
                onClick={submitForm}
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isEdit ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddUser;
