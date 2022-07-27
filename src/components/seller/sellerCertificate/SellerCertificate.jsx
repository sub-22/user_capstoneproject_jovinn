import {
  Button,
  ButtonGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { DeleteOutline, EditOutlined } from "@material-ui/icons";
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  addCertificates,
  deleteCer,
  fetchCurrentUser,
} from "../../../redux/userSlice";
import "./sellerCertificate.scss";
export default function SellerCertificate({ certificates, id }) {
  const [editStatus, setEditStatus] = useState(false);
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [linkCer, setLinkCer] = useState("");
  const handleEdit = (e) => {
    setEditStatus(true);
  };
  const handleNotEdit = (e) => {
    setEditStatus(false);
  };
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleAddCer = () => {
    const cers = { title, name, linkCer, userId: id };
    dispatch(addCertificates(cers))
      .unwrap()
      .then(() => {
        dispatch(fetchCurrentUser());
        setOpen(false);
      })

      .catch(() => {});
  };
  const handleCerRemove = (id) => {
    dispatch(deleteCer(id))
      .unwrap()
      .then(() => {
        dispatch(fetchCurrentUser());
      })
      .catch(() => {});
  };
  return (
    <div className="sellerIntro">
      {" "}
      <div className="top">
        <div className="left">
          <div className="editButton" onClick={handleEdit}>
            Chỉnh sửa
          </div>
          <h1 className="title">Chứng chỉ</h1>
          <div className="item">
            <div className="details">
              <TableContainer component={Paper}>
                <Table
                  sx={{ minWidth: 850 }}
                  size="small"
                  aria-label="a dense table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Tiêu đề</TableCell>
                      <TableCell align="right">Tên chứng chỉ</TableCell>

                      <TableCell align="right">Link</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {certificates.map((item) => {
                      return (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {item.title}
                          </TableCell>
                          <TableCell align="right"> {item.name}</TableCell>
                          <Link to="{item.linkCer}">
                            <TableCell align="right">
                              <p>LINK</p>
                            </TableCell>
                          </Link>
                          {editStatus && (
                            <TableCell align="right">
                              <EditOutlined color="primary" />
                              <DeleteOutline
                                color="secondary"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleCerRemove(item.id)}
                              />
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              {editStatus && (
                <ButtonGroup
                  disableElevation
                  variant="contained"
                  className="btnGroup"
                  style={{ justifyContent: "center" }}
                >
                  <Button onClick={() => setOpen(true)}>Thêm</Button>
                  <Button onClick={handleNotEdit}>Hủy</Button>
                </ButtonGroup>
              )}
              <Dialog
                fullWidth
                maxWidth="sm"
                open={open}
                onClose={handleClose}
                aria-labelledby="max-width-dialog-title"
              >
                <DialogTitle id="max-width-dialog-title">
                  Thêm chứng chỉ
                </DialogTitle>
                <DialogContent>
                  {" "}
                  <TextField
                    id="outlined-basic"
                    label="Tiêu đề"
                    variant="outlined"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <TextField
                    id="outlined-basic"
                    label="Tên chứng chỉ"
                    variant="outlined"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <TextField
                    id="outlined-basic"
                    label="Link"
                    variant="outlined"
                    onChange={(e) => setLinkCer(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleAddCer}
                    color="primary"
                    variant="contained"
                  >
                    Thêm
                  </Button>
                  <Button onClick={handleClose} color="primary">
                    Đóng
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
