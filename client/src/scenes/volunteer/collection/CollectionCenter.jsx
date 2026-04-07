import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Modal,
  Fade,
  Backdrop,
  Card,
  CardContent,
  Divider,
  Stack,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 500, md: 600 },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "1rem",
  outline: "none",
};

function CollectionCenter() {
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [rows, setRows] = useState([]);

  const fetchCollectionCenters = () => {
    axios
      .get("collection/getCollectionCenter")
      .then((res) => {
        const dataWithIds = res.data.map((item) => ({
          ...item,
          id: item._id,
        }));
        setRows(dataWithIds);
      })
      .catch((err) => {
        console.error("Error fetching collection centers:", err);
      });
  };

  useEffect(() => {
    fetchCollectionCenters();
  }, []);

  const columns = [
    { field: "_id", headerName: "ID", width: 90, hide: true },
    { field: "CenterName", headerName: "Center Name", width: 250 },
    { field: "Phone", headerName: "Phone No.", width: 200 },
    {
      field: "action",
      headerName: "Details",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => {
            setModalData(params.row);
            setOpen(true);
          }}
        >
          View More
        </Button>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🏢 Collection Centers Overview
      </Typography>

      <Card sx={{ mb: 4, borderRadius: 3, p: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Registered Collection Centers
          </Typography>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 25]}
            autoHeight
            sx={{ borderRadius: 2 }}
          />
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <Box sx={modalStyle}>
            {modalData && (
              <>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {modalData.CenterName} Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Stack spacing={1.5}>
                      <Typography variant="subtitle1">
                        📞 Phone: <b>+91 {modalData.Phone}</b>
                      </Typography>
                      <Typography variant="subtitle2">
                        🏠 Address: <b>{modalData.Address}</b>
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
}

export default CollectionCenter;
