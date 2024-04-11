/* eslint-disable react/react-in-jsx-scope */

const Safety = props => {
  return (
    <div>
      <div
        className="d-flex justify-content-center align-items-center shadow-sm align-items-center"
        style={{ marginLeft: "-11px", width: "100vw", height: "210px", backgroundColor: "#087990" }}
      >
        <div className="d-flex fw-bold position-absolute text-center mb-md-1 mt-md-1 mt-sm-5 mb-sm-2 pt-4 my-5" style={{ justifyContent: "center" }}>
          <div className="card col-md-9 text-light border-0" style={{ borderRadius: "8px", opacity: 0.91, width: "80%", backgroundColor: "#087990" }}>
            <div className="card-body">
              <h5 className="card-title"></h5>
              <p className="card-text fs-1">Safety & Security Centre</p>
            </div>
          </div>
        </div>
      </div>
      <div className="help-content pt-5 px-md-5">
        <h3 className="strong-text px-3">Ensuring your online experience stays happy & safe</h3>
        <hr className="mb-4 m-3" style={{ width: "50px", color: "#087990", height: "6px" }} />
        <div className="help-article pt-3 p-3">
          <div className="title strong-text" style={{ height: "3em" }}>
            <i className="bi bi-dot" /> How TCI Homebase helps you find your next home
          </div>
        </div>
        <div className="answer ps-3">
          TCI Homebase is the TCIs number one property platform and our mission is to help you find your next home and we want to make sure you can do so safely
          and securely. This is why we verify all our users and any posts before we allow them on our site.
        </div>
        <div className="help-article pt-5 p-3">
          <div className="title strong-text" style={{ height: "3em" }}>
            <i className="bi bi-dot" />
            How to stay safe online
          </div>
          <div className="answer">
            Though the vast majority of people want to help you find your next home, despite our best efforts there will always be a small number of fraudsters
            out there who want to try and trick you into giving up some of your personal details or parting with money.
            <br />
            <p>One of our top tips in staying safe online is being careful when being asked to pay money before you see a property</p>
            <p>
              We recommend you always see the property before paying any money. If you are unable to visit the property, ask someone you trust to do so on your
              behalf.
            </p>
            <p></p>
          </div>
        </div>
        <div className="help-article pt-5 p-3">
          <div className="title strong-text" style={{ height: "3em" }}>
            <i className="bi bi-dot" />
            What TCI Homebase will never ask you for
          </div>
          <div className="answer">
            Please be wary if anyone ever contacts you by email, call, social media message or SMS saying that they work for TCI Homebase Rightmove will never
            contact you asking for password details for your account.
          </div>
        </div>
        <div className="help-article pt-5 pb-5 p-3">
          <div className="title strong-text" style={{ height: "3em" }}>
            <i className="bi bi-dot" />
            Getting in touch
          </div>
          <div className="answer">
            If you think you may have been a victim of a scam or you’re unsure and want some help, you can email us at fraud@rightmove.co.uk or call us on
          </div>
        </div>
      </div>
    </div>
  );
};

export default Safety;
