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
      <div className="help-content pt-5 px-md-5">
        <h3>Topics</h3>
        <div className="help-article pt-5" style={{ maxWidth: "600px" }}>
          <div className="title strong-text" style={{ height: "3em" }}>
            <i className="bi bi-dot" /> How to search
          </div>
          <div className="answer">
            Searching TCI Homebase for your next property is very simple. You can Find the Search Functionality on our homepage found <a href="/">here.</a>
            <br />
            Searching for properties on the website does not require creating an account. Simply type in your desired settlement or island in the search box.
            Each property posted will be linked with a specifc settlement and island to make your search more convenient.
          </div>
        </div>
        <div className="help-article pt-5" style={{ maxWidth: "600px" }}>
          <div className="title strong-text" style={{ height: "3em" }}>
            <i className="bi bi-dot" />
            Submitting a property listing
          </div>
          <div className="answer">
            Posting a property to list on the website requires you to create a landlord account. Just Select{" "}
            <span className="px-1 fst-italic strong-text">I am a landlord</span> during account creation.
            <br />
            Upon account creation, Expand the navigation bar by clicking on the icon on the top-right. Click on{" "}
            <span className="px-1 fst-italic strong-text">Create a listing</span>. Fill out this form with the required information hit the submit button.
          </div>
        </div>
        <div className="help-article pt-5" style={{ maxWidth: "600px" }}>
          <div className="title strong-text" style={{ height: "3em" }}>
            <i className="bi bi-dot" />
            Sending an offer for a property
          </div>
          <div className="answer">
            Whiles viewing a property. You will have to first submit an enquiry to the property manager by clicking the{" "}
            <span className="px-1 fst-italic strong-text">Submit an enquiry</span> button at the bottom of the page. After Submitting an enquiry. You can find
            all your enquiries by clicking the icon at the top right of the screen. Then click the <span className="fst-italic strong-text">Enquiries</span>{" "}
            button. We recomend to enchange a few messages with the property manager before sending an offer to increase the chances of your offer being
            accepted. On the message screen select the enquiry you want. Then select the <span style={{ fontSize: "50px", lineHeight: "1rem" }}>...</span>{" "}
            symbol. Then select Make an offer. Fill in the required information and hit send.
          </div>
        </div>
        <div className="help-article pt-5" style={{ maxWidth: "600px" }}>
          <div className="title strong-text" style={{ height: "3em" }}>
            <i className="bi bi-dot" />
            Managing your posted properties
          </div>
          <div className="answer">
            TCI Homebase makes it easy to manage your posted properties. You can view all you posted properties on the dashboard section of your landlord
            account. Select the icon at the top right section and select <span className="fst-italic strong-text">Dashboard.</span> From here expand the
            properties section and select the property you want to manage. Here you can find all the necessary functions about that property including but not
            limited to accepting an offer, viewing and managing tenants. uploading tenancy documents ETC.
          </div>
        </div>
      </div>
      {/* <div className="help-section">
        <h4 className="pt-5 mt-5 text-center">
          Keep a look out on this page for tips on how <br /> to use the website and FAQ (Coming Soon)
        </h4>
      </div> */}
    </div>
  );
};

export default Help;
