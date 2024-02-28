import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { Formik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const Feedback = props => {
  const navigate = useNavigate();

  const submitFeedback = async formData => {
    const postData = {
      contentSatisfaction: formData.contentSatisfaction,
      recommendation: formData.recommendation,
      additionalFeedback: formData.additionalFeedback
    };
    const res = await axios.post("/api/feedback/create", postData);
    if (res.status == 200) {
      toast.success("Thanks for your feedback!");
      setTimeout(() => navigate("/"), 3000);
    }
  };
  return (
    <Modal data-testid="feedback-modal" show={true}>
      <Modal.Header>
        <Modal.Title data-testid="feedback-header" style={{ textAlign: "center", width: "100%", fontWeight: "bold" }}>
          <i style={{ color: "green", fontSize: "20px" }} className="bi bi-chat-square-heart-fill" /> Send us your feedback!
        </Modal.Title>
        <button onClick={() => navigate("/")} type="button" className="btn-close" />
      </Modal.Header>

      <Modal.Body>
        <Formik
          initialValues={{
            contentSatisfaction: "",
            recommendation: "",
            additionalFeedback: ""
          }}
          // -------Validation ----------------
          validate={values => {
            const errors = {};
            if (!values.contentSatisfaction) {
              // @ts-ignore
              errors.contentSatisfaction = "* Please select an option";
            }
            if (!values.recommendation) {
              // @ts-ignore
              errors.recommendation = "* Please select an option";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            submitFeedback(values);
            setSubmitting(false);
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form style={{ height: "420px", overflowY: "scroll" }} onSubmit={handleSubmit}>
              {/* content satisfaction */}
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="w-100 form-label">
                  How satisfied are you with the content on site?
                </label>
                <div className="w-100" style={{ fontSize: "12px", color: "red" }}>
                  {errors.contentSatisfaction && touched.contentSatisfaction && errors.contentSatisfaction}
                </div>
                <input
                  type="radio"
                  className="form-check-input mx-2"
                  name="contentSatisfaction"
                  value="very satisfied"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <label className="form-check-label">very</label>
                <br />
                <input
                  type="radio"
                  className="form-check-input mx-2"
                  name="contentSatisfaction"
                  value="somewhat satisfied"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <label className="form-check-label">somewhat</label>
                <br />
                <input
                  type="radio"
                  className="form-check-input mx-2"
                  name="contentSatisfaction"
                  value="unsatisfied"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <label className="form-check-label">unsatisfied</label>
                <br />
              </div>
              {/* recommendation */}
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="w-100 form-label">
                  How likely are you to recommend our site to a friend, family member or colleague?
                </label>
                <div className="w-100" style={{ fontSize: "12px", color: "red" }}>
                  {errors.recommendation && touched.recommendation && errors.recommendation}
                </div>
                <input type="radio" className="form-check-input mx-2" name="recommendation" value="very likely" onChange={handleChange} onBlur={handleBlur} />
                <label className="form-check-label">very</label>
                <br />
                <input
                  type="radio"
                  className="form-check-input mx-2"
                  name="recommendation"
                  value="somewhat likely"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <label className="form-check-label">somewhat</label>
                <br />
                <input type="radio" className="form-check-input mx-2" name="recommendation" value="unlikely" onChange={handleChange} onBlur={handleBlur} />
                <label className="form-check-label">unlikely</label>
                <br />
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="w-100 form-label">
                  Tell us how we can improve.
                </label>
                <textarea className="form-control" value={values.additionalFeedback} name="additionalFeedback" onChange={handleChange} onBlur={handleBlur} />
              </div>
              <div className="w-100 text-center">
                <button type="submit" className="btn btn-dark fw-bold">
                  Submit
                </button>
              </div>
            </form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
