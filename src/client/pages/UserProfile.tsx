import React, { useEffect, useRef, useState } from "react";
import { connect, useSelector } from "react-redux";
import LandlordProposalButton from "../components/landlord/LandlordProposalButton";
import { RootState } from "../redux/store";
import { toast } from "react-toastify";
import axios from "axios";
import Profile from "../../database/models/profile";
import { cloneDeep } from "lodash";
import { AccountTypeEnum } from "../../../types/enums";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";

const UserProfile = props => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("PersonalDetails");
  const [profile, setProfile] = useState<Profile>();
  const loggedInUsr = useSelector((r: RootState) => r.auth.user);
  const [editingFields, setEditingFields] = useState<any>({});
  const uploadFormRef = useRef<any>();

  const setFieldEditStatus = (field: string, status: boolean) => {
    const stateClone = cloneDeep(editingFields);
    stateClone[field] = status;
    setEditingFields(stateClone);
  };

  const setFieldVal = (field: string, val: string) => {
    const stateClone: any = cloneDeep(profile) || {};
    stateClone[field] = val;
    setProfile(stateClone);
  };

  const submitUpdate = async () => {
    const profileObj = cloneDeep(profile);
    const res = await axios.put("/api/profile/my-profile", profileObj);
    if (res.status === 200) toast.success("Success");
    if (res.status !== 200) toast.error("Error updating");
    console.log(res.data);
    setProfile(res.data);
  };

  const submitPaymentMethodChange = async () => {};

  const fetchProfile = async () => {
    const res = await axios.get("/api/profile/my-profile/");
    if (res.status === 200) {
      if (res.data) setProfile(res.data);
    } else {
      toast.error(JSON.stringify(res.data));
    }
    console.log(res.data);
  };

  const uploadProfilePicture = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(uploadFormRef.current || undefined);
    const body: any = {};
    for (var pair of formData.entries()) {
      body[pair[0]] = pair[1];
    }
    if (!body.file) {
      toast.error("please select a file to upload");
      return;
    }

    const res = await axios.post("/api/profile/upload-picture", body, { headers: { "Content-Type": "multipart/form-data" } });
    if (res.status === 200) {
      toast.success("Upload Success");
      fetchProfile();
    }
    if (res.status !== 200) toast.error("Oops, Something went wrong uploading your file.");
  };

  const getAcctTypeDescription = (accountType: AccountTypeEnum | undefined) => {
    if (accountType === "tenant") return "Looking for a property";
    return accountType;
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const nameDisplay = (profile?.firstName || "Incomplete") + " " + (profile?.lastName ? profile.lastName : "");
  const addressDisplay = `${profile?.addressLine1 || ""}, ${profile?.addressLine2 || "Incomplete"}, ${profile?.settlement || "Incomplete"}, ${
    profile?.city || "Incomplete"
  }`;
  return (
    <div className="container px-lg-5 px-md-5 pt-5">
      <div>
        <h3 className="pb-3 fw-bolder d-flex flex-row" style={{ color: "#032830" }}>
          User Profile
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
          {loggedInUsr?.accountType !== "landlord" && (
            <div className="card border-white">
              <div
                onClick={() => setCurrentView("AccountDetails")}
                className="card-body fw-bolder"
                style={{ color: currentView === "AccountDetails" ? "#087990" : undefined }}
              >
                Account Details
                {currentView == "AccountDetails" && <i className="bi bi-arrow-right" style={{ float: "right", fontWeight: "200px" }}></i>}
              </div>
            </div>
          )}
          {loggedInUsr?.accountType === "landlord" && (
            <div className="card border-white">
              <div
                onClick={() => setCurrentView("AccountDetails")}
                className="card-body border-bottom fw-bolder"
                style={{ color: currentView === "AccountDetails" ? "#087990" : undefined }}
              >
                Account Details
                {currentView == "AccountDetails" && <i className="bi bi-arrow-right" style={{ float: "right", fontWeight: "200px" }}></i>}
              </div>
            </div>
          )}
          {loggedInUsr?.accountType === "landlord" && (
            <div className="card border-white">
              <div
                onClick={() => setCurrentView("Payment")}
                className="card-body border-bottom fw-bolder"
                style={{ color: currentView === "Payment" ? "#087990" : undefined }}
              >
                Receive Payments
                {currentView == "Payment" && <i className="bi bi-arrow-right" style={{ float: "right", fontWeight: "200px" }}></i>}
              </div>
            </div>
          )}
        </div>
        {/*--------------------------------- PERSONAL DETAILS CARD --------------------------------------------------------*/}
        {currentView === "PersonalDetails" && (
          <div
            className="col-12 col-md-9 col-lg-8 pl-2 ml-3 card ms-lg-3 ms-md-3 shadow-lg"
            style={{ padding: "20px", borderRadius: "20px", paddingLeft: "10px" }}
          >
            <h3 style={{ marginLeft: "15px" }}>Personal Details</h3>
            <div className="d-flex py-2 align-items-center">
              <div className="px-3">
                <Avatar style={{ border: "solid 2px black", width: "70px", height: "70px" }} src={profile?.ProfileMedia[0]?.mediaUrl} />
              </div>
              <form ref={uploadFormRef} onSubmit={uploadProfilePicture}>
                <div className="d-flex flex-row flex-wrap align-items-center">
                  <input
                    name="file"
                    className="form-control form-control-sm "
                    style={{ width: "180px", height: "2em", fontSize: "11px" }}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                  />
                  <button className="btn btn-link" type="submit">
                    Upload
                  </button>
                </div>
              </form>
            </div>
            <div className="card" style={{ margin: "15px", borderRadius: "15px" }}>
              <div className="card-body" style={{ backgroundColor: "#f8f9fa", borderRadius: "15px" }}>
                <h5 className="card-title">Name</h5>
                {!editingFields.firstName && nameDisplay}
                {editingFields.firstName && (
                  <div className="name-edit">
                    <label>First Name</label>
                    <input
                      onChange={e => setFieldVal("firstName", e.target.value)}
                      value={profile?.firstName}
                      className="form-control mb-3"
                      type="text"
                      required
                    />
                    <label>Last Name</label>
                    <input onChange={e => setFieldVal("lastName", e.target.value)} value={profile?.lastName} className="form-control" type="text" required />
                  </div>
                )}
                <button className="btn btn-white" style={{ float: "right", color: "#087990" }}>
                  {editingFields.firstName ? (
                    <p
                      onClick={() => {
                        submitUpdate();
                        setFieldEditStatus("firstName", false);
                      }}
                    >
                      save
                      <i className="bi bi-pencil-square" />
                    </p>
                  ) : (
                    <p onClick={() => setFieldEditStatus("firstName", true)}>
                      edit
                      <i className="bi bi-pencil-square" />
                    </p>
                  )}
                </button>
              </div>
            </div>
            <div className="card" style={{ margin: "15px", borderRadius: "15px" }}>
              <div className="card-body" style={{ backgroundColor: "#f8f9fa", borderRadius: "15px" }}>
                <h5 className="card-title">Address</h5>
                {!editingFields?.addressLine1 && addressDisplay}
                {editingFields.addressLine1 && (
                  <div className="name-edit">
                    <label>Line 1</label>
                    <input
                      onChange={e => setFieldVal("addressLine1", e.target.value)}
                      value={profile?.addressLine1}
                      className="form-control mb-3"
                      type="text"
                      required
                    />
                    <label>Line 2</label>
                    <input
                      onChange={e => setFieldVal("addressLine2", e.target.value)}
                      value={profile?.addressLine2}
                      className="form-control"
                      type="text"
                      required
                    />
                    <label>Settlement</label>
                    <input
                      onChange={e => setFieldVal("settlement", e.target.value)}
                      value={profile?.settlement}
                      className="form-control"
                      type="text"
                      required
                    />
                    <label>City</label>
                    <input onChange={e => setFieldVal("city", e.target.value)} value={profile?.city} className="form-control" type="text" required />
                  </div>
                )}
                <button className="btn btn-white" style={{ float: "right", color: "#087990" }}>
                  {editingFields.addressLine1 ? (
                    <p
                      onClick={() => {
                        submitUpdate();
                        setFieldEditStatus("addressLine1", false);
                      }}
                    >
                      save
                      <i className="bi bi-pencil-square" />
                    </p>
                  ) : (
                    <p onClick={() => setFieldEditStatus("addressLine1", true)}>
                      edit
                      <i className="bi bi-pencil-square" />
                    </p>
                  )}
                </button>
              </div>
            </div>
            <div className="card" style={{ margin: "15px", borderRadius: "15px" }}>
              <div className="card-body" style={{ backgroundColor: "#f8f9fa", borderRadius: "15px" }}>
                <h5 className="card-title">Telephone</h5>
                {(!editingFields.phoneNumber && profile?.phoneNumber) || "Incomplete"}
                {editingFields.phoneNumber && (
                  <div className="phone-edit">
                    <input
                      onChange={e => setFieldVal("phoneNumber", e.target.value)}
                      value={profile?.phoneNumber}
                      className="form-control"
                      required
                      type="number"
                    />
                  </div>
                )}
                <button className="btn btn-white" style={{ float: "right", color: "#087990" }}>
                  {editingFields.phoneNumber ? (
                    <p
                      onClick={() => {
                        submitUpdate();
                        setFieldEditStatus("phoneNumber", false);
                      }}
                    >
                      save
                      <i className="bi bi-pencil-square" />
                    </p>
                  ) : (
                    <p onClick={() => setFieldEditStatus("phoneNumber", true)}>
                      edit
                      <i className="bi bi-pencil-square" />
                    </p>
                  )}
                </button>
              </div>
            </div>
            <div className="card" style={{ margin: "15px", borderRadius: "15px" }}>
              <div className="card-body" style={{ backgroundColor: "#f8f9fa", borderRadius: "15px" }}>
                <h5 className="card-title">Email</h5>
                {profile?.User?.email || loggedInUsr?.email}
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
            <div className="card" style={{ margin: "15px", borderRadius: "15px" }}>
              <div className="card-body" style={{ backgroundColor: "#f8f9fa", borderRadius: "15px" }}>
                <h5 className="card-title">Your Password</h5>
                **************
                <button className="btn btn-white" style={{ float: "right", color: "#055160" }}>
                  <p onClick={() => navigate("/forget-password/null?status=pending")}>
                    {" "}
                    edit <i className="bi bi-pencil-square" />{" "}
                  </p>
                </button>
              </div>
            </div>
            <div className="card" style={{ margin: "15px", borderRadius: "15px" }}>
              <div className="card-body" style={{ backgroundColor: "#f8f9fa", borderRadius: "15px" }}>
                <h5 className="card-title text-muted">Account Type</h5>
                {getAcctTypeDescription(profile?.User.accountType || loggedInUsr?.accountType)}
              </div>
            </div>
          </div>
        )}
        {currentView === "Payment" && (
          <div
            className="col-12 col-md-9 col-lg-8 pl-2 ml-3 card ms-lg-3 ms-md-3 shadow-lg"
            style={{ padding: "20px", borderRadius: "20px", paddingLeft: "10px" }}
          >
            <div className="card" style={{ margin: "15px", borderRadius: "15px" }}>
              <div className="card-body" style={{ backgroundColor: "#f8f9fa", borderRadius: "15px" }}>
                <h5 className="card-title">Link Your Bank Account</h5>
                {!editingFields.payment && "details...."}
                {editingFields.payment && (
                  <div className="name-edit">
                    <label>Bank Account Type</label>
                    <input className="form-control mb-3" type="text" required />
                    <label>Account Holder Name</label>
                    <input className="form-control" type="text" required />
                    <label>Routing Number</label>
                    <input className="form-control" type="text" required />
                    <label>Account Number</label>
                    <input className="form-control" type="text" required />
                  </div>
                )}
                <button className="btn btn-white" style={{ float: "right", color: "#087990" }}>
                  {editingFields.payment ? (
                    <p
                      onClick={() => {
                        submitPaymentMethodChange();
                        setFieldEditStatus("payment", false);
                      }}
                    >
                      save
                      <i className="bi bi-pencil-square" />
                    </p>
                  ) : (
                    <p onClick={() => setFieldEditStatus("payment", true)}>
                      edit
                      <i className="bi bi-pencil-square" />
                    </p>
                  )}
                </button>
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
