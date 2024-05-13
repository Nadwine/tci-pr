import React, { useEffect, useMemo } from "react";
import Footer from "./components/Footer";
import { useAppContext } from "./Context";
import { Route, Routes, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AccountTypeEnum, ReactRoutesEnum } from "../../types/enums";
import RegisterConfirm from "./pages/RegisterConfirm";
import Navbar from "./components/Navbar";
import { connect, useDispatch } from "react-redux";
import RequireLogin from "./hooks-utils/RequireLogin";
import RequireLogout from "./hooks-utils/RequireLogout";
import verifyAuthState from "../utils/verifyAuthState";
import { useState } from "react";
import axios from "axios";
import { LoadingSpinnerWholePage } from "./components/LoadingSpinners";
import Home from "./pages/Home";
import CookieConsentModal from "./components/CookieConsentModal";
import { setAppBuildNumber, setBrowserInfo, setEnvironment, setVisitorId } from "./redux/reducers/authReducer";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LanguageDetector from "i18next-browser-languagedetector";
import translations from "./translations/translations";
import LanguageSelector from "./components/LanguageSelector";
import RequirePermission from "./hooks-utils/RequirePermission";
import CreateListing from "./pages/CreateListing";
import SearchRentResults from "./pages/SearchRentResults";
import ViewRentProperty from "./pages/ViewRentProperty";
import Help from "./pages/Help";
import MobileMessageEnquiries from "./pages/MobileMessageEnquiries";
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
import AdminUserTable from "./components/admin/AdminUserTable";
import LandlordDashboard from "./pages/landlord/LandlordDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SubmitListingRedirect from "./pages/landlord/SubmitListingRedirect";
import LandLordCreateListing from "./pages/landlord/LandLordCreateListing";
import AboutLandlord from "./pages/AboutLandlord";
import NotFound from "./pages/NotFound";
import { useSelector } from "react-redux";
import AdminSidebar from "./components/admin/AdminSidebar";
import AdminApproveListingsTable, { AdminApproveListingTable } from "./components/admin/AdminApproveListingsTable";
import { AdminLandlordTable } from "./components/admin/AdminLandlordTable";
import AdminListingsTable from "./components/admin/AdminListingsTable";
import Landlord from "./pages/Landlord";
import MyTenancy from "./pages/MyTenancy";
import ManageSingleProperty from "./pages/landlord-n-admin/ManageSingleProperty";
import AdminTenancyTable from "./components/admin/AdminTenancyTable";
import TermsAndConditions from "./pages/TermsAndConditions";
import CookieTerms from "./pages/CookieTerms";
import PrivacyTerms from "./pages/PrivacyTerms";
import MeetTheTeam from "./pages/MeetTheTeam";
import TenantDashboard from "./pages/TenantDashboard";
import Safety from "./pages/Safety";
import Favourites from "./pages/Favourites";
import AcceptInvitation from "./pages/AcceptInvitation";
import RentPaymentsAndExpense from "./pages/landlord-n-admin/RentPaymentsAndExpense";
import { HelmetProvider } from "react-helmet-async";
import DisableWebsiteBanner from "./components/DisableWebsiteBanner";
import { AddToHomeScreen } from "./pages/AddToHomeScreen";
const tenMinute = 600000;
const thirtyMinutes = 1800000;

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
  const { pathname } = useLocation();

  const [loadingCredentials, setLoadingCredentials] = useState(true);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const loginUsr = useSelector((r: RootState) => r.auth.user);
  const isAdmin = loginUsr?.accountType === "admin";

  useEffect(() => {
    // initTranslations();
    axios.get("/api/environment").then(res => {
      res.data && dispatcher(setEnvironment(res.data));
    });

    verifyAuthState()
      .then(() => setLoadingCredentials(false))
      .catch(() => setLoadingCredentials(false));

    const interval = setInterval(async () => {
      const res = await axios.get("/api/auth/refresh-perms");
      const newAppBuildNumber = res.data?.appBuildNumber;
      console.log("checking new app version...");
      const currentAppBuildNumber = store.getState().auth.appBuildNumber;
      if (currentAppBuildNumber && currentAppBuildNumber < newAppBuildNumber) {
        window.alert("New Software version. Confirm to update");
        window.location.reload();
      }
    }, thirtyMinutes);

    axios.get("/api/auth/refresh-perms").then(res => {
      const newAppBuildNumber = res.data?.appBuildNumber;
      dispatcher(setAppBuildNumber(newAppBuildNumber));
    });

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const messageRefreshInterval = setInterval(async () => {
      if (store.getState().auth.user?.id && window.location.pathname === "/enquiries") {
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

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    if (pathname !== "/about") window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    // Cookie
    const consent = window && window.localStorage.getItem("makit_cookie_consent");
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

  const ReoccurringPaymentNotify = () => (
    <h5 className="text-center mt-5 text-success">
      Your reoccurring payment is now setup <br />
      <i className="fs-2 bi bi-calendar-check-fill" />
    </h5>
  );

  const SuccessPaymentNotify = () => (
    <h5 className="text-center mt-5 text-success">
      Payment Success <br />
      <i className="fs-2 bi bi-check" />
    </h5>
  );

  return (
    <div className="d-flex flex-column bg-light" style={{ minHeight: "95vh" }}>
      {/* <DisableWebsiteBanner /> */}
      <HelmetProvider>
        <Navbar />
        {showCookieConsent && <CookieConsentModal style={{ maxHeight: "150px" }} />}
        <section id="root-div" className="container-fluid" style={{ flex: 1, paddingLeft: `${isAdmin ? "50px" : ""}` }}>
          {" "}
          {/** Padding for sidebar */}
          <div className="row">
            {isAdmin && <AdminSidebar />}
            <ToastContainer hideProgressBar />
            <Routes>
              {/* Do not use Raw Strings as routes. Add it to enums stored in ./utils/enums */}
              {/* TODO add all URLS in the enum and replace them on server and client */}
              <Route index element={<Home />} />
              <Route path={ReactRoutesEnum.REGISTERCONFIRM} element={<RegisterConfirm />} />
              <Route path={ReactRoutesEnum.REGISTER} element={<RequireLogout view={<Register />} />} />
              <Route path={ReactRoutesEnum.LOGIN} element={<RequireLogout view={<Login />} />} />
              <Route path="app" element={<AddToHomeScreen />} />
              <Route path="condition-terms" element={<TermsAndConditions />} />
              <Route path="cookie-terms" element={<CookieTerms />} />
              <Route path="privacy-terms" element={<PrivacyTerms />} />
              <Route path="create-listing" element={<RequirePermission view={<CreateListing />} roles={["admin"]} />} />
              <Route path="edit-listing/rent/:id" element={<RequirePermission view={<EditRentListing />} roles={["landlord", "admin"]} />} />
              <Route path="search/rent" element={<SearchRentResults />} />
              <Route path="help" element={<Help />} />
              <Route path="products" element={<Products />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="temp" element={<TempHome />} />
              <Route path="about/us/landlord" element={<Landlord />} />
              <Route path="user" element={<RequireLogin view={<UserProfile />} />} />
              <Route path="listing-success" element={<SubmitListingRedirect />} />
              <Route path="landlord/dashboard" element={<RequirePermission view={<LandlordDashboard />} roles={["landlord"]} />} />
              <Route path="landlord/create-listing" element={<RequirePermission view={<LandLordCreateListing />} roles={["landlord"]} />} />
              <Route path="about/landlord" element={<AboutLandlord />} />
              <Route path="my-tenancy" element={<MyTenancy />} />
              <Route path="about" element={<AboutUs />} />
              <Route path="rent/safety" element={<Safety />} />
              <Route path="rent/saved-properties" element={<RequireLogin view={<Favourites />} />} />
              <Route path="team" element={<MeetTheTeam />} />
              <Route path="manage-property/rent/:id/finance" element={<RequirePermission view={<RentPaymentsAndExpense />} roles={["admin", "landlord"]} />} />
              <Route path="manage-property/rent/:id" element={<RequirePermission view={<ManageSingleProperty />} roles={["landlord", "admin"]} />} />
              <Route path="manage-tenancy/:property_tenant_id" element={<div></div>} />
              <Route path="admin/dashboard/listing-for-aproval" element={<RequirePermission view={<AdminApproveListingTable />} roles={["admin"]} />} />
              <Route path="admin/dashboard/tenancies" element={<RequirePermission view={<AdminTenancyTable />} roles={["admin"]} />} />
              <Route path="admin/dashboard/users" element={<RequirePermission view={<AdminUserTable />} roles={["admin"]} />} />
              <Route path="admin/dashboard/landlords" element={<RequirePermission view={<AdminLandlordTable />} roles={["admin"]} />} />
              <Route path="admin/dashboard/listings" element={<RequirePermission view={<AdminListingsTable />} roles={["admin"]} />} />
              <Route path="admin/dashboard" element={<RequirePermission view={<AdminDashboard />} roles={["admin"]} />} />
              <Route path="property/rent/:id" element={<ViewRentProperty />} />
              <Route path="property/rent/:id/payments" element={<RequirePermission view={<ListingPayment />} roles={["admin"]} />} />
              <Route path="forget-password/:token" element={<ForgetPassword />} />
              <Route path="payments/rent/success" element={<ReoccurringPaymentNotify />} />
              <Route path="payments/success" element={<SuccessPaymentNotify />} />
              <Route path="enquiries" element={<RequireLogin view={<MobileMessageEnquiries />} />} />
              <Route path="invite/accept" element={<AcceptInvitation />} />
              <Route path="admin/listings" element={<RequirePermission view={<AdminViewListings />} roles={["landlord", "admin"]} />} />
              <Route path="user/dashboard" element={<RequirePermission view={<TenantDashboard />} roles={["tenant"]} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </section>
        <Footer />
        {/* <LanguageSelector /> */}
      </HelmetProvider>
    </div>
  );
};

export default connect()(Main);
