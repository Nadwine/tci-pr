import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Tenancy from "../../database/models/tenancy";
import dayjs from "dayjs";
import axios from "axios";

export const MyTenancy = props => {
  const [tenancies, setTenancies] = useState<Tenancy[]>();

  const fetchTenancy = async () => {
    const res = await axios.get("/api/tenancy/user");
    if (res.status === 200) setTenancies(res.data);
  };
  useEffect(() => {
    fetchTenancy();
  }, []);

  return (
    <div className="px-md-5">
      <h4 className="py-4">My Tenancies</h4>
      {!tenancies && (
        <div className="my-3 text-center" style={{ justifyItems: "center" }}>
          {" "}
          <div>
            <h4 className="fw-bolder">You have no active tenancies</h4>
          </div>
          <div>
            <img src="/static/no-message.png"></img>
          </div>{" "}
        </div>
      )}
      <div>
        {tenancies?.map((currTenancy, i) => {
          const leadTenant = currTenancy?.Tenants?.find(t => t.id === currTenancy.leadTenantid);
          return (
            <div key={i}>
              <div className="pb-5">
                <h5>
                  {currTenancy?.addressString}
                  <span style={{ color: "#8d8d8d", paddingLeft: "0.5em", WebkitTextStroke: "0.7px" }}>
                    - {"("} {currTenancy?.tenancyStatus} {")"}
                  </span>
                </h5>
              </div>
              <div className="mx-5">
                <h5>Tenants</h5>
                <table className="table table table-borderless">
                  <tbody>
                    {currTenancy?.Tenants.map((currTenant, i) => (
                      <tr key={i}>
                        <td>
                          {currTenant.firstName} {currTenant.lastName}
                        </td>
                        <td>Signature: {currTenant.rentalAgreementDate ? currTenancy.rentalAgreementDate : "pending"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mx-5">
                <h5>Landlord</h5>
                <table className="table table table-borderless">
                  <tbody>
                    <tr>
                      <td>
                        {currTenancy?.PropertyForRent.Listing.ListingLandlord?.firstName} {currTenancy?.PropertyForRent.Listing.ListingLandlord?.lastName}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <hr />
              </div>
              <div className="mx-5">
                <h5>Tenancy</h5>
                <table className="table table table-borderless">
                  <thead>
                    <tr style={{ color: "#8d8d8d", WebkitTextStroke: "0.5px" }}>
                      <th scope="col">Start Date</th>
                      <th scope="col">Lead Tenant</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{currTenancy?.rentalAgreementDate ? dayjs(currTenancy?.rentalAgreementDate).format("MMM D, YYYY") : "Pending"}</td>
                      <td>
                        {leadTenant?.firstName} {leadTenant?.lastName}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mx-5">
                <h5>Deposit Information</h5>
                <table className="table table table-borderless">
                  <thead>
                    <tr>
                      <th scope="col">Amount</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{currTenancy?.deposit ? `$${currTenancy.deposit}` : "NA"}</td>
                      <td>
                        {currTenancy?.isDepositPaid && "Paid"}{" "}
                        <td>
                          {currTenancy?.isDepositReleased && "Released"} {!currTenancy.isDepositPaid && !currTenancy.isDepositReleased && "Pending"}
                        </td>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <hr />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default connect()(MyTenancy);
