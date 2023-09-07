import React, { useEffect, useMemo } from "react";
import Footer from "../components/Footer";
import { useAppContext } from "../Context";
import { Route, Routes } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Register from "./Register";
import Login from "./Login";
import { AccountTypeEnum, ReactRoutesEnum } from "../../../types/enums";
import RegisterConfirm from "./RegisterConfirm";
import Navbar from "../components/Navbar";
import { connect, useDispatch } from "react-redux";
import RequireLogin from "../components/RequireLogin";
import RequireLogout from "../components/RequireLogout";
import verifyAuthState from "../../utils/verifyAuthState";
import { useState } from "react";
import axios from "axios";
import { LoadingSpinnerWholePage } from "../components/LoadingSpinners";
import Home from "./Home";
import CookieConsentModal from "../components/CookieConsentModal";
import { setBrowserInfo, setVisitorId } from "../redux/reducers/authReducer";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LanguageDetector from "i18next-browser-languagedetector";
import translations from "../translations/translations";
import LanguageSelector from "../components/LanguageSelector";
import RequirePermission from "../components/RequirePermission";
import CreateListing from "./CreateListing";
import SearchRentResults from "./SearchRentResults";
import ViewRentProperty from "./ViewRentProperty";
import Help from "./Help";
import MessageEnquiries from "./MessageEnquiries";
const threeMinute = 180000;

function initTranslations() {
  i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
      debug: true,
      fallbackLng: "en",
      interpolation: {
        escapeValue: false // not needed for react as it escapes by default
      },
      resources: {
        en: translations.en,
        es: translations.es,
        fr: translations.fr
      }
    });
}

const Main = () => {
  const dispatcher = useDispatch();
  const { name, setName } = useAppContext();
  const [loadingCredentials, setLoadingCredentials] = useState(true);
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  useEffect(() => {
    // initTranslations();
    verifyAuthState()
      .then(() => setLoadingCredentials(false))
      .catch(() => setLoadingCredentials(false));

    const interval = setInterval(async () => {
      const now = new Date(Date.now());
      await axios.get("/api/auth/refresh-perms").then(() => console.log(`${now.toISOString()} - refresh user permissions`));
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
          <ToastContainer hideProgressBar />
          <Routes>
            {/* Do not use Raw Strings as routes. Add it to enums stored in ./utils/enums */}
            {/* TODO add all URLS in the enum and replace them on server and client */}
            <Route index element={<Home />} />
            <Route path={ReactRoutesEnum.ADMIN} element={<RequirePermission view={<h1>Hi Admin</h1>} roles={[AccountTypeEnum.ADMIN]} />} />
            <Route path={ReactRoutesEnum.REGISTERCONFIRM} element={<RegisterConfirm />} />
            <Route path={ReactRoutesEnum.REGISTER} element={<RequireLogout view={<Register />} />} />
            <Route path={ReactRoutesEnum.LOGIN} element={<RequireLogout view={<Login />} />} />
            <Route path="create-listing" element={<RequirePermission view={<CreateListing />} roles={[AccountTypeEnum.LANDLORD, AccountTypeEnum.ADMIN]} />} />
            <Route path="search/rent" element={<SearchRentResults />} />
            <Route path="help" element={<Help />} />
            <Route path="property/rent/:id" element={<ViewRentProperty />} />
            <Route path="enquiries" element={<RequireLogin view={<MessageEnquiries />} />} />
            <Route path="*" element={<h1 className="text-center pt-5">Theres nothing here: 404!</h1>} />
          </Routes>
        </div>
      </section>
      <Footer />
      {/* <LanguageSelector /> */}
    </div>
  );
};

export default connect()(Main);
