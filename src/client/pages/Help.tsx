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
            maxHeight: "350px",
            marginLeft: "0px",
            width: "98%",
            overflow: "hidden"
          }}
        >
          <img src="/static/help.png" style={{ position: "relative", marginTop: "-250px", width: 2000 }} className="home-photo.jpg"></img>
        </div>
        <div
          className="position-absolute fw-bold text-center mb-lg-3 mt-lg-2 mt-sm-5 mb-sm-2"
          style={{ zIndex: +1, position: "relative", paddingTop: "60px", textAlign: "center", color: "black" }}
        >
          The Perfect Space Awaits
        </div>
      </div>
    </div>
  );
};

export default Help;
