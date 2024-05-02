import React from "react";

export const AddToHomeScreen = () => {
  return (
    <div>
      <h5 className="py-3 fw-bold">Installing TCI Homebase web app</h5>
      <p>Whiles on this page, follow the instructions below for your respected IOS or Android device</p>

      <div className="d-flex flex-wrap justify-content-center w-100 pt-5 ps-4">
        <div className="col-md-3 fw-bold">
          <p>
            <i className="bi bi-apple"></i> IOS
          </p>
          <img className="pb-5" src="/static/ios-add-to-home-screen.jpg" width={200} />
        </div>
        <div className="col-md-6 fw-bold mb-5">
          <p>
            <i className="bi bi-android2"></i> Android
          </p>
          <img src="/static/android-add-to-home-screen.jpg" width={200} />
        </div>
      </div>
    </div>
  );
};
