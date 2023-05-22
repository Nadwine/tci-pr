import React, { useEffect, useMemo } from "react";
import Footer from "../components/Footer";
import { useAppContext } from "../Context";
import { Route, Routes } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Register from "./Register";
import Login from "./Login";
import { RoutesEnum } from "../../utils/enums";
import RegisterConfirm from "./RegisterConfirm";
import Navbar from "../components/Navbar";
import { connect, useDispatch } from "react-redux";
import RequireLogin from "../components/RequireLogin";
import RequireLogout from "../components/RequireLogout";
import verifyAuthState from "../../utils/verifyAuthState";
import { useState } from "react";
import axios from "axios";
import { LoadingSpinnerWholePage } from "../components/LoadingSpinners";
import HomeFeed from "./HomeFeed";
import CookieConsentModal from "../components/CookieConsentModal";
import { setBrowserInfo, setVisitorId } from "../redux/reducers/authReducer";
const threeMinute = 180000;

const Main = () => {
  const dispatcher = useDispatch();
  const { name, setName } = useAppContext();
  const [loadingCredentials, setLoadingCredentials] = useState(true);
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  useEffect(() => {
    verifyAuthState()
      .then(() => setLoadingCredentials(false))
      .catch(() => setLoadingCredentials(false));

    const interval = setInterval(async () => {
      const now = new Date(Date.now());
      await axios
        .get("/api/auth/refresh-perms")
        .then(() => console.log(`${now.toISOString()} - refresh user permissions`));
    }, threeMinute);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Cookie
    const consent = window && window.sessionStorage.getItem("makit_cookie_consent");
    if (!consent) setShowCookieConsent(true);

    // visitor Id (used to track logged out users)
    let storedVisitorId = window.localStorage.getItem("makit_visitor_id") || "";
    const newVisitorId = uuidv4();
    if (!storedVisitorId) storedVisitorId = newVisitorId;

    localStorage.setItem("makit_visitor_id", storedVisitorId);
    dispatcher(setVisitorId(storedVisitorId));

    // window.navigator.userAgent
    const browserInfo = window.navigator.userAgent;
    dispatcher(setBrowserInfo(browserInfo));
  }, []);

  if (loadingCredentials) {
    return <LoadingSpinnerWholePage />;
  }

  return (
    <div className="d-flex flex-column bg-light" style={{ minHeight: "95vh" }}>
      <Navbar />
      {showCookieConsent && <CookieConsentModal />}
      <section className="container-fluid" style={{ flex: 1 }}>
        <div className="row">
          <Routes>
            {/* Do not use Raw Strings as routes. Add it to enums stored in ./utils/enums */}
            {/* TODO add all URLS in the enum and replace them on server and client */}
            <Route index element={<HomeFeed />} />
            <Route path={RoutesEnum.REGISTERCONFIRM} element={<RegisterConfirm />} />
            <Route path={RoutesEnum.REGISTER} element={<RequireLogout view={<Register />} />} />
            <Route path={RoutesEnum.LOGIN} element={<RequireLogout view={<Login />} />} />
            <Route path="*" element={<p>Theres nothing here: 404!</p>} />
          </Routes>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default connect()(Main);
