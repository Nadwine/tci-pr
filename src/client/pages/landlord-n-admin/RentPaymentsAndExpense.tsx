import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Listing from "../../../database/models/listing";
import { RootState } from "../../redux/store";
import axios from "axios";

const RentPaymentsAndExpense = props => {
  const params = useParams();
  const listingId = params.id;
  const [listing, setListing] = useState<Listing>();
  const [allowedToView, setAllowedToView] = useState(true);
  const property = listing?.PropertyForRent;
  const tenancies = property?.Tenancies;
  const onGoingTenancies = tenancies?.filter(t => t.tenancyStatus !== "ended" && t.isHistory === false);
  const tenancyAgreement = onGoingTenancies && onGoingTenancies[0]?.TenancyDocuments?.find(d => d.documentType === "tenancy-agreement");
  const expenses = property?.Expenses;
  const propertyDocs = property?.PropertyDocuments;
  const offers = listing?.Offers;
  const loginUsr = useSelector((r: RootState) => r.auth.user);

  const initialLoad = async () => {
    const res = await axios.get(`/api/listing/rent/expanded/${listingId}`);
    if (res.data.message === "Unauthorized") {
      setAllowedToView(false);
      return;
    }
    setListing(res.data);
    const activeTenancies = res.data?.PropertyForRent?.Tenancies?.filter(t => t.tenancyStatus !== "ended");
    console.log(res.data);
  };

  useEffect(() => {
    initialLoad();
  }, []);

  return (
    <div className="finance-page px-md-5">
      <h5 className="pt-3">Rent & Financial Data</h5>
    </div>
  );
};
export default connect()(RentPaymentsAndExpense);
