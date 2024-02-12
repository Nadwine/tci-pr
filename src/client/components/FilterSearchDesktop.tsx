import React from "react";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import { useSearchParams } from "react-router-dom";

type FilterSearchDesktopProps = {
  setSearchText: (string) => void;
  searchRent: () => void;
  searchText: string;
};

const getMultiples = (f: number, limit: number) => [...Array(Math.floor(limit / f))].map((_, i) => f * (i + 1));

const FilterSearchDesktop = (props: FilterSearchDesktopProps) => {
  const { searchRent, setSearchText, searchText } = props;
  const [searchParams, setSearchParams] = useSearchParams();

  const setMaxPrice = price => {
    let updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set("page", `${0}`);
    updatedSearchParams.set("maxPrice", `${price}`);
    setSearchParams(updatedSearchParams.toString());
  };

  const setMinPrice = price => {
    let updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set("page", `${0}`);
    updatedSearchParams.set("minPrice", `${price}`);
    setSearchParams(updatedSearchParams.toString());
  };

  const setMinBed = num => {
    let updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set("page", `${0}`);
    updatedSearchParams.set("minBed", `${num}`);
    setSearchParams(updatedSearchParams.toString());
  };

  const setMaxBed = num => {
    let updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set("page", `${0}`);
    updatedSearchParams.set("maxBed", `${num}`);
    setSearchParams(updatedSearchParams.toString());
  };

  const setMinBath = num => {
    let updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set("page", `${0}`);
    updatedSearchParams.set("minBath", `${num}`);
    setSearchParams(updatedSearchParams.toString());
  };

  const setMaxBath = num => {
    let updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set("page", `${0}`);
    updatedSearchParams.set("maxBath", `${num}`);
    setSearchParams(updatedSearchParams.toString());
  };

  const setBillsIncluded = val => {
    let updatedSearchParams = new URLSearchParams(searchParams.toString());
    if (val === "undefined") updatedSearchParams.delete("bills");
    if (val === "Yes") updatedSearchParams.set("bills", "true");
    if (val === "No") updatedSearchParams.set("bills", "false");
    updatedSearchParams.set("page", `${0}`);
    setSearchParams(updatedSearchParams.toString());
  };

  const setFurnished = val => {
    let updatedSearchParams = new URLSearchParams(searchParams.toString());
    if (val === "undefined") updatedSearchParams.delete("furnished");
    if (val === "Yes") updatedSearchParams.set("furnished", "true");
    if (val === "No") updatedSearchParams.set("furnished", "false");
    updatedSearchParams.set("page", `${0}`);
    setSearchParams(updatedSearchParams.toString());
  };

  const resetFilter = () => {
    let updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.delete("minPrice");
    updatedSearchParams.delete("maxPrice");
    updatedSearchParams.delete("minBed");
    updatedSearchParams.delete("maxBed");
    updatedSearchParams.delete("minBath");
    updatedSearchParams.delete("maxBath");
    updatedSearchParams.delete("bills");
    updatedSearchParams.delete("furnished");
    updatedSearchParams.set("page", `${0}`);
    setSearchParams(updatedSearchParams.toString());
  };

  const formatBoolValueToYesNo = val => {
    if (val == undefined) return "Any";
    if (val === "true") return "Yes";
    if (val === "false") return "No";
  };

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
          className="form-control mb-4"
          placeholder="Search ......"
        />
        <div onClick={() => resetFilter()} className="w-100 d-flex px-3 btn-link justify-content-end point">
          <div>Reset filter</div>
        </div>
        <ul className="list-group">
          <li className="price-filter list-group-item d-flex flex-column px-lg-5">
            Price
            <div className="d-flex flex-row justify-content-between px-lg-5">
              <Dropdown onSelect={val => setMinPrice(val)}>
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  {/* Min */}
                  {searchParams.get("minPrice") || "Min"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {getMultiples(100, 2000).map((v, i) => (
                    <Dropdown.Item eventKey={v} key={i}>
                      {v}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              -
              <Dropdown onSelect={(val: any) => setMaxPrice(val)}>
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  {searchParams.get("maxPrice") || "Max"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {getMultiples(100, 2000).map((v, i) => (
                    <Dropdown.Item eventKey={v} key={i}>
                      {v}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </li>
          <li className="price-filter list-group-item d-flex flex-column px-lg-5">
            Bedroom
            <div className="d-flex flex-row justify-content-between px-lg-5">
              <Dropdown onSelect={val => setMinBed(val)}>
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  {/* Min */}
                  {searchParams.get("minBed") || "Min"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {getMultiples(1, 10).map((v, i) => (
                    <Dropdown.Item eventKey={v} key={i}>
                      {v}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              -
              <Dropdown onSelect={(val: any) => setMaxBed(val)}>
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  {searchParams.get("maxBed") || "Max"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {getMultiples(1, 10).map((v, i) => (
                    <Dropdown.Item eventKey={v} key={i}>
                      {v}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </li>
          <li className="price-filter list-group-item d-flex flex-column px-lg-5">
            Bathroom
            <div className="d-flex flex-row justify-content-between px-lg-5">
              <Dropdown onSelect={val => setMinBath(val)}>
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  {/* Min */}
                  {searchParams.get("minBath") || "Min"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {getMultiples(1, 10).map((v, i) => (
                    <Dropdown.Item eventKey={v} key={i}>
                      {v}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              -
              <Dropdown onSelect={(val: any) => setMaxBath(val)}>
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  {searchParams.get("maxBath") || "Max"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {getMultiples(1, 10).map((v, i) => (
                    <Dropdown.Item eventKey={v} key={i}>
                      {v}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </li>
          <li className="price-filter list-group-item d-flex flex-row justify-content-between px-lg-5">
            Bills Included:
            <Dropdown className="px-lg-5" onSelect={(val: any) => setBillsIncluded(val)}>
              <Dropdown.Toggle variant="light" id="dropdown-basic">
                {formatBoolValueToYesNo(searchParams.get("bills"))}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey={"undefined"}>Any</Dropdown.Item>
                <Dropdown.Item eventKey={"Yes"}>Yes</Dropdown.Item>
                <Dropdown.Item eventKey={"No"}>No</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
          <li className="furnished-filter list-group-item d-flex flex-row justify-content-between px-lg-5">
            Furnished:
            <Dropdown className="px-lg-5" onSelect={(val: any) => setFurnished(val)}>
              <Dropdown.Toggle variant="light" id="dropdown-basic">
                {formatBoolValueToYesNo(searchParams.get("furnished"))}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey={"undefined"}>Any</Dropdown.Item>
                <Dropdown.Item eventKey={"Yes"}>Yes</Dropdown.Item>
                <Dropdown.Item eventKey={"No"}>No</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default connect()(FilterSearchDesktop);
