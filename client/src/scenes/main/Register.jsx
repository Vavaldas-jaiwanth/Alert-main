import React, { useState } from "react";
import {
  Container,
  Box,
  Grid,
  Card,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const agencykey = queryParams.get("key");

  const [formData, setFormData] = useState(() => {
    const savedFormData = localStorage.getItem("registrationFormData");
    return savedFormData
      ? JSON.parse(savedFormData)
      : {
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          code: "",
          role: "",
        };
  });

  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFormData = (data) => {
    const errors = {};
    if (!data.firstName) errors.firstName = "First Name is required";
    if (!data.lastName) errors.lastName = "Last Name is required";
    if (!data.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = "Invalid email";
    if (!data.phoneNumber) errors.phoneNumber = "Phone Number is required";
    if (!data.password) errors.password = "Password is required";
    if (!data.confirmPassword)
      errors.confirmPassword = "Confirm Password is required";
    else if (data.password !== data.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    if (!data.code) errors.code = "Code is required";
    else {
      const expected = Number(data.phoneNumber) - 1;
      if (Number(data.code) !== expected)
        errors.code = "Please enter the correct code";
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateFormData(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      axios
        .post("/user/signup", formData)
        .then((res) => {
          toast.success(res.data.message);
          navigate(`/agency?key=${agencykey}`);
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || "Registration failed");
        });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Card elevation={4} sx={{ p: 4, width: "100%" }}>
          <Typography variant="h5" color="primary" align="center" gutterBottom>
            Create Your Account
          </Typography>
          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={!!formErrors.firstName}
                  helperText={formErrors.firstName}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={!!formErrors.lastName}
                  helperText={formErrors.lastName}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  error={!!formErrors.phoneNumber}
                  helperText={formErrors.phoneNumber}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={!!formErrors.confirmPassword}
                  helperText={formErrors.confirmPassword}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  error={!!formErrors.code}
                  helperText={formErrors.code}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  fullWidth
                >
                  <MenuItem value="reliefCenter">Relief Center</MenuItem>
                  <MenuItem value="collectionCenter">
                    Collection Center
                  </MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <Box mt={4}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Create Account
              </Button>
            </Box>
          </form>
        </Card>
      </Box>
    </Container>
  );
}

export default Register;
