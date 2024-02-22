import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import ViewRentProperty from "../ViewRentProperty";
import PropertyTenant from "../../../database/models/tenant_property";
import Offer from "../../../database/models/offer";
import Expense from "../../../database/models/expense";
import PropertyDocument from "../../../database/models/property_document";
import { RootState } from "../../redux/store";
import Listing from "../../../database/models/listing";
import axios from "axios";
import { useParams } from "react-router-dom";

const ManageSingleProperty = props => {
  const params = useParams();
  const listingId = params.id;
  const [listing, setListing] = useState<Listing>();
  const property = listing?.PropertyForRent;
  const tenants = property?.PropertyTenants;
  const expenses = property?.Expenses;
  const documents = property?.PropertyDocuments;
  const offers = listing?.Offers;
  const loginUsr = useSelector((r: RootState) => r.auth.user);
  const [allowedToView, setAllowedToView] = useState(true);

  const initialLoad = async () => {
    const res = await axios.get(`/api/listing/rent/expanded/${listingId}`);
    if (res.data.message === "Unauthorized") {
      setAllowedToView(false);
      return;
    }
    setListing(res.data);
  };

  useEffect(() => {
    initialLoad();
  }, []);

  if (!allowedToView && listing) return <h3>You do not have permission to view this page</h3>;
  return (
    <div>
      <div className="d-flex">
        <div className="ms-auto btn">
          <i className="bi bi-pencil pe-1" />
          Edit
        </div>
      </div>
      <ViewRentProperty />
    </div>
  );
};

export default connect()(ManageSingleProperty);
