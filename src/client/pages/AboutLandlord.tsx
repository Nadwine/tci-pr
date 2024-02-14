import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

const AboutLandlord = props => {
  return (
    <div>
      <h3>AboutLandlord</h3>
      We find you reliable tenants and ensure your proprietary stays in good condition. At TCI Homebase, we offer more than simply listing your properties.
      Browse our list of services available here. (Make “here” a Hyperlink that takes them to the Products and Services Page) Register Now (Make this a
      clickable button that take them to the sign up form)
      <div className="text-danger mt-5">This Page is work in progress</div>
    </div>
  );
};

export default connect()(AboutLandlord);
