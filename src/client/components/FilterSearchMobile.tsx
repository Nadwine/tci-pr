import React from "react";
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
    </div>
  );
};

export default connect()(FilterSearchMobile);
