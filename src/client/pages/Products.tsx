/* eslint-disable react/react-in-jsx-scope */

import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, Card, useAccordionButton } from "react-bootstrap";

const Products = props => {
  function CustomButton({ children, eventKey }: any) {
    const decoratedOnClick = useAccordionButton(eventKey, () => console.log("totally custom!"));

    return (
      <button className="btn btn-link ms-auto" type="button" onClick={decoratedOnClick} style={{ textDecoration: "none" }}>
        {children}
      </button>
    );
  }
  return (
    <div className="px-md-5">
      <div className="ms-md-5">
        <h3 className="mt-5">Products & Services</h3>
        <div className="pb-5 fs-5 mx-auto d-flex flex-wrap" style={{ paddingTop: "70px", maxWidth: "1000px" }}>
          <div className="col-12 col-md-9 d-flex align-items-center">
            TCI Homebase offers a range of services. From finding suitible tenants for your property to a fully managed service model, we{"'"}ve got you
            covered.
          </div>
          <div className="d-none d-md-flex">
            <img width="250" height="150" src="/static/products-package.png" />
          </div>
        </div>
      </div>
      <hr />
      <div className="col-12 d-flex justify-content-center px-md-5">
        <div className="col-12" style={{ maxWidth: "750px", paddingTop: "30px" }}>
          <Accordion>
            <Card>
              <Card.Header style={{ height: "100px", backgroundColor: "white" }}>
                <div className="d-flex h-100 align-items-center px-md-5">
                  <i className="theme-text bi bi-postcard fs-1 pe-3" />
                  <span className="fs-5">Property Listing</span>
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
                  <span className="fs-5">Tenant Screening & Referencing</span>
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
                  <span className="fs-5">Accompanied Viewing Service</span>
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
                  <span className="fs-5">Rent Collection</span>
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
                  <span className="fs-5">Full Property Management Services</span>
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
                  <span className="fs-5">Tenant Check In and Check Out</span>
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
    </div>
  );
};

export default Products;
