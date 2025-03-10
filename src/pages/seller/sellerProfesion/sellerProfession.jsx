import React, { useEffect, useState } from "react";
import Contact from "../../../components/guest/contact/Contact";
import "./sellerProfession.scss";
import { ToastContainer, toast } from "react-toastify";
import {
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  useTheme,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { Add, Delete } from "@material-ui/icons";
import {
  fetchCurrentUser,
  joinSeller,
  selectCurrentUser,
} from "../../../redux/userSlice";
import Alert from "@material-ui/lab/Alert";
import BuyerHeader from "../../../components/buyer/buyerHeader/BuyerHeader";
import {
  fetchSkills,
  selectAllCategories,
  selectAllSkills,
} from "../../../redux/categorySlice";
import { clearMessage } from "../../../redux/message";
export default function SellerProfession() {
  const listSkills = useSelector(selectAllSkills);
  const { user } = useSelector((state) => state.auth);
  const currentUser = useSelector(selectCurrentUser);
  const listCategory = useSelector(selectAllCategories);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [descriptionBio, setDescriptionBio] = useState("");
  const [checkError, setCheckError] = useState(false);
  const { message } = useSelector((state) => state.message);
  const [brandName, setBrandName] = useState("");
  const [skills, setSkills] = useState([]);
  const [edus, setEdus] = useState([
    { title: "", universityName: "", fromDate: "", major: "", toDate: "" },
  ]);
  const [edusError, setEdusError] = useState([
    { title: "", universityName: "", fromDate: "", major: "", toDate: "" },
  ]);
  const [certificates, setCertificates] = useState([
    { title: "", name: "", linkCer: "" },
  ]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    dispatch(clearMessage());
    if (currentUser.joinSellingAt) navigate("/sellerHome");
  }, [dispatch]);
  function handleKeyDown(e) {
    if (e.key !== "Enter") return;
    const value = e.target.value;
    if (!value.trim()) return;
    setSkills([...skills, { name: value }]);
    e.target.value = "";
  }
  function handleChooseSkill(value) {
    if (!value.trim()) return;
    setSkills([...skills, { name: value }]);
    value = "";
  }

  function removeSkill(index) {
    setSkills(skills.filter((el, i) => i !== index));
  }

  const handleEduChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...edus];
    const list2 = [...edusError];
    list[index][name] = value;
    if (value != "") {
      const selected = new Date(e.target.value);
      const maxDate = new Date();
      maxDate.setHours(0, 0, 0, 0);
      maxDate.setDate(maxDate.getDate() + 1);
      if (name == "fromDate" && selected > maxDate) {
        list2[index][name] = "Ngày bắt đầu phải trước ngày hiện tại";
      } else if (
        name == "fromDate" &&
        selected > new Date(edus[index].toDate)
      ) {
        list2[index][name] = "Ngày bắt đầu phải trước ngày kết thúc";
      } else if (name == "fromDate") {
        list2[index][name] = "";
        list2[index].toDate = "";
      }

      if (name == "toDate" && selected < new Date(edus[index].fromDate)) {
        list2[index][name] = "Ngày kết thúc phải sau ngày bắt đầu";
      } else if (name == "toDate") {
        list2[index][name] = "";
        list2[index].fromDate = "";
      }
    }
    setEdus(list);
  };

  const handleEduAdd = () => {
    setEdus([
      ...edus,
      { title: "", universityName: "", major: "", fromDate: "", toDate: "" },
    ]);
    setEdusError([
      ...edusError,
      { title: "", universityName: "", major: "", fromDate: "", toDate: "" },
    ]);
  };

  const handleEduRemove = (index) => {
    const list = [...edus];
    list.splice(index, 1);
    setEdus(list);
    const list2 = [...edusError];
    list2.splice(index, 1);
    setEdusError(list2);
  };
  const handleCerChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...certificates];
    list[index][name] = value;
    setCertificates(list);
  };

  const handleCerAdd = () => {
    setCertificates([...certificates, { title: "", name: "", linkCer: "" }]);
  };

  const handleCerRemove = (index) => {
    const list = [...certificates];
    list.splice(index, 1);
    setCertificates(list);
  };

  const myArray = skills.map((str, index) => ({ name: str }));
  const info = {
    descriptionBio: descriptionBio,
    brandName: brandName,
    skills: myArray,
    educations: edus,
    certificates: certificates,
  };
  const handleSaveInfo = () => {
    setError("");
    setSuccess("");
    setCheckError(true);
    console.log("brandName", brandName);
    console.log("descriptionBio", descriptionBio);
    console.log("skills", skills);
    console.log("edus", edus);
    console.log("certificates", certificates);
    const list2 = [...edusError];
    let check = true;
    if (
      descriptionBio.length < 1 ||
      descriptionBio.length > 255 ||
      brandName.length < 1 ||
      brandName.length > 30
    ) {
      check = false;
    } else if (skills.length == 0) {
      setError("Chưa nhập kĩ năng !");
      check = false;
    } else {
      edus.map((item, index) => {
        if (item.title.length < 1 || item.title.length > 50) {
          // setError("Chưa nhập tiêu đề của học vấn " + parseInt(index + 1));
          check = false;
        } else if (
          item.universityName.length < 1 ||
          item.universityName.length > 50
        ) {
          // setError("Chưa nhập tên trường của học vấn " + parseInt(index + 1));
          check = false;
        } else if (item.major.length < 1 || item.major.length > 50) {
          // setError("Chưa nhập tên ngành của học vấn " + parseInt(index + 1));
          check = false;
        } else if (item.fromDate == "") {
          // setError("Chưa nhập ngày bắt đầu của học vấn " + parseInt(index + 1));
          check = false;
          list2[index].fromDate = "Không được để trống";
        } else if (item.toDate == "") {
          // setError(
          //   "Chưa nhập ngày kết thúc của học vấn " + parseInt(index + 1)
          // );
          check = false;
          list2[index].toDate = "Không được để trống";
        }
      });
      certificates.map((item, index) => {
        if (item.title == "") {
          // setError("Chưa nhập tiêu đề của chứng chỉ " + parseInt(index + 1));
          check = false;
        } else if (item.name == "") {
          // setError("Chưa nhập tên của chứng chỉ " + parseInt(index + 1));
          check = false;
        } else if (item.linkCer == "") {
          // setError("Chưa nhập link của chứng chỉ " + parseInt(index + 1));
          check = false;
        }
      });
    }
    setEdusError(list2);
    if (check) {
      edusError.map((item, index) => {
        if (
          item.toDate == "" &&
          item.fromDate == "" &&
          edusError.length - 1 == index
        ) {
          dispatch(joinSeller(info))
            .unwrap()
            .then(() => {
              // setSuccessful(true);
              dispatch(fetchCurrentUser());
              navigate("/sellerHome/createService", {
                state: { mess: "Tạo thông tin nâng cao thành công!" },
              });
            })

            .catch(() => {
              toast.error(message);
            });
        }
      });
    }
  };
  //skill

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  const theme = useTheme();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log("value", value);

    console.log("value", myArray);
    setSkills(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    // setSkills([...skills, { name: value }]);
  };
  useEffect(() => {
    dispatch(fetchSkills());
  }, []);
  console.log(listSkills);
  console.log(skills);
  return (
    <div className="buyer_profile">
      <BuyerHeader />
      <h1 className="buyer_profile_title">Thông tin nâng cao</h1>
      <Container maxWidth="lg" className="profession_form">
        {" "}
        <div className="profession_row">
          <TextField
            id="outlined-basic"
            label="Lời giới thiệu"
            variant="outlined"
            style={{ width: "75%", marginRight: "20px" }}
            onChange={(e) => setDescriptionBio(e.target.value)}
            error={
              !/^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_\s]{1,255}$/.test(
                descriptionBio
              ) && checkError
            }
            helperText={
              !/^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_\s]{1,255}$/.test(
                descriptionBio
              ) &&
              checkError &&
              "Không được để trống và tối đa 255 kí tự !"
            }
          />
          <TextField
            id="outlined-basic"
            label="Tên thương hiệu"
            variant="outlined"
            style={{ width: "23%" }}
            onChange={(e) => setBrandName(e.target.value)}
            error={
              !/^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_\s]{1,30}$/.test(
                brandName
              ) && checkError
            }
            helperText={
              !/^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_\s]{1,30}$/.test(
                brandName
              ) &&
              checkError &&
              "Không được để trống và tối đa 30 kí tự !"
            }
          />
        </div>
        <div className="profession_row">
          {" "}
          <FormControl style={{ width: "96%" }}>
            <InputLabel id="demo-multiple-chip-label">Kỹ năng</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              value={skills}
              multiple
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {listSkills.map((skill, index) => (
                <MenuItem
                  key={index}
                  value={skill.name}
                  // style={getStyles(skill.name, skills, theme)}
                >
                  {skill.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div
          className="profession_row"
          style={{ border: "2px solid  rgb(238, 225, 225)" }}
        >
          <h2 style={{ marginTop: "10px" }}>
            Học vấn{" "}
            <Button
              variant="contained"
              style={{ marginBottom: "10px" }}
              onClick={handleEduAdd}
            >
              Thêm <Add />
            </Button>
          </h2>
          {edus.map((edu, index) => (
            <div className="profession_row_item">
              <TextField
                id="outlined-basic"
                label="Tiêu đề"
                variant="outlined"
                style={{ width: "26%" }}
                name="title"
                onChange={(e) => handleEduChange(e, index)}
                error={
                  !/^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_\s]{1,50}$/.test(
                    edu.title
                  ) && checkError
                }
                helperText={
                  !/^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_\s]{1,50}$/.test(
                    edu.title
                  ) &&
                  checkError &&
                  "Không được để trống và tối đa 50 kí tự!"
                }
              />

              <TextField
                id="outlined-basic"
                label="Trường"
                variant="outlined"
                name="universityName"
                style={{ width: "22%" }}
                onChange={(e) => handleEduChange(e, index)}
                error={
                  !/^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_\s]{1,50}$/.test(
                    edu.universityName
                  ) && checkError
                }
                helperText={
                  !/^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_\s]{1,50}$/.test(
                    edu.universityName
                  ) &&
                  checkError &&
                  "Không được để trống và tối đa 50 kí tự!"
                }
              />
              <TextField
                id="outlined-basic"
                label="Ngành"
                variant="outlined"
                name="major"
                style={{ width: "22%" }}
                onChange={(e) => handleEduChange(e, index)}
                error={
                  !/^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_\s]{1,50}$/.test(
                    edu.major
                  ) && checkError
                }
                helperText={
                  !/^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_\s]{1,50}$/.test(
                    edu.major
                  ) &&
                  checkError &&
                  "Không được để trống và tối đa 50 kí tự!"
                }
              />
              <TextField
                id="outlined-basic"
                label="Ngày bắt đầu "
                variant="outlined"
                type="date"
                style={{ width: "12%" }}
                InputLabelProps={{
                  shrink: true,
                }}
                name="fromDate"
                onChange={(e) => handleEduChange(e, index)}
                error={
                  (edusError[index].fromDate.length > 0 && checkError) ||
                  (edu.fromDate.length == 0 && checkError)
                }
                helperText={
                  (checkError && edusError[index].fromDate) ||
                  (edu.fromDate.length == 0 &&
                    checkError &&
                    "Ngày kết thúc không hợp lệ!")
                }
              />
              <TextField
                id="outlined-basic"
                label="Ngày tốt nghiệp "
                variant="outlined"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                style={{ width: "12%" }}
                name="toDate"
                onChange={(e) => handleEduChange(e, index)}
                error={
                  (edusError[index].toDate.length > 0 && checkError) ||
                  (edu.toDate.length == 0 && checkError)
                }
                helperText={
                  (checkError && edusError[index].toDate) ||
                  (edu.toDate.length == 0 &&
                    checkError &&
                    "Ngày kết thúc không hợp lệ!")
                }
              />
              {edus.length !== 1 && (
                <Button
                  variant="contained"
                  style={{ width: "5%", height: "55px" }}
                  onClick={() => handleEduRemove(index)}
                >
                  Xóa <Delete />
                </Button>
              )}
            </div>
          ))}
        </div>
        <div
          className="profession_row"
          style={{ border: "2px solid  rgb(238, 225, 225)" }}
        >
          {" "}
          <h2 style={{ marginTop: "10px" }}>
            Chứng chỉ{" "}
            <Button
              variant="contained"
              style={{ marginBottom: "10px" }}
              onClick={handleCerAdd}
            >
              {" "}
              Thêm <Add />
            </Button>
          </h2>
          {certificates.map((cer, index) => (
            <div className="profession_row_item">
              <TextField
                id="outlined-basic"
                label="Nội dung"
                variant="outlined"
                style={{ width: "30%" }}
                name="title"
                onChange={(e) => handleCerChange(e, index)}
                error={cer.title.length == 0 && checkError}
                helperText={
                  cer.title.length == 0 &&
                  checkError &&
                  "Chưa nhập nội dung chứng chỉ!"
                }
              />
              <TextField
                id="outlined-basic"
                label="Tên chứng chỉ"
                variant="outlined"
                style={{ width: "30%" }}
                name="name"
                onChange={(e) => handleCerChange(e, index)}
                error={cer.name.length == 0 && checkError}
                helperText={
                  cer.name.length == 0 &&
                  checkError &&
                  "Chưa nhập tên chứng chỉ!"
                }
              />
              <TextField
                id="outlined-basic"
                label="Liên kết"
                variant="outlined"
                style={{ width: "30%" }}
                name="linkCer"
                onChange={(e) => handleCerChange(e, index)}
                error={cer.linkCer.length == 0 && checkError}
                helperText={
                  cer.linkCer.length == 0 &&
                  checkError &&
                  "Chưa nhập liên kết chứng chỉ!"
                }
              />
              <Button
                variant="contained"
                style={{ width: "10%", height: "55px" }}
                onClick={() => handleCerRemove(index)}
              >
                Xóa <Delete />
              </Button>
            </div>
          ))}
        </div>
        <div className="profession_row">
          {" "}
          <Button variant="contained" color="primary" onClick={handleSaveInfo}>
            Lưu thông tin
          </Button>
        </div>
        {error !== "" && <Alert severity="error">{error}</Alert>}
        {message !== "" && <Alert severity="error">{message}</Alert>}
      </Container>
      <ToastContainer position="bottom-right" autoClose={5000} />
      <div className="sections_profile">
        <Contact />
      </div>
    </div>
  );
}
