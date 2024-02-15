import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

const AboutLandlord = props => {
  return (
    <div>
      <h3 className="fw-bolder mt-5 mx-5 my-5">How-to Guide</h3>
      <div className="mt-2 my-5 mx-5">
     <p className="me-5">We find you reliable tenants and ensure your proprietary stays in good condition. At TCI Homebase, we offer more than simply listing your properties.
      Browse our list of services available here. (Make “here” a Hyperlink that takes them to the Products and Services Page) Register Now (Make this a
      clickable button that take them to the sign up form)</p> 
      <div className="text-danger mt-5 me-5">
        <ul>
          <li className="mb-3 me-5">The first step to begin the process is by creating an account. Go to our signup form here. Once you have filled out the form, You will be asked to verify your email. If you're having problems with this step, call us.</li>
          <li className="mb-3 me-5">Now that your account has been created, next is to fill out your details on your profile, Click here</li>
          <li className="mb-3 me-5">If you have a property and would like to list it on our site, you will need to go here and fill this form</li>
          <li className="mb-3 me-5">After submitting your form, the next step is to wait for approval. During this stage, a colleague will be reviewing your post, and if it meets the standards and rules, we will approve it and add the property to our site for you. Please keep track of the status of 
            your listing by going on your dashboard. Click here to view. </li>
          <li className="mb-3 me-5">
          If you choose to rent through us, its time to relax and have a piece of mind. Its our turn now. During this stage we will be screening potential tenants for you by checking their details, employment status, etc. To ensure we find you the right tenant. </li>
          <li>Pay outs ETC</li>
        </ul>
      </div>
      </div>
    </div>
  );
};

export default connect()(AboutLandlord);
