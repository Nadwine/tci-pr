import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoadingSpinnerWholePage } from "../components/LoadingSpinners";

const HomeFeed = props => {
  const navigateToPage = useNavigate();
  const [pagination, setPagination] = useState(0);
  const [loading, setLoading] = useState(true);

  if (loading) return <LoadingSpinnerWholePage />;

  return (
    <div className="home-feed row justify-content-center">
      {/* side view only desktops */}
      <div className="col-md-3 d-none d-lg-flex">
        <div className="card" style={{ minHeight: "70vh" }}>
          <div className="card-body">This is some text within a card body.</div>
        </div>
      </div>
      <div className="col-md-6 d-flex flex-grow-1">
        <div className="w-100">
          
          Content
        </div>
      </div>
      {/* side view only desktops */}
      <div className="col-md-3 d-none d-lg-flex">
        <div className="card" style={{ minHeight: "70vh" }}>
          <div className="card-body fs-5">Recommendations, highlights, trending projects & ads</div>
        </div>
      </div>
    </div>
  );
};

export default connect()(HomeFeed);
