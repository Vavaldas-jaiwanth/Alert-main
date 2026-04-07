// Updated MyCollectionCenter.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Modal,
  Stack,
  TextField,
  Typography,
  Badge,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import uuid from "react-uuid";
import axios from "axios";

function MyCollectionCenter() {
  const userId = useSelector((state) => state.auth.id);
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState("");
  const [rows, setRows] = useState([]);
  const [disRows, setDisRows] = useState([]);
  const [phone, setPhone] = useState("");
  const [driverNo, setDriverNo] = useState("");
  const [table, setTable] = useState(true);
  const [collectionCenter, setCollectionCenter] = useState(false);
  const [collectionCenterData, setCollectionCenterData] = useState([]);
  const [collectionForm, setCollectionForm] = useState({
    CenterName: "",
    Phone: "",
    Address: "",
  });

  const style = {
    position: "absolute",
    top: "30%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#fff",
    boxShadow: 24,
    pt: 2,
    p: 4,
  };

  const handleClose = () => setOpen(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCollectionForm({ ...collectionForm, [name]: value });
  };

  const loadData = async () => {
    try {
      const res = await axios.get(
        `collection/getCollectionCenterById/${userId}`
      );
      const dataArr = res.data;
      setCollectionCenterData(dataArr);
      setCollectionCenter(dataArr.length > 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (userId) {
      loadData();
      console.log("k");
    }
  }, [userId]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = {
      CenterName: collectionForm.CenterName,
      Phone: collectionForm.Phone,
      Address: collectionForm.Address,
      InCharge: userId,
    };

    axios
      .post("collection/addCollectioncenter", form)
      .then(() => {
        toast.success("Collection Center Created");
        setCollectionForm({ CenterName: "", Phone: "", Address: "" });
        loadData();
      })
      .catch(console.error);
  };

  const setRow = () => {
    axios
      .get(`relief/getreliefsupply`)
      .then((res) => setRows(res.data))
      .catch(console.error);
  };

  const setDispatchRow = () => {
    axios
      .get(`relief/getSupplyReqbyAccepted/${userId}`)
      .then((res) => setDisRows(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    setRow();
    setDispatchRow();
  }, []);

  const acceptDelivery = (rowData) => {
    const form = { Status: "accepted", AcceptedBy: userId };
    axios
      .put(`collection/acceptDelivery/${rowData._id}`, form)
      .then(() => {
        toast.success("Accepted Successfully");
        setRow();
        setDispatchRow();
      })
      .catch(console.error);
  };

  const dispatchDelivery = (id) => {
    axios
      .put(`collection/dispatch/${id}`, { phone: driverNo })
      .then(() => {
        toast.success("Dispatched Successfully");
        setRow();
        setDispatchRow();
        handleClose();
      })
      .catch(console.error);
  };

  const dispatchModal = (data) => {
    setOpen(true);
    setModalData(data);
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 70, hide: true },
    {
      field: "id",
      headerName: "Sl no",
      width: 80,
      renderCell: (index) => index.api.getRowIndex(index.row.code) + 1,
    },
    { field: "CenterName", headerName: "Center Name", width: 150 },
    { field: "ItemName", headerName: "Item", width: 200 },
    { field: "Quantity", headerName: "Quantity", width: 130 },
    { field: "Status", headerName: "Status", width: 130 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          color="info"
          onClick={() => acceptDelivery(params.row)}
        >
          Accept
        </Button>
      ),
    },
  ];

  const dispatchColumns = [
    { field: "_id", headerName: "ID", width: 70, hide: true },
    {
      field: "id",
      headerName: "Sl no",
      width: 80,
      renderCell: (index) => index.api.getRowIndex(index.row.code) + 1,
    },
    { field: "CenterName", headerName: "Center Name", width: 150 },
    { field: "ItemName", headerName: "Item", width: 200 },
    { field: "Quantity", headerName: "Quantity", width: 130 },
    { field: "Status", headerName: "Status", width: 130 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          color="success"
          onClick={() => dispatchModal(params.row)}
        >
          Dispatch
        </Button>
      ),
    },
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" fontWeight={600} mt={3} mb={2}>
        {collectionCenter
          ? "My Collection Center"
          : "Create Your Collection Center"}
      </Typography>

      {collectionCenter ? (
        <>
          <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6">
              {collectionCenterData[0]?.CenterName}
            </Typography>
            <Typography variant="body2" mt={1}>
              <strong>Contact:</strong> {collectionCenterData[0]?.Phone}
            </Typography>
            <Typography variant="body2">
              <strong>Address:</strong> {collectionCenterData[0]?.Address}
            </Typography>
          </Card>

          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Grid item>
              <Typography variant="h6">
                {table ? "New Requests" : "Accepted Items"}
              </Typography>
            </Grid>
            <Grid item>
              <Badge badgeContent={table && disRows.length} color="primary">
                <Button variant="outlined" onClick={() => setTable(!table)}>
                  Switch to {table ? "Accepted Items" : "New Requests"}
                </Button>
              </Badge>
            </Grid>
          </Grid>

          <Card sx={{ p: 2, borderRadius: 2 }}>
            <DataGrid
              autoHeight
              rows={table ? rows : disRows}
              columns={table ? columns : dispatchColumns}
              getRowId={(row) => uuid()}
            />
          </Card>
        </>
      ) : (
        <Card sx={{ p: 3, borderRadius: 2 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Center Name"
                  name="CenterName"
                  value={collectionForm.CenterName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="Phone"
                  value={collectionForm.Phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="Address"
                  value={collectionForm.Address}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" fullWidth>
                  Create
                </Button>
              </Grid>
            </Grid>
          </form>
        </Card>
      )}

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            Dispatch the Product
          </Typography>
          <Typography>
            <strong>Item Name:</strong> {modalData.ItemName}
          </Typography>
          <Typography>
            <strong>Quantity:</strong> {modalData.Quantity}
          </Typography>
          <TextField
            fullWidth
            label="Driver Contact No"
            value={driverNo}
            onChange={(e) => setDriverNo(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => dispatchDelivery(modalData._id)}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}

export default MyCollectionCenter;
