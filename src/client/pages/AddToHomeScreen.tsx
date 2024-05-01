import React from "react";

export const AddToHomeScreen = () => {
  return (
    <div>
      <h5 className="py-3">Installing TCI Homebase web app</h5>
      <p>Whiles on this page, follow the instructions below for your respected IOS or Android device</p>

      <div className="d-flex flex-wrap justify-content-center w-100 pt-5">
        <div className="col-md-3">
          <p>ISO</p>
          <img className="pb-5" src="/static/ios-add-to-home-screen.jpg" width={200} />
        </div>
        <div className="col-md-6">
          <p>Android</p>
          <img src="/static/android-add-to-home-screen.jpg" width={200} />
        </div>
      </div>
    </div>
  );
};
