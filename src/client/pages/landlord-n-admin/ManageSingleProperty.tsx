import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import ViewRentProperty from "../ViewRentProperty";
import Tenant from "../../../database/models/tenant";
import Offer from "../../../database/models/offer";
import Expense from "../../../database/models/expense";
import PropertyDocument from "../../../database/models/property_document";
import { RootState } from "../../redux/store";
import Listing from "../../../database/models/listing";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import OfferList from "../../components/landlord-n-admin/OfferList";
import DocumentList from "../../components/landlord-n-admin/DocumentList";
import { setActiveConversation } from "../../redux/reducers/messagesReducer";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Accordion } from "react-bootstrap";

const ManageSingleProperty = props => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const listingId = params.id;
  const [listing, setListing] = useState<Listing>();
  const property = listing?.PropertyForRent;
  const tenancies = property?.Tenancies;
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

  //Accept or decline
  const onSubmitOffer = async (offerId, status) => {
    if (!listing) return;
    const res = await axios.post("/api/offer/status", { offerId, status, listingId: listing.id });
    if (res.status === 200) {
      toast.info(`Offer has been ${status}`);
      initialLoad();
    } else {
      toast.error("Opps something went wrong. Please try again");
      initialLoad();
    }
  };

  const onClickViewEnquiry = (userId: number) => {
    const foundEnquiry = listing?.EnquiryConversations?.find(enq => enq.userId === userId);
    if (foundEnquiry) {
      dispatch(setActiveConversation(foundEnquiry));
      navigate("/enquiries");
    }
  };

  useEffect(() => {
    initialLoad();
  }, []);

  if (!allowedToView && listing) return <h3>You do not have permission to view this page</h3>;
  return (
    <div className="p-md-5">
      <h4 className="pt-2 text-center">Manage Property</h4>
      <div className="pt-5 pb-5">
        <h5>Offers</h5>
        <OfferList offers={offers} onSubmitOffer={onSubmitOffer} onClickViewEnquiry={onClickViewEnquiry} />
      </div>
      <div className="pt-5 pb-5">
        <h5>Attached Documents</h5>
        <DocumentList documents={[]} />
      </div>
      <div className="pt-5 pb-5">
        <h5>Tenancy</h5>
        <Accordion style={{ maxWidth: "500px" }}>
          <Accordion.Header>Tenancy Agreement</Accordion.Header>
          <Accordion.Header>Status</Accordion.Header>
        </Accordion>
      </div>
      <div className="pt-5 pb-5">
        <h5>Tenants</h5>
        <div>
          {tenancies?.map((curTenant, curIndex) => {
            const tenantName = `${curTenant.firstName} ${curTenant.lastName}`;
            return (
              <div key={curIndex}>
                <div>
                  {tenantName}{" "}
                  <a href={`/manage-tenancy/${curTenant.id}`} className="ms-5 btn btn-link">
                    Manage Tenant
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h5>Payments</h5>
        <a href={`/property/rent/${listing && listing?.id}/payments`} className="point btn-link">
          Manage/Setup Payments
        </a>
      </div>
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
