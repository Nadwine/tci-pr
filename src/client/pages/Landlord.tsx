import React from "react";

const AboutUs = props => {
  return (
    <div className="about" style={{ minHeight: "97vh", backgroundColor: "#0c161f" }}>
      {/* <div className="py-4" style={{ backgroundColor: "white", height: "5rem" }}>
        <h4 className="ps-5 fw-bolder">About TCI Homebase Property Management</h4>{" "}
      </div> */}
      <div className="d-flex col-12 w-100 flex-wrap justify-content-start" style={{ paddingTop: "10vh", alignItems: "center" }}>
        <div className="card">
          <img src="/static/example.jpeg" className="card-img-top" alt="..." />
        </div>
        <div className="card col-md-6 ms-md-5 p-5 shadow-sm">
          <div className="card-body">
            {/* <h5 className="card-title">Card title</h5>
            <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
            <p className="card-text">
              At TCI Homebase, we pride ourselves on being more than just a property management company, With a commitment to excellence and innovation at the
              forefront of everything we do, we go above and beyond to ensure your peace of mind and the utmost satisfaction.
              <p className="mt-3">
                Our bespoke approach begins with understanding your unique needs and objectives. Whether you{"'"}re a seasoned landlord or a homeowner venturing
                into the rental market for the first time, our experienced team takes the time to craft personalized strategies tailored to your goals.{" "}
              </p>
              <p>
                From strategically marketing your property to conducting thorough tenant screenings and managing lease agreements, we handle every aspect of the
                rental process with precision and care. Our extensive network and cutting-edge digital platforms enable us to attract high-quality tenants who
                not only meet your criteria but also respect your property as if it were their own.
              </p>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
