import React from "react";
import { connect } from "react-redux";

const PrivacyTerms = props => {
  return (
    <div className="page-privacy-terms px-md-5">
      <h5 className="py-4"> Privacy Policy</h5>
      <div className="py-3">
        This is the privacy statement for TCI Homebase Property Management (TCI Homebase or We). This website is owned by TCI Homebase Property Management and
        the data controller is TCI Homebase Property Management and we are committed to protecting and respecting your privacy. If you visit our website, use
        our apps or contact us, this policy is for you. It{"'"}s about how we protect your data and respect your privacy. TCI Homebase is a registered
        partnership (registration number —-------) with its registered office at South Dock, Providenciales, Turks and Caicos Islands, TKCA 1ZZ. We operate the
        website www.tcihomebase.com as well as our mobile application. We last updated this policy in April 2024. We update it from time to time as we make
        improvements or when laws change. Please check it regularly to make sure you know exactly how we use your data. If We change this privacy statement, We
        will let you know about the changes by publishing the updated version on our website.
      </div>
      <div className="py-3">
        <h6 className="strong-text">Your Responsibility</h6>
        Please read this policy and make sure you{"'"}re happy with it before using our services.
      </div>
      <div className="py-3">
        <h6 className="strong-text">What we do at TCI Homebase</h6>
        TCI Homebase assists property owners and landlords {"("}together, Landlords {"("}being either actual or prospective Landlords{"))"} in finding tenants
        and creating tenancies; and offers a range of other services relating to renting out and managing rental properties. TCI Homebase assists prospective
        and actual tenants {"("}collectively, Tenants {"("}which for the purposes of this privacy statement, shall be deemed to include any individual
        guarantors of any Tenant{"))"}
        in finding properties to rent and creating tenancies; and offers a range of other services relating to renting properties. For the purposes of this
        Privacy Policy, Landlords and Tenants are referred to collectively, as Users.
      </div>
      <div className="py-3">
        <h6 className="strong-text">Personal data we collect</h6>
        We collect the following categories of personal data:
        <div className="py-2">
          <span className="strong-text">Property data:</span> such as images of properties, including videos and virtual tours, property asking prices, sales
          history and sold prices, property addresses, floorplans, property locations and property descriptions.
        </div>
        <div className="py-2">
          <span className="strong-text">Tenant related services data:</span> such as name, email address, property address, date of birth, employment history
          and status, health data, race or ethnicity, disclosure of unspent criminal convictions, payment details, signatures.
        </div>
        <div className="py-2">
          <span className="strong-text">Correspondence and enquiry data:</span> such as name, email address, enquiry messages, surveys and feedback, property
          address and telephone recordings.
        </div>
        <div className="py-2">
          <span className="strong-text">Account information data:</span> such as your login details, preferences and properties you save on your account.
        </div>
        <div className="py-2">
          <span className="strong-text">Tenant and guarantor referencing data:</span> contact and identity data, employment data, education data, financial
          data, property data, lifestyle data, next of kins details, references.
        </div>
        <div className="py-2">
          <span className="strong-text">Technical data:</span> such as device type, usage of our site, online behaviour, search information, how you interact
          with our marketing communications.
        </div>
        <div className="py-2">
          <span className="strong-text">Financial services data:</span> such as contact and identity data, applicant data, employment data, financial data,
          property data and lifestyle data.
        </div>
        <div className="py-2">
          <span className="strong-text">Human resource data:</span> details contained in your CV and cover letter and references.
        </div>
        <div className="py-2">
          <span className="strong-text">Marketing preferences:</span> such as marketing via email and push notifications.
        </div>
      </div>
      <div className="py-3">
        <h6 className="strong-text pb-3">Why do we collect this information?</h6>
        <span className="strong-text">Information about you and how you use our products and services.</span>
        <div>
          <ul>
            <li>To distinguish you from other users and facilitate communication when necessary.</li>
            <li>To personalize products and services for your home needs.</li>
            <li>To ensure we find the right fit for tenants and landlords.</li>
            <li> To complete referencing processes and procedures.</li>
            <li>To send property alerts, tracking, and marketing emails based on your preferences.</li>
            <li>To track what is being posted on the website</li>
            <li>To understand and improve user experience.</li>
            <li>To inform advertising strategies and maintain a free service.</li>
          </ul>
        </div>
      </div>
      <div className="py-3">
        <span className="strong-text">How does it benefit you?</span>
        <div>
          <ul>
            <li>Enables you to contact us and receive relevant property alerts and marketing emails.</li>
            <li>Facilitates direct communication with our agents and landlords.</li>
            <li>Allows for personalized services tailored to your needs.</li>
            <li> Ensures relevant information and adverts. .</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default connect()(PrivacyTerms);
