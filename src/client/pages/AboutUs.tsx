import React from "react";

const AboutUs = props => {
  return (
    <div className="about p-5 w-sm-100">
      {/* <div className="py-4" style={{ backgroundColor: "white", height: "5rem" }}>
        <h4 className="ps-5 fw-bolder">About TCI Homebase Property Management</h4>{" "}
      </div> */}
      <div className="welcome-search justify-content-center">
        <div className="justify-content-center shadow-sm align-items-center" style={{ height: "210px", marginLeft: "0px" }}>
          <div
            className="image-container"
            style={{
              position: "absolute",
              padding: "0px",
              maxHeight: "215px",
              marginLeft: "0px",
              width: "100%",
              filter: "sepia(5%) saturate(150%) brightness(70%) hue-rotate(341deg)",
              overflow: "hidden"
            }}
          >
            <img src="/static/about.jpg" style={{ position: "relative", marginTop: "-530px", width: 2000 }} className="home-photo.jpg"></img>
          </div>
          <h1
            className="position-absolute fw-bold w-100 mb-lg-3 mt-lg-2 mt-sm-5 mb-sm-2 ms-4"
            style={{ zIndex: +1, position: "relative", paddingTop: "60px", textAlign: "left", color: "white" }}
          >
            About TCI Homebase <p className="text-break">Property Management</p>
          </h1>
        </div>
      </div>
      <div className="mx-lg-5 pt-5 fs-5">
        TCI Homebase is a licensed property management company based in Providenciales but will operate in all of the Islands in Turks and Caicos. We specialise
        in using digital solutions to pair the right property with the right customer. We list properties for landlords and homeowners within the Turks and
        Caicos Islands and bring the perfect tenant to you.
      </div>
      <div className="d-flex flex-row flex-wrap justify-content-start">
        <div className="card col-md-4 w-sm-100 m-lg-5" style={{ backgroundColor: "#055160", boxShadow: "10px 10px 5px 0px rgba(0,0,0,0.37)" }}>
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
        <div className="mt-5 col-md-4">
          <p className="fs-4 mt-5 fw-bold mx-lg-5" style={{ color: "#055160" }}>
            Helping the residents of the Turks and Caicos Islands find their next home!{" "}
          </p>
          <p className="ms-5 fs-1 text-dark fw-bolder">Get in touch</p>
          <p className="fs-5 ms-5 fw-bold">Want to get in touch? We{"'"}d love to hear from you. Fill out the contact form with your details and message.</p>
          <p className="fs-5 ms-5">Are you interested in promoting your business on our site? Contact us on tci.homebase.tc@gmail.com or at +1(649) 348-4021</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
