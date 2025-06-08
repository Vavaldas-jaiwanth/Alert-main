import React from "react";
import { Container, Box } from "@mui/system";
import Typography from "@mui/material/Typography";
import {
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import { Link as RouterLink, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import {
  setCollectionCenter,
  setAdmin,
  setReliefCenter,
} from "../../store/auth";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import useAgencyNavigate from "../../hooks/useAgencyNavigate";

function Login() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const agencykey = queryParams.get("key");
  const navigate = useAgencyNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = React.useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
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

  const HandleSubmit = (event) => {
    event.preventDefault();
    const errors = validateFormData(formData);
    setFormErrors(errors);
    const form = {
      email: formData.email,
      password: formData.password,
    };

    if (Object.keys(errors).length === 0) {
      axios
        .post("/user/signin", form)
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
          toast.error(err.response.data.message);
        });
    }
  };

  return (
    <div className="login-container">
      <div className="background-design"></div>
      <Container minWidth="md" maxWidth="md">
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mt: "8rem",
          }}
        >
          <Card
            sx={{
              width: "40%",
              borderRadius: "1rem",
              p: "1rem",
              boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "20rem",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 400, color: "white" }}>
              Login
            </Typography>

            <Box component="form" onSubmit={HandleSubmit} sx={{ mt: 2 }}>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          id="email"
                          label="Email Address"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          error={!!formErrors.email}
                          helperText={formErrors.email}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="password"
                          label="Password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          error={!!formErrors.password}
                          helperText={formErrors.password}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{
                            mt: 3,
                            mb: 2,
                            backgroundColor: "black",
                            color: "white",
                          }}
                        >
                          Login
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Grid container justifyContent="flex-end">
                          <Grid item>
                            <RouterLink
                              to={`/agency/register?key=${agencykey}`}
                            >
                              <Link
                                component="span"
                                variant="caption"
                                sx={{ color: "white" }}
                              >
                                {"Create a New Account"}
                              </Link>
                            </RouterLink>
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Card>
        </Box>
      </Container>
    </div>
  );
}

export default Login;
