import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import LandlordProposalButton from "../components/LandlordProposalButton";
import { RootState } from "../redux/store";
import { toast } from "react-toastify";
import axios from "axios";
import Profile from "../../database/models/profile";
import { cloneDeep } from "lodash";

const UserProfile = props => {
  const [currentView, setCurrentView] = useState("PersonalDetails");
  const [profile, setProfile] = useState<Profile>();
  const loggedInUsr = useSelector((r: RootState) => r.auth.user);
  const [editingFields, setEditingFields] = useState<any>({});

  const setFieldEditStatus = (field: string, status: boolean) => {
    const stateClone = cloneDeep(editingFields);
    stateClone[field] = status;
    setEditingFields(stateClone);
  };

  const setFieldVal = (field: string, val: string) => {
    const stateClone: any = cloneDeep(profile);
    stateClone[field] = val;
    setProfile(stateClone);
  };

  const submitUpdate = async () => {
    const res = await axios.put("/api/profile/my-profile", profile);
    if (res.status === 200) toast.success("Success");
    if (res.status !== 200) toast.error("Error updating");
    console.log(res.data);
    setProfile(res.data);
  };

  const fetchProfile = async () => {
    const res = await axios.get("/api/profile/my-profile/");
    if (res.status === 200) {
      if (res.data) setProfile(res.data);
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
                {!editingFields.firstName && profile?.firstName + " " + profile?.lastName}
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
                        setFieldEditStatus("firstName", false);
                        submitUpdate();
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
            <div className="card" style={{ margin: "15px" }}>
              <div className="card-body" style={{ backgroundColor: "#f8f9fa", borderRadius: "15px" }}>
                <h5 className="card-title">Address</h5>
                {!editingFields?.addressLine1 && `${profile?.addressLine1}, ${profile?.addressLine2}, ${profile?.settlement}, ${profile?.city}`}
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
                        setFieldEditStatus("addressLine1", false);
                        submitUpdate();
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
            <div className="card" style={{ margin: "15px" }}>
              <div className="card-body" style={{ backgroundColor: "#f8f9fa", borderRadius: "15px" }}>
                <h5 className="card-title">Telephone</h5>
                {!editingFields.phoneNumber && profile?.phoneNumber}
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
                        setFieldEditStatus("phoneNumber", false);
                        submitUpdate();
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
            <div className="card" style={{ margin: "15px" }}>
              <div className="card-body" style={{ backgroundColor: "#f8f9fa", borderRadius: "15px" }}>
                <h5 className="card-title">Email</h5>
                {profile?.User.email || loggedInUsr?.email}
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
                {profile?.User.accountType}
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
