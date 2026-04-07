import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Card,
  Container,
  Grid,
  Stack,
  TextField,
  Modal,
  Fade,
  Backdrop,
  ButtonGroup,
  Box,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import uuid from "react-uuid";

function MyReliefCenter() {
  const [rows, setRows] = useState([]);
  const [reliefCenter, setReliefCenter] = useState(false);
  const [reliefCenterData, setReliefCenterData] = useState([]);
  const [reliefCenterId, setReliefCenterId] = useState();
  const [open, setOpen] = useState(false);
  const [accomodationModal, setAccomodationModal] = useState(false);
  const [reliefForm, setReliefForm] = useState({
    CenterName: "",
    Phone: "",
    Capacity: "",
    Address: "",
    latitude: "",
    longitude: "",
    email: "",
  });
  const [stateCapacity, setStateCapacity] = useState();
  const [updateNumber, setUpdateNumber] = useState(0);
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");

  const userId = useSelector((state) => state.auth.id);

  const columns = [
    { field: "_id", headerName: "ID", width: 70 },
    { field: "CenterName", headerName: "Center Name", width: 200 },
    { field: "ItemName", headerName: "Item", width: 300 },
    { field: "Quantity", headerName: "Quantity", width: 130 },
    { field: "Status", headerName: "Status", width: 130 },
    {
      field: "confirm",
      headerName: "Action",
      width: 200,
      renderCell: (params) => getStatusButton(params.row),
    },
  ];

  function getStatusButton(status) {
    const delivery = () => {
      axios
        .put(`relief/confirmdelivery/${status._id}`)
        .then((res) => {
          console.log(res);
          toast.success("Delivery Confirmed");
          setRow(); // <- Refresh the table
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong");
        });
    };
    return status.Status === "dispatched" ? (
      <Button variant="outlined" size="small" color="info" onClick={delivery}>
        Confirm
      </Button>
    ) : null;
  }

  const setRow = () => {
    axios
      .get(`relief/getSupplyReqbyCreator/${userId}`)
      .then((res) => setRows(res.data))
      .catch((err) => console.error(err));
  };

  const loadData = async () => {
    await axios
      .get(`/relief/getreliefcenterbyid/${userId}`)
      .then((res) => {
        const data = res.data;
        if (data.length > 0) {
          setReliefCenter(true);
          setReliefCenterData(data);
          setReliefCenterId(data[0]._id);
          setUpdateNumber(data[0].Admission);
          setStateCapacity(data[0].Capacity);
        } else {
          setReliefCenter(false);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setRow();
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReliefForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = { ...reliefForm, InCharge: userId };
    axios
      .post("relief/addreliefcenter", form)
      .then(() => {
        toast.success("Relief Center Created");
        setReliefForm({
          CenterName: "",
          Phone: "",
          Capacity: "",
          Address: "",
          email: "",
          latitude: "",
          longitude: "",
        });
        loadData();
      })
      .catch((err) => console.log(err));
  };

  const handleSlotUpdate = () => {
    axios
      .put(`relief/addadmission/${reliefCenterId}`, { Admission: updateNumber })
      .then(() => {
        loadData();
        setAccomodationModal(false);
      })
      .catch((err) => console.log(err));
  };

  const handleSupplyRequest = () => {
    const form = {
      ItemName: item,
      Quantity: quantity,
      CenterName: reliefCenterData[0].CenterName,
      Phone: reliefCenterData[0].Phone,
      Requester: userId,
    };
    axios
      .post("/relief/addreliefsupplyrequest", form)
      .then(() => {
        toast.success("Request Submitted");
        setRow();
        setOpen(false);
      })
      .catch((err) => console.log(err));
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "#fff",
    boxShadow: 24,
    pt: 2,
    p: 4,
  };

  return (
    <Container maxWidth="lg">
      {reliefCenter ? (
        <>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 2 }}
          >
            <Grid item>
              <Typography variant="h6" fontWeight={600}>
                My Relief Center
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setOpen(true)}
              >
                Supply Request
              </Button>
            </Grid>
          </Grid>

          <Card sx={{ mt: 3, p: 3, borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">
                  {reliefCenterData[0].CenterName}
                </Typography>
                <Typography variant="body2">
                  Phone: {reliefCenterData[0].Phone}
                </Typography>
                <Typography variant="body2">
                  Vacancy:{" "}
                  {reliefCenterData[0].Capacity - reliefCenterData[0].Admission}{" "}
                  / {reliefCenterData[0].Capacity}
                </Typography>
                <Typography variant="body2" color="primary">
                  {reliefCenterData[0].Address}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
              >
                <ButtonGroup variant="outlined">
                  <Button onClick={() => setAccomodationModal(true)}>
                    Update Vacancy
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
          </Card>

          <Card sx={{ mt: 3, p: 2, borderRadius: 2, height: 500 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              getRowId={() => uuid()}
            />
          </Card>
        </>
      ) : (
        <Grid container direction="column" alignItems="center" sx={{ mt: 4 }}>
          <Typography variant="h5">Create your Relief Center</Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 3, width: "40vw", p: 3, boxShadow: 3 }}
          >
            <Grid container spacing={2}>
              {[
                "CenterName",
                "Phone",
                "email",
                "Capacity",
                "Address",
                "latitude",
                "longitude",
              ].map((field) => (
                <Grid item xs={12} key={field}>
                  <TextField
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    name={field}
                    fullWidth
                    required
                    size="small"
                    type={
                      field === "email"
                        ? "email"
                        : field === "Capacity"
                        ? "number"
                        : "text"
                    }
                    value={reliefForm[field]}
                    onChange={handleChange}
                  />
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button type="submit" variant="contained" fullWidth>
                  Create Relief Center
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <Box sx={modalStyle}>
            <Stack direction="row" justifyContent="space-between" mb={3}>
              <Typography variant="h6" color="primary">
                Supply Request
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={handleSupplyRequest}
              >
                Send
              </Button>
            </Stack>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Item"
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={(e) => setItem(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Quantity"
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Modal>

      <Modal
        open={accomodationModal}
        onClose={() => setAccomodationModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={accomodationModal}>
          <Box
            sx={{
              ...modalStyle,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Update Vacancy</Typography>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              mt={2}
              spacing={2}
            >
              <Button
                disabled={updateNumber === 0}
                onClick={() => setUpdateNumber(updateNumber - 1)}
              >
                -
              </Button>
              <Typography variant="h4">{updateNumber}</Typography>
              <Button
                disabled={updateNumber === stateCapacity}
                onClick={() => setUpdateNumber(updateNumber + 1)}
              >
                +
              </Button>
            </Stack>
            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={handleSlotUpdate}
            >
              Update
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
}

export default MyReliefCenter;
