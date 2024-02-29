/* eslint-disable react/react-in-jsx-scope */

const Help = props => {
  return (
    <div>
      <div className="justify-content-center shadow-sm align-items-center" style={{ height: "270px", marginLeft: "0px" }}>
        <div
          className="image-container"
          style={{
            position: "absolute",
            padding: "0px",
            maxHeight: "270px",
            marginLeft: "0px",
            width: "98%",
            overflow: "hidden"
          }}
        >
          <img src="/static/help.png" style={{ position: "relative", marginTop: "-50px", width: 2000 }} className="home-photo.jpg"></img>
        </div>
        <div
          className="position-absolute d-flex fw-bold text-center mb-lg-1 mt-lg-1 mt-sm-5 mb-sm-2 pt-4"
          style={{ zIndex: +1, position: "relative", textAlign: "center", color: "black", justifyContent: "center" }}
        >
          <div className="card col-md-6 shadow-lg" style={{ borderRadius: "8px", opacity: 0.91, borderColor: "white" }}>
            <div className="card-body">
              <h5 className="card-title"></h5>
              <p className="card-text fs-2">Help Center</p>
              <p>
                Access the Help Center for simplified guidance on TCI Homebase use by landlords and tenants. Explore available properties via the property
                search feature on our main page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
