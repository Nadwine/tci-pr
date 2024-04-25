import React from "react";

export default function DisableWebsiteBanner() {
  return (
    <div className="COVER_WEB" style={{ width: "100vw", height: "100vh", position: "fixed", backgroundColor: "#ffffffd9", zIndex: 9999, marginTop: "-65px" }}>
      <div
        className="bg-primary px-md-0"
        style={{
          width: "121vw",
          textAlign: "center",
          marginTop: "45vh",
          marginLeft: "-11vw",
          transform: "rotate(25deg)",
          paddingLeft: "30px",
          paddingRight: "30px",
          minHeight: "4em",
          paddingTop: "10px",
          paddingBottom: "10px",
          display: "flex",
          alignItems: "center",
          boxShadow: "0px 18px 32px 0px rgba(0,0,0,0.40)",
          justifyContent: "center"
        }}
      >
        TCI Homebase coming soon. Meanwhile, bookmark this website and come back here when we launch!
      </div>
    </div>
  );
}
