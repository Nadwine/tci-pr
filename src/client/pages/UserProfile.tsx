import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import LandlordProposalButton from "../components/LandlordProposalButton";
import { RootState } from "../redux/store";
import { toast } from "react-toastify";
import axios from "axios";
import Profile from "../../database/models/profile";

const UserProfile = props => {
  const [currentView, setCurrentView] = useState("PersonalDetails");
  const [profile, setProfile] = useState<Profile>();
  const loggedInUsr = useSelector((r: RootState) => r.auth.user);

  const updateProfile = async () => {
    // TESTING WITH RANDOMLY GENERATED VALUES PLEASE UPDATE TO STATE VALUES FROM TEXT BOXES
    const body = {
      firstName: "firsttest" + (Math.random() + 1).toString(36).substring(7),
      lastName: "lasttest" + (Math.random() + 1).toString(36).substring(7),
      phoneNumber: "1234567" + (Math.random() + 1).toString(36).substring(7),
      addressLine1: "addl1" + (Math.random() + 1).toString(36).substring(7),
      addressLine2: "assl2" + (Math.random() + 1).toString(36).substring(7),
      city: "cty" + (Math.random() + 1).toString(36).substring(7),
      settlement: "seltment" + (Math.random() + 1).toString(36).substring(7),
      postcode: "postc" + (Math.random() + 1).toString(36).substring(7),
      country: "count" + (Math.random() + 1).toString(36).substring(7)
    };
    const res = await axios.put("/api/profile/my-profile", body);
    if (res.status === 200) toast.success("Success");
    if (res.status !== 200) toast.error("Error updating");
    console.log(res.data);
  };

  const fetchProfile = async () => {
    const res = await axios.get("/api/profile/my-profile/");
    if (res.status === 200) {
      if (res.data?.profile) setProfile(res.data.profile);
    } else {
      toast.error(JSON.stringify(res.data));
    }
    console.log(res.data);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="container px-lg-5 px-md-5 pt-5">
      <div>
        <h3 className="pb-3 fw-bolder" style={{ color: "#032830" }}>
          User Profile <br />
          <button onClick={() => updateProfile()}>Test Random Update</button>
        </h3>
      </div>

      <div className="col-12 d-flex flex-wrap w-100">
        <div className="col-12 col-md-3 col-lg-3 mb-2 card shadow-lg p-2" style={{ backgroundColor: "white", borderRadius: "20px", height: "fit-content" }}>
          <div className="card border-white">
            <div
              onClick={() => setCurrentView("PersonalDetails")}
              className="card-body border-bottom fw-bolder"
              style={{ color: currentView === "PersonalDetails" ? "#087990" : undefined }}
            >
              Personal Details
              {currentView == "PersonalDetails" && <i className="bi bi-arrow-right" style={{ float: "right", fontWeight: "200px" }}></i>}
            </div>
          </div>
          <div
            onClick={() => setCurrentView("AccountDetails")}
            style={{ color: currentView === "AccountDetails" ? "#087990" : undefined }}
            className="card border-white"
          >
            <div className="card-body fw-bold">
              Account Details
              {currentView == "AccountDetails" && <i className="bi bi-arrow-right" style={{ float: "right", fontWeight: "200px" }}></i>}
            </div>
          </div>
        </div>
        {/*--------------------------------- PERSONAL DETAILS CARD --------------------------------------------------------*/}
        {currentView === "PersonalDetails" && (
          <div
            className="col-12 col-md-9 col-lg-8 pl-2 ml-3 card ms-lg-3 ms-md-3 shadow-lg"
            style={{ padding: "20px", borderRadius: "20px", paddingLeft: "10px" }}
          >
            <h3 style={{ marginLeft: "15px" }}>Personal Details</h3>
            <div className="card" style={{ margin: "15px" }}>
              <div className="card-body" style={{ backgroundColor: "#f8f9fa", borderRadius: "15px" }}>
                <h5 className="card-title">Name</h5>
                profile.firstName - profile.lastName
                <button className="btn btn-white" style={{ float: "right", color: "#087990" }}>
                  edit <i className="bi bi-pencil-square" />
                </button>
              </div>
            </div>
            <div className="card" style={{ margin: "15px" }}>
              <div className="card-body" style={{ backgroundColor: "#f8f9fa", borderRadius: "15px" }}>
                <h5 className="card-title">Email</h5>
                profile.User.email
                <button className="btn btn-white" style={{ float: "right", color: "#087990" }}>
                  edit <i className="bi bi-pencil-square" />
                </button>
              </div>
            </div>
            <div className="card" style={{ margin: "15px" }}>
              <div className="card-body" style={{ backgroundColor: "#f8f9fa", borderRadius: "15px" }}>
                <h5 className="card-title">Address</h5>
                profile.address
                <button className="btn btn-white" style={{ float: "right", color: "#087990" }}>
                  edit <i className="bi bi-pencil-square" />
                </button>
              </div>
            </div>
            <div className="card" style={{ margin: "15px" }}>
              <div className="card-body" style={{ backgroundColor: "#f8f9fa", borderRadius: "15px" }}>
                <h5 className="card-title">Telephone</h5>
                profile.phoneNumber
                <button className="btn btn-white" style={{ float: "right", color: "#087990" }}>
                  edit <i className="bi bi-pencil-square" />
                </button>
              </div>
            </div>
          </div>
        )}
        {/*!--------------------------------- ACCOUNT DETAILS CARD -------------------------------------------------------- */}
        {currentView === "AccountDetails" && (
          <div
            className="col-12 col-md-9 col-lg-8 pl-2 ml-3 card ms-lg-3 ms-md-3 shadow-lg"
            style={{ padding: "20px", borderRadius: "20px", paddingLeft: "10px" }}
          >
            <h3 style={{ marginLeft: "15px" }}>Account Details</h3>
            <div className="card" style={{ margin: "15px" }}>
              <div className="card-body" style={{ backgroundColor: "#f8f9fa", borderRadius: "15px" }}>
                <h5 className="card-title">Your Password</h5>
                **************
                <button className="btn btn-white" style={{ float: "right", color: "#055160" }}>
                  edit <i className="bi bi-pencil-square" />
                </button>
              </div>
            </div>
            <div className="card" style={{ margin: "15px" }}>
              <div className="card-body" style={{ backgroundColor: "#f8f9fa", borderRadius: "15px" }}>
                <h5 className="card-title text-muted">Account Type</h5>
                user.accountType
              </div>
            </div>
          </div>
        )}
      </div>
      {loggedInUsr?.accountType === "landlord" && <LandlordProposalButton />}
    </div>
  );
};

export default connect()(UserProfile);
