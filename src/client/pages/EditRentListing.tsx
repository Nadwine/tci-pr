import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Listing from "../../database/models/listing";
import { RootState } from "../redux/store";
import axios from "axios";
import { LoadingSpinnerWholePage } from "../components/LoadingSpinners";
import EditRentForm from "../components/EditRentForm";

const EditRentListing = props => {
  const params = useParams();
  const { id } = params;
  const [listing, setListing] = useState<Listing>();
  const [loading, setLoading] = useState(true);
  const user = useSelector((root: RootState) => root.auth.user);
  const accountType = user?.accountType;

  const initialFetch = async () => {
    const res = await axios.get(`/api/listing/rent/expanded/${id}`);
    if (res.status === 200) {
      setListing(res.data);
      setLoading(false);
    } else {
      console.log(`/api/listing/rent/expanded/${id}`, res);
    }
  };

  useEffect(() => {
    initialFetch();
  }, []);

  if (loading || !listing) return <LoadingSpinnerWholePage />;
  if (accountType !== "admin") return <h6 className="text-center">Unauthorized</h6>;
  return (
    <div>
      <EditRentForm listing={listing} />
    </div>
  );
};

export default connect()(EditRentListing);
