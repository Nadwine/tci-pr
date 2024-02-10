import React from "react";
import { Accordion, Button, Card } from "react-bootstrap";
import { connect } from "react-redux";

type MobileFilterSearchProps = {
  setSearchText: (string) => void;
  searchRent: () => void;
  searchText: string;
};

const FilterSearchMobile = (props: MobileFilterSearchProps) => {
  const { searchRent, searchText, setSearchText } = props;

  return (
    <div className="mobile-filter card mb-3 d-md-none d-lg-none d-xl-none">
      <div className="card-body">
        <input
          onKeyUp={e => {
            if (e.key === "Enter") {
              searchRent();
            }
          }}
          onChange={e => setSearchText(e.target.value)}
          value={searchText}
          type="text"
          className="form-control"
          placeholder="Search ......"
        />
      </div>
      <div className="card">
        <Accordion>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0" style={{ width: "100%", display: "flex" }}>
                Filter
                <i className="bi bi-chevron-down ms-auto" />
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                Filter 1 <br />
                Filter 2 <br />
                Filter 3 <br />
                Filter 4 <br />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    </div>
  );
};

export default connect()(FilterSearchMobile);
