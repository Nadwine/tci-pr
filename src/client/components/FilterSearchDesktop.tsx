import React from "react";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";

type FilterSearchDesktopProps = {
  setSearchText: (string) => void;
  searchRent: () => void;
  searchText: string;
};

const getMultiples = (f: number, limit: number) => [...Array(Math.floor(limit / f))].map((_, i) => f * (i + 1));

const FilterSearchDesktop = (props: FilterSearchDesktopProps) => {
  const { searchRent, setSearchText, searchText } = props;

  return (
    <div style={{ height: "89vh", minWidth: "30vw" }} className="desktop-filter card mb-3 d-none d-md-flex d-lg-flex d-xl-flex position-fixed">
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
        <ul className="list-group">
          <li className="list-group-item d-flex flex-column">
            Price
            <div className="d-flex flex-row justify-content-between">
              <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  Max
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {getMultiples(100, 2000).map((v, i) => (
                    <Dropdown.Item key={i}>{v}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  Min
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {getMultiples(100, 2000).map((v, i) => (
                    <Dropdown.Item key={i}>{v}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default connect()(FilterSearchDesktop);
