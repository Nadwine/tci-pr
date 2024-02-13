import React, { useEffect, useMemo } from "react";
import Footer from "./components/Footer";
import { useAppContext } from "./Context";
import { Route, Routes } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AccountTypeEnum, ReactRoutesEnum } from "../../types/enums";
import RegisterConfirm from "./pages/RegisterConfirm";
import Navbar from "./components/Navbar";
import { connect, useDispatch } from "react-redux";
import RequireLogin from "./components/RequireLogin";
import RequireLogout from "./components/RequireLogout";
import verifyAuthState from "../utils/verifyAuthState";
import { useState } from "react";
import axios from "axios";
import { LoadingSpinnerWholePage } from "./components/LoadingSpinners";
import Home from "./pages/Home";
import CookieConsentModal from "./components/CookieConsentModal";
import { setBrowserInfo, setVisitorId } from "./redux/reducers/authReducer";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LanguageDetector from "i18next-browser-languagedetector";
import translations from "./translations/translations";
import LanguageSelector from "./components/LanguageSelector";
import RequirePermission from "./components/RequirePermission";
import CreateListing from "./pages/CreateListing";
import SearchRentResults from "./pages/SearchRentResults";
import ViewRentProperty from "./pages/ViewRentProperty";
import Help from "./pages/Help";
import MessageEnquiries from "./pages/MessageEnquiries";
import { setActiveConversation, setConversations } from "./redux/reducers/messagesReducer";
import { RootState, store } from "./redux/store";
import AdminViewListings from "./pages/AdminViewListings";
import EditRentListing from "./pages/EditRentListing";
import ListingPayment from "./pages/ListingPayment";
import Products from "./pages/Products";
import Feedback from "./pages/Feedback";
import TempHome from "./pages/TempHome";
import UserProfile from "./pages/UserProfile";
import AboutUs from "./pages/AboutUs";
import ForgetPassword from "./pages/ForgetPassword";
import DesktopMessageEnquires from "./pages/DesktopMessageEnquires";
import AdminUserTable from "./components/AdminUserTable";
import LandlordDashboard from "./pages/LandlordDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SubmitListingRedirect from "./pages/SubmitListingRedirect";
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
    const messageRefreshInterval = setInterval(async () => {
      if (store.getState().auth.user?.id) {
        const res = await axios.get("/api/enquiry/latest");
        if (res.status === 200) {
          dispatcher(setConversations(res.data));

          const activeConvo = store.getState().message.activeConversation;
          if (activeConvo) {
            const newActiveConvo = res.data.find(c => c.id === activeConvo.id);
            store.dispatch(setActiveConversation(newActiveConvo));
          }
        }
      }
    }, 5000);

    return () => clearInterval(messageRefreshInterval);
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
            <Route path={ReactRoutesEnum.ADMIN} element={<RequirePermission view={<h1>Hi Admin</h1>} roles={["admin"]} />} />
            <Route path={ReactRoutesEnum.REGISTERCONFIRM} element={<RegisterConfirm />} />
            <Route path={ReactRoutesEnum.REGISTER} element={<RequireLogout view={<Register />} />} />
            <Route path={ReactRoutesEnum.LOGIN} element={<RequireLogout view={<Login />} />} />
            <Route path="create-listing" element={<RequirePermission view={<CreateListing />} roles={["landlord", "admin"]} />} />
            <Route path="edit-listing/rent/:id" element={<RequirePermission view={<EditRentListing />} roles={["landlord", "admin"]} />} />
            <Route path="search/rent" element={<SearchRentResults />} />
            <Route path="help" element={<Help />} />
            <Route path="products" element={<Products />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="temp" element={<TempHome />} />
            <Route path="user" element={<UserProfile />} />
            <Route path="/listing-message" element={<SubmitListingRedirect />} />
            <Route path="dashboard" element={<RequirePermission view={<LandlordDashboard />} roles={["landlord"]} />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="admin/dash" element={<RequirePermission view={<AdminDashboard />} roles={["admin"]} />} />
            <Route path="test/table" element={<AdminUserTable />} />
            <Route path="property/rent/:id" element={<ViewRentProperty />} />
            <Route path="property/rent/:id/payments" element={<RequirePermission view={<ListingPayment />} roles={["admin"]} />} />
            <Route path="forget-password/:token" element={<RequireLogout view={<ForgetPassword />} />} />
            <Route
              path="payments/rent/success"
              element={
                <h5 className="text-center mt-5 text-success">
                  Your reocurring payment is now setup <br />
                  <i className="fs-2 bi bi-calendar-check-fill" />
                </h5>
              }
            />
            <Route path="enquiries" element={<RequireLogin view={<MessageEnquiries />} />} />
            <Route path="admin/listings" element={<RequirePermission view={<AdminViewListings />} roles={["landlord", "admin"]} />} />
            <Route
              path="*"
              element={
                <div className="text-center">
                  <h1 className="text-center pt-5">Theres nothing here: 404!</h1> <p>The page you are looking for does not exist or have been removed</p>
                  <img src="/static/error.png"></img>
                </div>
              }
            />
          </Routes>
        </div>
      </section>
      <Footer />
      {/* <LanguageSelector /> */}
    </div>
  );
};

export default connect()(Main);
