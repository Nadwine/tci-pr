/* eslint-disable react/react-in-jsx-scope */

const Products = props => {
  return (
    <div>
      <h3 className="m-5">Products & Services</h3>
      <div className="col-12 d-flex justify-content-center">
        <div
          className="card text-center shadow-sm mb-3"
          style={{ width: "18rem", height: "20rem", marginRight: "20px", padding: "30px", backgroundColor: "white" }}
        >
          <div className="card-body p-0">
            <h5 className="card-title">Property Listing</h5>
            <p className="card-text" style={{ fontSize: "12px" }}>
              We assess your properties and list them on our portal.
            </p>
            <i className="bi bi-house-check" style={{ fontSize: "50px", color: "#055160" }}></i>
          </div>
        </div>

        <div
          className="card text-center mb-3 shadow-sm"
          style={{ width: "18rem", height: "20rem", marginRight: "20px", padding: "30px", backgroundColor: "white" }}
        >
          <div className="card-body p-0">
            <h5 className="card-title">Tenant Screen & Referencing</h5>
            <p className="card-text" style={{ fontSize: "12px" }}>
              We will shortlist your applicants and ensure the applicant is the right fit for you. We will assess their financial status, complete the relevant
              background checks and employment references.{" "}
            </p>
            <i className="bi bi-person-check" style={{ fontSize: "50px", color: "#055160" }}></i>
          </div>
        </div>

        <div
          className="card text-center mb-3 shadow-sm"
          style={{ width: "18rem", height: "20rem", marginRight: "20px", padding: "30px", backgroundColor: "white" }}
        >
          <div className="card-body p-0">
            <h5 className="card-title">Rent Collection</h5>
            <p className="card-text" style={{ fontSize: "12px" }}>
              We handle all rent and deposit payments and ensure our landlords and tenants money is always protected.We prioritize ensuring rent arrives on time
              and keep an accurate record of all transactions.
            </p>
            <i className="bi bi-cash-coin" style={{ fontSize: "50px", color: "#055160" }}></i>
          </div>
        </div>

        <div
          className="card text-center mb-3 shadow-sm"
          style={{ width: "18rem", height: "20rem", marginRight: "20px", padding: "30px", backgroundColor: "white" }}
        >
          <div className="card-body p-0">
            <h5 className="card-title">Full Property Management Services</h5>
            <p className="card-text" style={{ fontSize: "12px" }}>
              We offer you a hassle free experience where we manage your property and inventory from the start to the end of your tenancy agreement. We also
              provide additional services including cleaning and maintenance services.
            </p>
            <i className="bi bi-house-lock-fill" style={{ fontSize: "50px", color: "#055160" }}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
