import React, { useState } from "react";
import {
  Container,
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Grid,
  Link as MuiLink,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCollectionCenter, setReliefCenter } from "../../store/auth";
import useAgencyNavigate from "../../hooks/useAgencyNavigate";

function Login() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const agencykey = queryParams.get("key");
  const navigate = useAgencyNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFormData = (data) => {
    const errors = {};
    if (!data.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email is invalid";
    }

    if (!data.password) {
      errors.password = "Password is required";
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(data.password)) {
      errors.password =
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number";
    }

    return errors;
  };

  const HandleSubmit = (e) => {
    e.preventDefault();
    const errors = validateFormData(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      axios
        .post("/user/signin", formData)
        .then((res) => {
          toast.success(res.data.message);
          Cookie.set("Token", res.data.token);

          if (res.data.role === "reliefCenter") {
            dispatch(setReliefCenter(res.data.userID));
            navigate("/agency/relief-center");
          } else {
            dispatch(setCollectionCenter(res.data.userID));
            navigate("/agency/collection-center");
          }
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || "Login failed");
        });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Card
          sx={{
            p: 4,
            borderRadius: 4,
            width: "100%",
            boxShadow: 3,
            background: "#f5f5f5",
          }}
        >
          <Typography
            variant="h5"
            textAlign="center"
            fontWeight={600}
            gutterBottom
          >
            Welcome Back
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            mb={3}
          >
            Please login to your account
          </Typography>

          <form onSubmit={HandleSubmit}>
            <TextField
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              fullWidth
              margin="normal"
              size="small"
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
              fullWidth
              margin="normal"
              size="small"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, py: 1.5, fontWeight: "bold" }}
            >
              Login
            </Button>
          </form>

          <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
            <Grid item>
              <MuiLink
                component={RouterLink}
                to={`/agency/register?key=${agencykey}`}
                variant="body2"
                underline="hover"
              >
                Don't have an account? Register
              </MuiLink>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Container>
  );
}

export default Login;
