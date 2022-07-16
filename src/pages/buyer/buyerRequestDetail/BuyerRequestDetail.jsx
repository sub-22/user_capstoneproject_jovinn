import {
  Button,
  Container,
  MenuItem,
  Slide,
  TextField,
  makeStyles,
  InputAdornment,
  FormControl,
} from "@material-ui/core";
import {
  CloudUpload,
  AddSharp,
  RemoveSharp,
  DeleteOutlineSharp,
} from "@material-ui/icons";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import BuyerHeader from "../../../components/buyer/buyerHeader/BuyerHeader";
import Contact from "../../../components/guest/contact/Contact";
import { selectAllCategories } from "../../../redux/categorySlice";
import "./buyerRequestDetail.scss";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

export default function BuyerRequestDetail() {
  const listCategory = useSelector(selectAllCategories);
  const [cateId, setCateId] = useState(listCategory[0].id);
  const [subCateId, setSubCateId] = useState(
    listCategory[0].subCategories[0].id
  );

  const [description, setDescription] = useState("");
  const [stages, setStages] = useState([
    { dateFrom: "", dateTo: "", product: "", price: "" },

    { dateFrom: "", dateTo: "", product: "", price: "" },
  ]);
  const handleStageChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...stages];
    list[index][name] = value;
    setStages(list);
  };

  const handleStageAdd = () => {
    setStages([
      ...stages,
      { dateFrom: "", dateTo: "", product: "", price: "" },
    ]);
  };

  const handleStageRemove = () => {
    if (stages.length > 1) {
      const list = [...stages];
      list.pop();
      setStages(list);
    }
  };

  const [skills, setSkills] = useState([{ name: "", level: "" }]);
  const handleSkillChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...skills];
    list[index][name] = value;
    setSkills(list);
  };

  const handleSkillAdd = () => {
    setSkills([...skills, { name: "", level: "" }]);
  };

  const handleSkillRemove = () => {
    if (skills.length > 1) {
      const list = [...skills];
      list.pop();
      setSkills(list);
    }
  };
  return (
    <div className="buyer_profile">
      <BuyerHeader />
      <h1 className="buyer_profile_title">Chi tiết yêu cầu</h1>
      <Container maxWidth="lg" className="profession_form">
        {" "}
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
        <div
          className="profession_row"
          // style={{ border: "2px solid rgb(238, 225, 225)" }}
        >
          {skills.map((stage, index) => (
            <div className="profession_rowLeft">
              <TextField
                id="outlined-basic"
                label="Kĩ Năng"
                variant="outlined"
                style={{ width: "30%", margin: "10px" }}
                name="name"
                defaultValue="HTML"
                onChange={(e) => handleSkillChange(e, index)}
              />
              <TextField
                id="outlined-select-currency"
                select
                label="Trình độ"
                defaultValue="BEGINNER"
                name="level"
                onChange={(e) => handleSkillChange(e, index)}
                style={{ width: "23%", margin: "10px" }}
                variant="outlined"
              >
                <MenuItem value="BEGINNER">BEGINNER</MenuItem>
                <MenuItem value="ADVANCED">ADVANCED</MenuItem>
                <MenuItem value="COMPETENT">COMPETENT</MenuItem>
                <MenuItem value="PROFICIENT">PROFICIENT</MenuItem>
                <MenuItem value="EXPERT">EXPERT</MenuItem>
              </TextField>
              {skills.length > 1 && (
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ height: "55px", margin: "10px" }}
                  onClick={handleSkillRemove}
                >
                  <DeleteOutlineSharp />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outlined"
            color="primary"
            // style={{ width: "10%", margin: "10px" }}
            onClick={handleSkillAdd}
          >
            <AddSharp />
            Thêm kĩ năng
          </Button>
        </div>
        <div className="profession_row">
          <TextField
            id="outlined-basic"
            label="Mô tả"
            variant="outlined"
            multiline
            rows={3}
            style={{ width: "62%" }}
            defaultValue="Tôi muốn thật nhiều tiền"
            InputLabelProps={{
              shrink: true,
            }}
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
          <div className="profession_itemStage">
            {stages.length > 1 && (
              <div className="profession_row">
                <h3>Giai đoạn {index + 1}</h3>
              </div>
            )}

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
                name="dateFrom"
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
                name="dateTo"
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
                name="product"
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">$</InputAdornment>
                  ),
                }}
                name="price"
                onChange={(e) => handleStageChange(e, index)}
              />
            </div>
          </div>
        ))}
        <div className="profession_row">
          {" "}
          <TextField
            id="outlined-basic"
            label="Tổng chi phí"
            variant="outlined"
            type="number"
            style={{ width: "30%", margin: "10px" }}
            InputProps={{
              endAdornment: <InputAdornment position="end">$</InputAdornment>,
            }}
            // onChange={(e) => setDescriptionBio(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Phí hủy hợp đồng"
            variant="outlined"
            type="number"
            style={{ width: "30%", margin: "10px" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">% Tổng chi phí</InputAdornment>
              ),
            }}
            // onChange={(e) => setDescriptionBio(e.target.value)}
          />
        </div>
        <div className="profession_row">
          {" "}
          <Button
            variant="contained"
            color="primary"
            className="form_right_row_btn"
          >
            Cập nhật
          </Button>
        </div>
        <div
          className="profession_row"
          style={{ border: "2px solid rgb(238, 225, 225)" }}
        >
          <Link to="/buyerHome/listSeller/test">
            <Button
              variant="outlined"
              color="primary"
              style={{ marginLeft: "20px" }}
              // onClick={handleOpen}.
            >
              Xem danh sách ứng tuyển
            </Button>
          </Link>
          <Link to="/buyerHome/manageOffer/test">
            <Button
              variant="outlined"
              color="primary"
              style={{ marginLeft: "20px" }}
              // onClick={handleOpen}.
            >
              Xem danh sách đề nghị
            </Button>
          </Link>
        </div>
      </Container>
      <div className="sections_profile">
        <Contact />
      </div>
    </div>
  );
}
