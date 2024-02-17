import React from "react";

const AboutUs = props => {
  return (
    <div className="about me-5 w-sm-100">
      <div className="py-4" style={{ backgroundColor: "white", height: "5rem" }}>
        <h4 className="ps-5 fw-bolder">About TCI Homebase Property Management</h4>{" "}
      </div>
      <div className="mx-lg-5 pt-3">
        TCI Homebase is a licensed property management company based in Providenciales but will operate in all of the Islands in Turks and Caicos. We specialise
        in using digital solutions to pair the right property with the right customer. We list properties for landlords and homeowners within the Turks and
        Caicos Islands and bring the perfect tenant to you.
      </div>
      <p className="fs-5 mt-4 fw-bold mx-lg-5" style={{ color: "#055160" }}>
        Helping the residents of the Turks and Caicos Islands find their next home!{" "}
      </p>
      <div>
        <div className="card w-sm-100 m-lg-5" style={{ width: "500px", backgroundColor: "#055160", boxShadow: "10px 10px 5px 0px rgba(0,0,0,0.37)" }}>
          <div className="card-body">
            <p className="ms-3 text-light fw-bolder" style={{ fontSize: "40px" }}>
              CONTACT US!
            </p>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="exampleFormControlInput1" className="form-label text-light">
                  First Name
                </label>
                <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="" />
              </div>
              <div className="mb-3">
                <label htmlFor="exampleFormControlInput1" className="form-label text-light">
                  Last Name
                </label>
                <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="" />
              </div>
              <div className="mb-3">
                <label htmlFor="exampleFormControlInput1" className="form-label text-light">
                  Email
                </label>
                <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />
              </div>
              <div className="mb-3">
                <label htmlFor="exampleFormControlTextarea1" className="form-label text-light">
                  Message
                </label>
                <textarea className="form-control" id="exampleFormControlTextarea1"></textarea>
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn text-light fw-bold" type="button" style={{ backgroundColor: "#0aa2c0" }}>
                  Contact Our Agents Now!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
