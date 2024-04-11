import React from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

const CookieTerms = props => {
  const navigate = useNavigate();

  return (
    <div className="px-md-5">
      <h5 className="py-5 strong-text">Cookie Policy</h5>
      <div className="py-2">
        A cookie, a small text file stored on your device, is employed on our website to distinguish you from other users and provide insights into how the
        website is used. This information helps us maintain the website{"'"}s relevance, accuracy, and error-free functionality. The types of cookies used on
        this website are outlined below:
      </div>
      <div className="py-2">
        <span className="strong-text">Strictly necessary cookies:</span> These are cookies that are required for the operation of our website. They include, for
        example, cookies that enable you to log into secure areas of our website.
      </div>
      <div className="py-2">
        <span className="strong-text">Analytical/performance cookies:</span> These allow us to recognize and count the number of visitors and to see how
        visitors move around our website when they are using it. This helps us to improve the way our website works, for example, by ensuring that users are
        finding what they are looking for easily.
      </div>
      <div className="py-2">
        <span className="strong-text">Functionality cookies:</span> These are used to recognize you when you return to our website. This enables us to
        personalise our content for you, greet you by name and remember your preferences (for example, your choice of language or region).
      </div>
      <div className="py-2">
        <span className="strong-text">Targeting cookies:</span>These cookies record your visit to our website, the pages you have visited and the links you have
        followed. We will use this information to make our website more relevant to your interests.
      </div>
      <div className="py-2">
        <h6 className="strong-text">Blocking First Party Cookies</h6>
        To prevent the installation of first-party cookies, adjust your browser settings to reject all or some cookies. However, bear in mind that if you opt to
        block all cookies, including essential ones, certain sections or features of our website may become inaccessible.
      </div>
      <div className="py-2">
        <h6 className="strong-text">Blocking Third Party Cookies</h6>
        Similarly, you can inhibit the placement of third-party cookies by configuring your browser to reject some or all cookies. It{"'"}s important to note
        that blocking all cookies, including essential ones, via your browser settings may restrict access to certain parts of our website. Please be aware that
        while we may utilize third-party services like Google Analytics cookies for anonymous usage statistics, no personal information that could identify you
        is collected. These cookies aid in analyzing web page usage and enhancing our website to better suit the needs of our audience. They typically store
        data regarding your webpage visits, duration of stay, referral sources, and interactions, serving as a tool for recognizing your device when you visit
        other websites.
      </div>
      <div className="py-3">
        See{" "}
        <button className="btn text-primary ps-0 pe-1" onClick={() => navigate(`/privacy-terms`)}>
          Privacy Policy
        </button>
        for more about your privacy.
      </div>
    </div>
  );
};
export default connect()(CookieTerms);
