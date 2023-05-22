import React from "react";

export function LoadingSpinnerWholePage() {
  return (
    <div className="d-flex w-100 h-100 justify-content-center">
      <div className="spinner-border text-danger" role="status" />
    </div>
  );
}

const styles = {
  height: "inherit",
  alignSelf: "stretch",
  margin: "0 2px"
};

export function LoadingSpinnerComponent() {
  return (
    <div className="d-block col justify-content-center" style={styles}>
      <div className="w-100"></div>
      <div className="spinner-border text-danger" role="status" />
    </div>
  );
}
