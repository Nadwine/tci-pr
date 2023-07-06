import React from "react";
import { connect } from "react-redux";

type FilterSearchDesktopProps = {
  setSearchText: (string) => void;
  searchRent: () => void;
  searchText: string;
};

const FilterSearchDesktop = (props: FilterSearchDesktopProps) => {
  const { searchRent, setSearchText, searchText } = props;

  return (
    <div style={{ height: "89vh" }} className="desktop-filter card mb-3 d-none d-md-flex d-lg-flex d-xl-flex position-fixed">
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
    </div>
  );
};

export default connect()(FilterSearchDesktop);
