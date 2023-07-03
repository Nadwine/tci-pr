import { useFormik } from "formik";
import React from "react";
import { connect } from "react-redux";

const CreateSaleForm = props => {

  const { values, errors, touched, handleSubmit, handleChange, handleBlur, setFieldValue } = useFormik({
    initialValues: {
      listingType: ""
    },
    onSubmit(formValues, formikHelpers) {
      window.alert(JSON.stringify(formValues));
    },
    validate(values) {
      //
    },
  });

  return <div>Create Sale Form</div>;
};

export default connect()(CreateSaleForm);
