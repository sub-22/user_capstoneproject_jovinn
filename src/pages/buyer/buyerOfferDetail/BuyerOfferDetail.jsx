import {
  Button,
  Container,
  TextField,
  InputAdornment,
  makeStyles,
} from "@material-ui/core";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import BuyerHeader from "../../../components/buyer/buyerHeader/BuyerHeader";
import Contact from "../../../components/guest/contact/Contact";
import { selectOfferById } from "../../../redux/requestSlice";
import { selectWallet } from "../../../redux/userSlice";
import "./buyerOfferDetail.scss";
const useStyles = makeStyles((theme) => ({
  disabledInput: {
    "& .MuiInputBase-root.Mui-disabled": {
      color: "black",
    },
  },
}));
export default function BuyerOfferDetail() {
  const { offerId } = useParams();
  const offerDetail = useSelector((state) => selectOfferById(state, offerId));
  console.log("offerDetail", offerDetail);
  const wallet = useSelector(selectWallet);
  const navigate = useNavigate();
  const classes = useStyles();
  const acceptOffer = () => {
    if (offerDetail.offerPrice > wallet.withdraw) {
      toast.error("Không đủ tiền để chấp nhận đề nghị này!");
    } else {
      navigate("/buyerHome/paymentOffer", { state: { offerDetail } });
    }
  };

  return (
    <div className="buyer_profile">
      <BuyerHeader />
      <h1 className="buyer_profile_title">Chi tiết đề nghị</h1>
      <Container maxWidth="lg" className="profession_form">
        {" "}
        <div className="profession_row">
          <TextField
            id="outlined-basic"
            label="Mô tả"
            variant="outlined"
            multiline
            rows={6}
            style={{ width: "62%" }}
            className={classes.disabledInput}
            defaultValue={offerDetail.descriptionBio}
          />
        </div>
        <div className="profession_row">
          <TextField
            style={{
              marginRight: "5px",
            }}
            variant="outlined"
            label="Số ngày giao"
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            className={classes.disabledInput}
            defaultValue={offerDetail.totalDeliveryTime}
            required
          />
          <TextField
            variant="outlined"
            label="Chi phí ($)"
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            className={classes.disabledInput}
            defaultValue={offerDetail.offerPrice}
            required
          />
        </div>
        <div className="profession_row">
          <TextField
            id="outlined-basic"
            label="Phí hủy hợp đồng"
            variant="outlined"
            type="number"
            style={{ width: "30%", margin: "10px" }}
            className={classes.disabledInput}
            inputProps={{ min: 0 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">% Tổng chi phí</InputAdornment>
              ),
            }}
            defaultValue={offerDetail.cancelFee}
          />
        </div>
        <div className="profession_row">
          <h3>Trạng thái: {offerDetail.offerRequestStatus}</h3>
        </div>
        <div className="profession_row">
          {offerDetail.offerRequestStatus !== "ACCEPTED" && (
            <Button
              variant="contained"
              color="primary"
              className="form_right_row_btn"
              onClick={acceptOffer}
            >
              Chấp nhận đề nghị
            </Button>
          )}

          <Button
            variant="contained"
            color="default"
            className="form_right_row_btn"
            style={{ marginLeft: "20px" }}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
        </div>
      </Container>
      <ToastContainer limit={3000} position="bottom-right" />
      <div className="sections_profile">
        <Contact />
      </div>
    </div>
  );
}
