import React from "react";
import { connect } from "react-redux";

type MobileFilterSearchProps = {
  setSearchText: (string) => void;
  searchText: string;
};

const FilterSearchMobile = (props: MobileFilterSearchProps) => {
  return (
    <div className="mobile-filter card mb-3 d-md-none d-lg-none d-xl-none">
      <div className="card-body">
        <input onChange={e => props.setSearchText(e.target.value)} value={props.searchText} type="text" className="form-control" placeholder="Search ......" />
      </div>
    </div>
  );
};

export default connect()(FilterSearchMobile);
