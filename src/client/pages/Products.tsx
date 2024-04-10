/* eslint-disable react/react-in-jsx-scope */

import { faClipboardList, faHandHoldingDollar, faLayerGroup, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, Card, useAccordionButton } from "react-bootstrap";

const Products = props => {
  function CustomButton({ children, eventKey }: any) {
    const decoratedOnClick = useAccordionButton(eventKey, () => console.log("totally custom!"));

    return (
      <button className="btn btn-link ms-auto" type="button" onClick={decoratedOnClick} style={{ textDecoration: "none", width: "11em" }}>
        {children}
      </button>
    );
  }
  return (
    <div>
      <div className="ps-md-5 shadow-sm">
        {/* Desktop Page Header */}
        {/* <h3 className="mt-5 d-none d-md-flex">Products & Services</h3> */}
        {/* Mobile Page Header */}
        <h3 className="mt-5 text-center d-md-none d-lg-none strong-text">Products & Services</h3>
        {/* Desktop Title */}
        <div className="pb-5 fs-5 mx-auto d-none d-md-flex flex-wrap" style={{ paddingTop: "70px", maxWidth: "1000px" }}>
          <h2 className="d-none d-md-flex pb-4">Products & Services</h2>
          <div className="col-12 d-flex align-items-center text-muted pb-3" style={{ fontSize: "16px" }}>
            TCI Homebase offers a range of services. From finding suitible tenants for your property to a fully managed service model, we{"'"}ve got you
            covered.
          </div>
          <div className="d-none d-md-flex pt-3">
            <img width="250" height="150" src="/static/products-package.png" />
          </div>
        </div>
        {/* Mobile Title */}
        <div
          className="pb-5 fs-5 mx-auto mt-4 d-flex d-md-none d-lg-none flex-wrap text-center"
          style={{ padding: "25px", maxWidth: "1000px", backgroundColor: "#7591ee", color: "white", borderTopRightRadius: "30px", borderTopLeftRadius: "30px" }}
        >
          <div className="col-12 col-md-9 d-flex align-items-center">
            TCI Homebase offers a range of services. From finding suitible tenants for your property to a fully managed service model, we{"'"}ve got you
            covered.
          </div>
        </div>
      </div>
      <div className="col-12 d-flex flex-row justify-content-center flex-wrap px-md-5">
        <div className="w-100 text-center">
          <h4 className="m-md-5 m-4 bolder-text text-muted">Our Pricing</h4>
        </div>
        <div className="card align-items-center justify-content-center col-md-3 mx-md-2 shadow-sm" style={{ padding: "30px", backgroundColor: "white" }}>
          <div className="card-body" style={{ backgroundColor: "white" }}>
            <h4 className="card-title fw-bolder text-center greyed-text">Basic</h4>
            <h1 className="card-title fw-bolder text-center greyed-text">$20</h1>
            <p className="text-center greyed-text smaller-text">for each listing</p>
            <p className="text-center greyed-text">
              <i className="bi bi-check-lg"></i> Fee for advertising and receiving enquiries. $20 for each listing renewal every month
            </p>
            <p className="text-center greyed-text">* Videos for listings at additional fee</p>
            <div className="text-center pt-5">
              <button className="btn greyed-text" style={{ border: "2px solid", borderColor: "#c9cdd0", borderRadius: "7px" }}>
                Add Listing Now
              </button>
            </div>
          </div>
        </div>
        <div className="card align-items-center justify-content-center col-md-3 mx-md-2 shadow-sm" style={{ padding: "30px", backgroundColor: "white" }}>
          <div className="card-body" style={{ backgroundColor: "white" }}>
            <h4 className="card-title fw-bolder text-center primary-text">Standard</h4>
            <h1 className="card-title fw-bolder text-center primary-text">$150</h1>
            <p className="text-center primary-text smaller-text">per tenancy term</p>
            <p className="card-text text-center primary-text">
              <i className="bi bi-check-lg"></i> Referencing, and shortlisting
            </p>
            <p className="text-center primary-text">
              <i className="bi bi-check-lg"></i> Applicants accompanied viewings{" "}
            </p>
            <p className="text-center primary-text">
              <i className="bi bi-check-lg"></i> Rent collection
            </p>
            <p className="text-center primary-text">
              <i className="bi bi-check-lg"></i> Tenancy renewals and leasing document for 1 property and reports with additional admin fee 50% (inspection)
            </p>
            <div className="text-center pt-4">
              <button className="btn primary-text" style={{ border: "2px solid", borderColor: "#077990", borderRadius: "7px" }}>
                Add Listing Now
              </button>
            </div>
          </div>
        </div>
        <div className="card align-items-center justify-content-center col-md-3 mx-md-2 shadow-sm" style={{ padding: "30px", backgroundColor: "white" }}>
          <div className="card-body" style={{ backgroundColor: "white" }}>
            <h4 className="card-title fw-bolder text-center text-primary">Premium</h4>
            <h1 className="card-title fw-bolder text-center text-primary">15%</h1>
            <p className="text-center text-primary smaller-text">of gross monthly income</p>
            <p className="card-text text-center text-primary">
              <i className="bi bi-check-lg"></i> Full property management services including property maintenance
            </p>
            <p className="card-text text-center text-primary">
              <i className="bi bi-check-lg"></i> Tenant interaction and communication including routine checks and reporting
            </p>
            <p className="card-text text-center text-primary">
              <i className="bi bi-check-lg"></i> Rent and expense tracking
            </p>
            <p className="card-text text-center text-primary">
              <i className="bi bi-check-lg"></i> Inventory builder
            </p>
            <p className="card-text text-center text-primary">
              <i className="bi bi-check-lg"></i> Certificate reminder
            </p>
            <p className="card-text text-center text-primary">
              <i className="bi bi-check-lg"></i> Compliance checklists
            </p>
            <div className="text-center pt-3">
              <button className="btn text-primary border-primary" style={{ border: "2px solid", borderRadius: "7px" }}>
                Add Listing Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-100 text-center">
        <h4 className="m-5 bolder-text text-muted">Additional Services</h4>
      </div>
      <div className="col-12 mx-auto pt-md-4 products-accordions pb-5 w-100" style={{ maxWidth: "750px" }}>
        <Accordion>
          <Card>
            <Card.Header style={{ height: "100px", backgroundColor: "white" }}>
              <div className="d-flex h-100 align-items-center px-md-5">
                <i className="theme-text bi bi-postcard fs-1 pe-3" />
                <span className="col-5 products-accordions-text">Property Listing</span>
                <CustomButton eventKey="0">More Info +</CustomButton>
              </div>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body className="px-md-5">We assess your properties and list them on our portal. </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        <Accordion>
          <Card>
            <Card.Header style={{ height: "100px", backgroundColor: "white" }}>
              <div className="d-flex h-100 align-items-center px-md-5">
                <i className="theme-text bi bi-person-check fs-1 pe-3" />
                <span className="fs-5 col-5 products-accordions-text">Tenant Screening & Referencing</span>
                <CustomButton eventKey="0">More Info +</CustomButton>
              </div>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body className="px-md-5">
                We will shortlist your applicants and ensure the applicant is the right fit for you. We will assess their financial status, complete the
                relevant background checks and employment references.
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        <Accordion>
          <Card>
            <Card.Header style={{ height: "100px", backgroundColor: "white" }}>
              <div className="d-flex h-100 align-items-center px-md-5">
                <i className="theme-text bi bi-eye fs-1 pe-3" />
                <span className="fs-5 col-5 products-accordions-text">Accompanied Viewing Service</span>
                <CustomButton eventKey="0">More Info +</CustomButton>
              </div>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body className="px-md-5">We will arrange and manage all viewings for your property.</Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        <Accordion>
          <Card>
            <Card.Header style={{ height: "100px", backgroundColor: "white" }}>
              <div className="d-flex h-100 align-items-center px-md-5">
                {/* <i className="theme-text bi bi-eye fs-1 pe-3" />
                 */}
                <FontAwesomeIcon icon={faHandHoldingDollar} className="theme-text fs-2 pe-3" />
                <span className="fs-5 col-5 products-accordions-text">Rent Collection</span>
                <CustomButton eventKey="0">More Info +</CustomButton>
              </div>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body className="px-md-5">
                We handle all rent and deposit payments and ensure our landlords and tenants money is always protected.We prioritize ensuring rent arrives on
                time and keep an accurate record of all transactions
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        <Accordion>
          <Card>
            <Card.Header style={{ height: "100px", backgroundColor: "white" }}>
              <div className="d-flex h-100 align-items-center px-md-5">
                {/* <i className="theme-text bi bi-eye fs-1 pe-3" />
                 */}
                <i className="theme-text bi bi-house-add fs-1 pe-3" />
                <span className="fs-5 col-5 products-accordions-text">Full Property Management Services</span>
                <CustomButton eventKey="0">More Info +</CustomButton>
              </div>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body className="px-md-5">
                We offer you a hassle free experience where we manage your property and inventory from the start to the end of your tenancy agreement. We also
                provide additional services including cleaning and maintenance services.
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        <Accordion>
          <Card>
            <Card.Header style={{ height: "100px", backgroundColor: "white" }}>
              <div className="d-flex h-100 align-items-center px-md-5">
                {/* <i className="theme-text bi bi-eye fs-1 pe-3" />
                 */}
                <i className="theme-text bi bi-door-open fs-1 pe-3" />
                <span className="fs-5 products-accordions-text">Tenant Check In and Check Out</span>
                <CustomButton eventKey="0">More Info +</CustomButton>
              </div>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body className="px-md-5">
                Not only will we onboard your tenants, we will ensure that the property is returned in the best conditions, complete a full inventory check,
                manage deposits and handle all the nifty details at the end of the tenancy agreement.
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    </div>
  );
};

export default Products;
