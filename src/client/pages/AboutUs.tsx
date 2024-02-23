import axios from "axios";
import dayjs from "dayjs";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const AboutUs = props => {
  const [searchParams, setSearchParams] = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const now = dayjs();
    const lastSuccessfulSent = localStorage.getItem("contact_us_sent_at_1");
    const timeAdded = dayjs(lastSuccessfulSent).add(12, "hour");
    const coolDownPassed = dayjs(timeAdded).isBefore(now);

    if (coolDownPassed === false && lastSuccessfulSent != null) {
      toast.error("Please wait to send another form");
      formRef.current?.reset();
      return;
    }

    const formData = new FormData(formRef.current || undefined);
    const body: any = {};
    for (var pair of formData.entries()) {
      body[pair[0]] = pair[1];
    }
    const res = await axios.post("/api/mailing/contact-us", body);
    if (res.status === 200) {
      toast.success("Message sent");
      localStorage.setItem("contact_us_sent_at_1", dayjs().toString());
      formRef.current?.reset();
    } else {
      toast.error(res.data.message);
    }
  }

  useEffect(() => {
    const focus = searchParams.get("focus-contact");
    if (focus) {
      document.getElementById("contact-btn")?.focus();
    }
  }, []);

  return (
    <div className="about-us ps-3 w-sm-100">
      {/* <div className="py-4" style={{ backgroundColor: "white", height: "5rem" }}>
        <h4 className="ps-5 fw-bolder">About TCI Homebase Property Management</h4>{" "}
      </div> */}
      <div className="welcome-search justify-content-center">
        <div className="justify-content-center shadow-sm align-items-center" style={{ height: "210px", marginLeft: "0px" }}>
          <div
            className="image-container"
            style={{
              position: "absolute",
              padding: "0px",
              maxHeight: "215px",
              marginLeft: "0px",
              width: "100%",
              filter: "sepia(5%) saturate(160%) brightness(70%) hue-rotate(341deg)",
              overflow: "hidden"
            }}
          >
            <img src="/static/about.jpg" style={{ marginTop: "-530px", width: 2000 }} className="home-photo.jpg"></img>
          </div>
          <h1
            className="position-absolute fw-bold w-100 mb-lg-3 mt-lg-2 mt-sm-5 mb-sm-2 ps-md-5 ps-2"
            style={{ zIndex: +1, position: "relative", paddingTop: "60px", textAlign: "left", color: "white" }}
          >
            About TCI Homebase <p className="text-break">Property Management</p>
          </h1>
        </div>
      </div>
      <div className="mx-lg-5 pt-5 fs-6">
        Introducing TCI Homebase, your premier partner in property management across the breathtaking landscape of the Turks and Caicos Islands! Nestled in the
        heart of Providenciales, our licensed company extends its reach to serve all the islands within this captivating archipelago.
      </div>
      <div className="d-flex flex-row flex-wrap justify-content-start">
        <div className="card col-md-4 w-sm-100 m-lg-4 ms-5" style={{ backgroundColor: "#055160", boxShadow: "10px 10px 5px 0px rgba(0,0,0,0.37)" }}>
          <div className="card-body">
            <p className="ms-3 text-light fw-bolder" style={{ fontSize: "40px" }}>
              CONTACT US!
            </p>
            <form ref={formRef} onSubmit={handleSubmit}>
              <div className="card-body">
                <div className="mb-1">
                  <label htmlFor="exampleFormControlInput1" id="contact-us-form" className="form-label text-light">
                    First Name
                  </label>
                  <input name="firstName" type="text" className="form-control" id="exampleFormControlInput1" placeholder="" required />
                </div>
                <div className="mb-1">
                  <label htmlFor="exampleFormControlInput1" className="form-label text-light">
                    Last Name
                  </label>
                  <input name="lastName" type="text" className="form-control" id="exampleFormControlInput1" placeholder="" required />
                </div>
                <div className="mb-1">
                  <label htmlFor="exampleFormControlInput1" className="form-label text-light">
                    Email
                  </label>
                  <input name="email" type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" required />
                </div>
                <div className="mb-1">
                  <label htmlFor="exampleFormControlTextarea1" className="form-label text-light">
                    Message
                  </label>
                  <textarea name="message" className="form-control" id="exampleFormControlTextarea1" required></textarea>
                </div>
                <div className="d-grid gap-2">
                  <button className="btn btn text-light fw-bold" id="contact-btn" type="submit" style={{ backgroundColor: "#0aa2c0" }}>
                    Contact Our Agents Now!
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-3 col-md-6">
          <p className="fs-6 ms-md-5 mt-3 fw-bold ms-lg-5" style={{ color: "#055160" }}>
            Helping the residents of the Turks and Caicos Islands find their next home! At TCI Homebase, we pride ourselves on pioneering digital solutions that
            revolutionize the way properties are paired with their ideal occupants. Whether you{"'"}re a discerning landlord or a homeowner with a property gem,
            our expert team is dedicated to showcasing your listing with precision and finesse, ensuring it finds its perfect match in record time.
          </p>
          <p className="ms-5 fs-6 text-dark fw-bolder">
            Experience peace of mind as we handle the intricate details of property management, from tenant screening to lease agreements, utilizing
            cutting-edge technology to streamline the process and maximize your returns.
          </p>
          <p className="fs-6 ms-5 fw-bold">
            Unlock the full potential of your property investment with TCI Homebase, where innovation meets expertise, and your satisfaction is our ultimate
            priority. Let us be your trusted partner in realizing your real estate aspirations in the Turks and Caicos Islands.
          </p>
          <p className="fs-6 ms-5 mt-4">
            Are you interested in promoting your business on our site? Contact us on tci.homebase.tc@gmail.com or at +1(649) 348-4021
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
