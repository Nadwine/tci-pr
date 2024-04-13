import React from "react";
import { useNavigate } from "react-router-dom";

const AboutUs = props => {
  const mql = window.matchMedia("(max-width: 600px)");
  const navigate = useNavigate();

  let mobileView = mql.matches;
  return (
    <div className="about-landlord m-sm-0" style={{ minHeight: "97vh", paddingLeft: "0px", paddingRight: "0px" }}>
      <div
        className="image-container ml-sm-3"
        style={{
          position: "absolute",
          height: mobileView ? "800px" : "auto",
          maxHeight: "100vh",
          width: "100%",
          filter: "sepia(5%) saturate(160%) brightness(70%) hue-rotate(341deg)",
          overflow: "hidden"
        }}
      >
        <img src="/static/about.jpg" style={{ marginTop: "-40px", width: 2000 }} className="home-photo.jpg"></img>
      </div>
      <div
        className="d-flex col-12 w-100 flex-wrap justify-content-start shadow-lg pt-md-5 mt-md-5"
        style={{ paddingTop: "5vh", alignItems: "center", borderRadius: "0px" }}
      >
        <div className="card col-md-4 m-md-5 mb-5" style={{ borderRadius: "0px", backgroundColor: "#ffffff00", border: "none" }}>
          <h5 className="strong-text fst-italic fs-3 text-center text-white pb-3  text-decoration-underline" style={{ backgroundColor: "#ffffff00" }}>
            Why Choose Us?
          </h5>
          <img src="/static/example.jpeg" className="card-img-top" alt="..." />
        </div>
        <div className="card col-md-6 p-md-5 ml-mb-5 mt-sm-2 shadow-lg m-sm-1" style={{ borderRadius: "0px" }}>
          <div className="card-body">
            <p className="card-text text-muted">
              At TCI Homebase, we pride ourselves on being more than just a property management company, with a commitment to excellence and innovation at the
              forefront of everything we do, we go above and beyond to ensure your peace of mind and the utmost satisfaction.
              <p className="mt-3">
                Our bespoke approach begins with understanding your unique needs and objectives. Whether you{"'"}re a seasoned landlord or a homeowner venturing
                into the rental market for the first time, our experienced team takes the time to craft personalised strategies tailored to your goals.{" "}
              </p>
              <p>
                From strategically marketing your property on our site to conducting thorough tenant screenings and managing lease agreements, we handle every
                aspect of the rental process with precision and care. Our cutting-edge digital platform enable us to attract high-quality tenants who not only
                meet your criteria but also respect your property as if it were their own.{" "}
                <span className="fw-bolder point text-primary" style={{ fontStyle: "italic" }} onClick={() => navigate(`/products`)}>
                  {" "}
                  Browse our list of services available here.
                </span>
              </p>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
