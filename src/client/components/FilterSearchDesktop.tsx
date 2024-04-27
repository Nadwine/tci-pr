import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import { useSearchParams } from "react-router-dom";
import islands from "../../utils/islandsData.json";

type FilterSearchDesktopProps = {
  setSearchText: (string) => void;
  searchRent: (string?) => void;
  searchText: string;
};

let islandAndSettlements: string[] = [];

islands.forEach(i => {
  islandAndSettlements.push(i.name);
  islandAndSettlements = [...islandAndSettlements, ...i.settlements];
});

const getMultiples = (f: number, limit: number) => [...Array(Math.floor(limit / f))].map((_, i) => f * (i + 1));

const FilterSearchDesktop = (props: FilterSearchDesktopProps) => {
  const { searchRent, setSearchText, searchText } = props;
  const [searchParams, setSearchParams] = useSearchParams();
  const [fieldActive, setFieldActive] = useState(false);

  const autoCompleteFilterWithSearch = islandAndSettlements.filter(c => c.toLowerCase().includes(searchText.toLowerCase()));

  const [showAutoComplete, setShowAutoComplete] = useState(false);

  useEffect(() => {
    const shouldDisplay = Boolean(
      searchText && autoCompleteFilterWithSearch.length !== 0 && autoCompleteFilterWithSearch[0].toLocaleLowerCase() !== searchText.toLocaleLowerCase()
    );
    setShowAutoComplete(shouldDisplay);
  }, [searchText]);

  const handleSearch = (e: any) => {
    setSearchText(e.target.value);
    setFieldActive(true);
  };

  const setMaxPrice = price => {
    let updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set("page", `${0}`);
    if (searchParams.get("minPrice") || "" > price) {
      updatedSearchParams.set("minPrice", price);
    }
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
    if (searchParams.get("minBed") || "" > num) {
      updatedSearchParams.set("minBed", num);
    }
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
    if (searchParams.get("minBath") || "" > num) {
      updatedSearchParams.set("minBath", num);
    }
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
          onChange={e => handleSearch(e)}
          value={searchText}
          type="text"
          className="form-control"
          placeholder="Search...."
        />
        {showAutoComplete && fieldActive && (
          <div className="homepage-autocomplete bg-light mb-3 position-absolute p-3 rounded" style={{ zIndex: 2 }}>
            {autoCompleteFilterWithSearch.map((c, i) => (
              <div
                tabIndex={0}
                // onKeyUp={e => {
                //   if (e.key === "Enter") {
                //     searchRent();
                //   }
                // }}
                key={i}
                className="autocomplete-item point autocomplete-highlight"
                onClick={() => {
                  setSearchText(c);
                  searchRent(c);
                  setShowAutoComplete(false);
                }}
              >
                {c}
              </div>
            ))}
          </div>
        )}
        <div onClick={() => resetFilter()} className="w-100 d-flex px-3 btn-link mt-5 text-dark border-info mb-2 justify-content-center point">
          <div>Reset filter</div>
        </div>
        <ul className="list-group mx-lg-5 shadow-sm" style={{ borderRadius: "10px" }}>
          <li className="price-filter list-group-item d-flex flex-column">
            <div className="d-flex flex-row justify-content-between">
              <p className="fw-bold" style={{ marginRight: "32px" }}>
                Price
              </p>
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
          <li className="price-filter list-group-item d-flex flex-column">
            <div className="d-flex flex-row justify-content-between">
              <p className="fw-bold">Bedroom</p>
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
          <li className="price-filter list-group-item d-flex flex-column">
            <div className="d-flex flex-row justify-content-between">
              <p className="fw-bold">Bathroom</p>
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
          <li className="price-filter list-group-item d-flex flex-row justify-content-between">
            <div className="d-flex flex-row justify-content-between fw-bold">
              <p className="fw-bold" style={{ marginRight: "5px" }}>
                Utilities Included:
              </p>
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
            </div>
          </li>
          <li className="furnished-filter list-group-item d-flex flex-row justify-content-between">
            <div className="d-flex flex-row justify-content-between fw-bold">
              <p className="fw-bold" style={{ marginRight: "30px" }}>
                Furnished:
              </p>
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
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default connect()(FilterSearchDesktop);
