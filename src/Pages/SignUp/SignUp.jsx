import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import style from "../Users/AddUser.module.scss"; // Reusing styles for now
import { postUser } from "../../Services/user.service";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToast } from "../../Redux/Reducer/ToastReducer";
import { Autocomplete, TextField } from "@mui/material";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    userName: "",
    email: "",
    role: "",
    password: "",
  };

  const roles = ["USER", "ADMIN", "SUPERADMIN"];

  const SignUpSchema = Yup.object().shape({
    userName: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6).required("Password is required"),
    role: Yup.string().required("Role is required"),
  });

  const handleSubmit = async (values) => {
    try {
      const res = await postUser(values);
      console.log(res);
      navigate("/");
    } catch (err) {
      console.log(err, "SUMERR");
      dispatch(setToast({ message: err.message, type: "error" }));
    }
  };

  return (
    <div className={style.container}>
      <div className={style.card}>
        <h2>Sign Up</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={SignUpSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form>
              <div className={style.inputGroup}>
                <label>Username</label>
                <Field
                  type="text"
                  name="userName"
                  placeholder="Enter username"
                />
                {errors.userName && touched.userName && (
                  <span className={style.error}>{errors.userName}</span>
                )}
              </div>

              <div className={style.inputGroup}>
                <label>Email</label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                />
                {errors.email && touched.email && (
                  <span className={style.error}>{errors.email}</span>
                )}
              </div>
              <div className={style.inputGroup}>
                <label>Role</label>
                <Autocomplete
                  options={roles}
                  fullWidth
                  getOptionLabel={(option) => option}
                  onChange={(event, value) => setFieldValue("role", value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="role"
                      placeholder="Select role"
                      error={errors.role && touched.role}
                      helperText={
                        errors.role && touched.role ? errors.role : ""
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          fontSize: "14px",
                          "& fieldset": {
                            borderColor: "#ccc",
                          },
                          "&:hover fieldset": {
                            borderColor: "#888",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#4f46e5",
                          },
                          "& input": {
                            border: "none !important",
                            padding: "0px !important",
                          },
                        },
                      }}
                    />
                  )}
                  sx={{
                    "& .MuiAutocomplete-paper": {
                      backgroundColor: "#fff",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      borderRadius: 4,
                    },
                    "& .MuiAutocomplete-option": {
                      padding: "8px 16px",
                      fontSize: "0.9rem",
                      textTransform: "capitalize",
                      "&[aria-selected='true']": {
                        backgroundColor: "#4f46e5",
                        color: "#fff",
                      },
                      "&:hover": {
                        backgroundColor: "#e3f2fd",
                      },
                    },
                  }}
                />
                {errors.role && touched.role && (
                  <span className={style.error}>{errors.role}</span>
                )}
              </div>

              <div className={style.inputGroup}>
                <label>Password</label>
                <Field
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                />
                {errors.password && touched.password && (
                  <span className={style.error}>{errors.password}</span>
                )}
              </div>
              <p>
                Already have an account? <a href="/">Login</a>
              </p>

              <button type="submit" className={style.btn}>
                Sign Up
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignUp;
