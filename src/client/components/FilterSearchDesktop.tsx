import React from "react";
import { connect } from "react-redux";

type FilterSearchDesktopProps = {
  setSearchText: (string) => void;
  searchText: string;
};

const FilterSearchDesktop = (props: FilterSearchDesktopProps) => {
  return (
    <div className="desktop-filter card mb-3 d-none d-md-flex d-lg-flex d-xl-flex">
      <div className="card-body">
        <input onChange={e => props.setSearchText(e.target.value)} value={props.searchText} type="text" className="form-control" placeholder="Search ......" />
      </div>
    </div>
  );
};

export default connect()(FilterSearchDesktop);
