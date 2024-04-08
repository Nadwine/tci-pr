import React from "react";
import { connect } from "react-redux";

const TenantDashboard = props => {
  return (
    <div>
      <div className="m-5"> Dashboard</div>
      <div>
        Welcome to your management dashboard.
        <span>
          As you use our services your dashboard will serve relevant content here. You can also use the links on the left to navigate more areas of the site.
        </span>
      </div>
      <div>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">My Tenancies</h5>
            This is some text within a card body.
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Favourites</h5>
            This is some text within a card body.
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect()(TenantDashboard);
