import React, { useState } from "react";

import "./sellerCreateOffer.scss";

import {
  AppBar,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  makeStyles,
  Toolbar,
  Typography,
  List,
  ListItem,
  InputAdornment,
  ListItemText,
  ListItemAvatar,
  Avatar,
  FormControl,
} from "@material-ui/core";
import { Close, CloudUpload, AddSharp, RemoveSharp } from "@material-ui/icons";
import Alert from "@material-ui/lab/Alert";
import { useDispatch, useSelector } from "react-redux";
import BuyerHeader from "../../../components/buyer/buyerHeader/BuyerHeader";
import Contact from "../../../components/guest/contact/Contact";
import { selectAllCategories } from "../../../redux/categorySlice";
import {
  addOffer,
  addRequest,
  fetchRequestsBuyer,
  fetchRequestsSeller,
} from "../../../redux/requestSlice";

import { selectTopSellers } from "../../../redux/userSlice";
import SellerHeader from "../../../components/seller/sellerHeader/SellerHeader";
import { useParams } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

export default function SellerCreateOffer() {
  const { requestId } = useParams();
  const topSeller = useSelector(selectTopSellers);
  const listCategory = useSelector(selectAllCategories);
  const [cateId, setCateId] = useState(listCategory[0].id);
  const [subCateId, setSubCateId] = useState("");
  const [recruitLevel, setRecruitLevel] = useState("BEGINNER");
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState([]);
  const [inviteUsers, setInviteUsers] = useState([]);
  const [stages, setStages] = useState([
    { startDate: "", endDate: "", description: "", milestoneFee: 0 },
  ]);
  const [cancleFee, setCancleFee] = useState(0);
  const request = {
    categoryId: cateId,
    subCategoryId: subCateId,
    recruitLevel: recruitLevel,
    skillsName: skills,
    jobTitle: jobTitle,
    shortRequirement: description,
    milestoneContracts: stages,
    contractCancelFee: cancleFee,
    invitedUsers: inviteUsers,
  };
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // ssssssss
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const sendOffer = () => {
    setError("");
    let check1 = false;
    let check2 = true;
    let check3 = true;
    stages.map((item, index) => {
      if (item.startDate == "") {
        check3 = false;
        setError("Chưa nhập ngày bắt đầu của giai đoạn " + parseInt(index + 1));
      } else if (item.endDate == "") {
        check3 = false;
        setError(
          "Chưa nhập ngày kết thúc của giai đoạn " + parseInt(index + 1)
        );
      } else if (item.description == "") {
        check3 = false;
        setError(
          "Chưa nhập sản phẩm bàn giao của giai đoạn " + parseInt(index + 1)
        );
      } else if (item.milestoneFee == 0) {
        check3 = false;
        setError("Chưa nhập chi phí của giai đoạn " + parseInt(index + 1));
      }
    });
    if (subCateId == "") {
      setError("Chưa chọn danh mục con!");
    } else if (jobTitle == "") {
      setError("Chưa nhập tiêu đề!");
    } else if (description == "") {
      setError("Chưa nhập mô tả!");
    } else if (cancleFee == 0) {
      setError("Chưa nhập phí hủy hợp đồng!");
    } else {
      check1 = true;

      skills.map((item, index) => {
        if (item == "") {
          check2 = false;
          setError("Chưa nhập kĩ năng " + parseInt(index + 1));
        }
      });
    }

    if (check2 && check1 && check3) {
      dispatch(addOffer({ request, requestId }))
        .unwrap()
        .then(() => {
          dispatch(fetchRequestsSeller());
          setSuccess("Tạo đề nghị thành công!");
        })
        .catch(() => {
          setError("Tạo đề nghị thất bại!");
        });
    }
  };

  const handleClose = (e) => {
    e.preventDefault();
    dispatch(addRequest({ request, requestId }))
      .unwrap()
      .then(() => {
        dispatch(fetchRequestsBuyer());
        setSuccess("Tạo yêu cầu thành công!");
      })
      .catch(() => {
        setError("Tạo yêu cầu thất bại!");
      });
    setOpen(false);
  };

  const [fullScreenOpen, setFullScreenOpen] = useState(false);
  const handleFullScreenOpen = () => {
    setFullScreenOpen(true);
  };
  const handleFullScreenClose = (e) => {
    e.preventDefault();
    dispatch(addRequest(request))
      .unwrap()
      .then(() => {
        dispatch(fetchRequestsBuyer());
        setSuccess("Tạo yêu cầu thành công!");
      })
      .catch(() => {
        setError("Tạo yêu cầu thất bại!");
      });
    setFullScreenOpen(false);
    setOpen(false);
  };

  const handleStageChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...stages];
    list[index][name] = value;
    setStages(list);
  };

  const handleStageAdd = () => {
    setStages([
      ...stages,
      { startDate: "", endDate: "", description: "", milestoneFee: 0 },
    ]);
  };

  const handleStageRemove = () => {
    if (stages.length > 1) {
      const list = [...stages];
      list.pop();
      setStages(list);
    }
  };

  console.log("inviteUsers", inviteUsers);

  function handleKeyDown(e) {
    if (e.key !== "Enter") return;
    const value = e.target.value;
    if (!value.trim()) return;
    setSkills([...skills, value]);
    e.target.value = "";
  }

  function removeSkill(index) {
    setSkills(skills.filter((el, i) => i !== index));
  }

  return (
    <div className="buyer_profile">
      <SellerHeader />
      <h1 className="buyer_profile_title">Tạo đề nghị</h1>
      <Container maxWidth="lg" className="profession_form">
        <div className="profession_row">
          <TextField
            id="outlined-select-currency"
            select
            label="Chọn danh mục"
            value={cateId}
            onChange={(e) => setCateId(e.target.value)}
            style={{ width: "30%", margin: "10px" }}
            variant="outlined"
          >
            {listCategory.map((category, index) => (
              <MenuItem key={index} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="outlined-select-currency"
            select
            label="Chọn danh mục con"
            value={subCateId}
            onChange={(e) => setSubCateId(e.target.value)}
            style={{ width: "30%", margin: "10px" }}
            variant="outlined"
          >
            {listCategory
              .find((val) => {
                return val.id == cateId;
              })
              .subCategories.map((subCategory, index) => (
                <MenuItem key={index} value={subCategory.id}>
                  {subCategory.name}
                </MenuItem>
              ))}
          </TextField>
        </div>
        <div className="profession_row">
          <TextField
            id="outlined-select-currency"
            select
            label="Trình độ người bán"
            defaultValue="BEGINNER"
            name="level"
            onChange={(e) => setRecruitLevel(e.target.value)}
            style={{ width: "23%", margin: "10px" }}
            variant="outlined"
          >
            <MenuItem value="BEGINNER">BEGINNER</MenuItem>
            <MenuItem value="ADVANCED">ADVANCED</MenuItem>
            <MenuItem value="COMPETENT">COMPETENT</MenuItem>
            <MenuItem value="PROFICIENT">PROFICIENT</MenuItem>
            <MenuItem value="EXPERT">EXPERT</MenuItem>
          </TextField>
          <div className="tags-input-container">
            {skills.map((skill, index) => (
              <div className="tag-item" key={index}>
                <span className="text">{skill}</span>

                <span className="close" onClick={() => removeSkill(index)}>
                  &times;
                </span>
              </div>
            ))}
            <input
              onKeyDown={handleKeyDown}
              type="text"
              className="tags-input"
              placeholder="Nhập kĩ năng"
            />
          </div>
        </div>
        <div className="profession_row">
          <TextField
            id="outlined-basic"
            label="Tiêu đề"
            variant="outlined"
            style={{ width: "62%" }}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>
        <div className="profession_row">
          <TextField
            id="outlined-basic"
            label="Mô tả"
            variant="outlined"
            multiline
            rows={6}
            style={{ width: "62%" }}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="profession_row">
          {" "}
          <FormControl className="request_form_control">
            <input
              accept="image/*,.doc,.docx,.xlsx,.xls,.csv,.pdf,text/plain"
              className="request_form_input"
              id="request-input-file"
              multiple
              type="file"
              hidden
            />
            <label htmlFor="request-input-file">
              <Button
                variant="contained"
                color="primary"
                component="span"
                startIcon={<CloudUpload />}
              >
                FILE ĐÍNH KÈM
              </Button>
            </label>{" "}
          </FormControl>
        </div>
        <div className="profession_row">
          {" "}
          <Button style={{ height: "70px" }} onClick={handleStageRemove}>
            <RemoveSharp />
          </Button>
          <TextField
            id="outlined-basic"
            label="Số giai đoạn"
            variant="outlined"
            type="number"
            value={stages.length}
            style={{ width: "8%", margin: "10px" }}
            disabled
          />
          <Button style={{ height: "70px" }} onClick={handleStageAdd}>
            <AddSharp />
          </Button>
        </div>
        {stages.map((stage, index) => (
          <div className="profession_itemStage" key={index}>
            <div className="profession_row">
              {stages.length > 1 && <h3>Giai đoạn {index + 1}</h3>}
            </div>
            <div className="profession_row">
              <TextField
                id="outlined-basic"
                label="Ngày bắt đầu"
                variant="outlined"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                style={{ width: "30%", margin: "10px" }}
                name="startDate"
                onChange={(e) => handleStageChange(e, index)}
              />
              <TextField
                id="outlined-basic"
                label="Ngày kết thúc"
                variant="outlined"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                style={{ width: "30%", margin: "10px" }}
                name="endDate"
                onChange={(e) => handleStageChange(e, index)}
              />
            </div>
            <div className="profession_row">
              {" "}
              <TextField
                id="outlined-basic"
                label="Sản phẩm bàn giao"
                variant="outlined"
                multiline
                rows={3}
                style={{ width: "62%" }}
                name="description"
                onChange={(e) => handleStageChange(e, index)}
              />
            </div>
            <div className="profession_row">
              {" "}
              <TextField
                id="outlined-basic"
                label="Chi phí"
                variant="outlined"
                type="number"
                style={{ width: "30%", margin: "10px" }}
                inputProps={{ min: 0 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">$</InputAdornment>
                  ),
                }}
                name="milestoneFee"
                onChange={(e) => handleStageChange(e, index)}
              />
            </div>
          </div>
        ))}
        <div className="profession_row">
          <Typography variant="h4">
            Tổng chi phí :{" "}
            {stages.reduce(
              (total, item) => total + parseInt(item.milestoneFee),
              0
            )}{" "}
            $
          </Typography>
          <TextField
            id="outlined-basic"
            label="Phí hủy hợp đồng"
            variant="outlined"
            type="number"
            style={{ width: "30%", margin: "10px" }}
            inputProps={{ min: 0 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  % Tổng chi phí (={" "}
                  {(stages.reduce(
                    (total, item) => total + parseInt(item.price),
                    0
                  ) *
                    cancleFee) /
                    100}
                  $)
                </InputAdornment>
              ),
            }}
            onChange={(e) => setCancleFee(e.target.value)}
          />
        </div>
        <div className="profession_row">
          {" "}
          <Button
            variant="contained"
            color="primary"
            className="form_right_row_btn"
            onClick={sendOffer}
          >
            Gửi đề nghị
          </Button>
          {error !== "" && <Alert severity="error">{error}</Alert>}
          {success !== "" && <Alert severity="success">{success}</Alert>}
        </div>
      </Container>
      <div className="sections_profile">
        <Contact />
      </div>
    </div>
  );
}
