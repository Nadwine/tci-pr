import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import { connect } from "react-redux";
import islands from "../../utils/islandsData.json";

const CreateRentForm = props => {
  const [fileBlobRef, setFileBlobRef] = useState<string[]>([]);

  const { values, errors, touched, handleSubmit, handleChange, handleBlur, setFieldValue } = useFormik({
    initialValues: {
      title: "",
      description: "",
      numOfRooms: "",
      numOfBathRooms: "",
      maxTenant: "",
      rentAmount: "",
      sqFt: "",
      billsIncluded: false,
      availability: "",
      addressLine1: "",
      addressLine2: "",
      settlement: "",
      city: "",
      postcode: "",
      country: "",
      files: [] as File[]
    },
    async onSubmit(formValues, formikHelpers) {
      const body = {
        files: formValues.files,
        title: formValues.title,
        description: formValues.description,
        numOfRooms: formValues.numOfRooms,
        numOfBathRooms: formValues.numOfBathRooms,
        maxTenant: formValues.maxTenant,
        rentAmount: formValues.rentAmount,
        sqFt: formValues.sqFt,
        billsIncluded: formValues.billsIncluded,
        availability: formValues.availability,
        addressLine1: formValues.addressLine1,
        addressLine2: formValues.addressLine2,
        settlement: formValues.settlement,
        city: formValues.city,
        postcode: "TKCA 1ZZ",
        country: "Turks & Caicos Islands"
      };
      const data = null;
      console.log(formValues.billsIncluded);
      // const response = await axios.post("/api/listing/rent/create", body);
    },
    validate(values) {
      //
    }
  });
  const onchangeDisplayImages = (filesArray: any[]) => {
    if (filesArray.length === 0) return;
    const fileBlobs = filesArray.map(blob => URL.createObjectURL(blob));
    setFileBlobRef(fileBlobs);

    // ![image](blob:http://localhost:8080/97bf531f-defc-4d65-8bf2-17459be8ed2d)
    // ![image](https://nl-at-media-prod.s3.eu-west-2.amazonaws.com/130/203/925/bunny_1by1.mp4)
  };
  const selectedIsland = islands.find(i => i.key === values.city);

  return (
    <div className="create-rent-form d-flex justify-content-center row">
      <div className="col-md-6 col-sm-10 col-lg-5">
        <form onSubmit={handleSubmit}>
          <h5 className="text-center pb-4 pt-3">Add property for rent</h5>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Island
            </label>
            <select name="city" onChange={handleChange} value={values.city} className="form-select">
              <option selected value="">
                Select an option
              </option>
              {islands.map((c, i) => (
                <option key={i} value={c.key}>
                  {c.displayLabel}
                </option>
              ))}
            </select>
          </div>
          {values.city && (
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Settlement
              </label>
              <select name="settlement" onChange={handleChange} value={values.settlement} className="form-select">
                <option selected value="">
                  Select an option
                </option>
                {selectedIsland?.settlements.map((s, i) => (
                  <option key={i} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="addressLine1" className="form-label">
              Address Line 1
            </label>
            <input name="addressLine1" value={values.addressLine1} onChange={handleChange} type="text" className="form-control" />
          </div>
          <div className="mb-3">
            <label htmlFor="addressLine2" className="form-label">
              Address Line 2
            </label>
            <input name="addressLine2" value={values.addressLine2} onChange={handleChange} type="text" className="form-control" />
          </div>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input name="title" value={values.title} onChange={handleChange} type="text" className="form-control" />
          </div>
          <div className="mb-3">
            <label htmlFor="maxTenant" className="form-label">
              Max tenant
            </label>
            <input name="maxTenant" value={values.maxTenant} onChange={handleChange} type="number" className="form-control" />
          </div>
          <div className="mb-3">
            <label htmlFor="numOfRooms" className="form-label">
              Rooms
            </label>
            <input name="numOfRooms" value={values.numOfRooms} onChange={handleChange} type="number" className="form-control" />
          </div>
          <div className="mb-3">
            <label htmlFor="numOfBathRooms" className="form-label">
              Baths
            </label>
            <input name="numOfBathRooms" value={values.numOfBathRooms} onChange={handleChange} type="number" className="form-control" />
          </div>
          <div className="mb-3">
            <label htmlFor="sqFt" className="form-label">
              Square feet
            </label>
            <input name="sqFt" value={values.sqFt} onChange={handleChange} type="number" className="form-control" />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea name="description" value={values.description} onChange={handleChange} className="form-control" placeholder="Additional details" />
          </div>
          <div className="mb-3">
            <label htmlFor="availability" className="form-label">
              Availability
            </label>
            <input name="availability" value={values.availability} onChange={handleChange} className="form-control" type="date" />
          </div>
          <div className="input-group mb-3">
            <label htmlFor="rentAmount" className="form-label w-100">
              Rent per month
            </label>
            <span className="input-group-text">$</span>
            <input name="rentAmount" value={values.rentAmount} onChange={handleChange} type="number" className="form-control" />
            <span className="input-group-text">.00</span>
          </div>
          <div className="mb-3 form-check">
            <input name="billsIncluded" type="checkbox" className="form-check-input" onChange={handleChange} />
            <label className="form-check-label" htmlFor="billsIncluded">
              Bills Included
            </label>
          </div>
          <div className="row images-container rounded-3" style={{ backgroundColor: "#80808030", minHeight: 100 }}>
            {values.files.length === 0 && <div className="w-100 text-center pt-4 text-secondary">No Files</div>}
            {values.files.length > 0 &&
              fileBlobRef.map((blob, index) => (
                <div className="image-box d-flex" data-file-index={index} key={index} style={{ width: 200 }}>
                  <div className="image">
                    <button
                      className="position-absolute btn-sm btn-danger"
                      type="button"
                      onClick={() => {
                        const filesLeftAfterRemove = values.files.filter((img, i) => i !== index);
                        // remove from fromik
                        setFieldValue("files", filesLeftAfterRemove);
                        // update image blob render
                        onchangeDisplayImages(filesLeftAfterRemove);
                      }}
                    >
                      <i className=" bi-x-lg" />
                    </button>
                    {values.files[index]?.type.includes("image") && (
                      <img
                        data-file-index={index}
                        width={150}
                        draggable
                        src={blob}
                        onDragStart={e => {
                          e.dataTransfer.setData("file-index", `${index}`);
                          e.dataTransfer.setData("file-type", values.files[index].type);
                          console.log(values.files[index].type);
                        }}
                      />
                    )}
                    {values.files[index]?.type.includes("video") && (
                      <video
                        data-file-index={index}
                        width={150}
                        controls
                        draggable
                        src={blob}
                        onDragStart={e => {
                          e.dataTransfer.setData("file-index", `${index}`);
                          e.dataTransfer.setData("file-type", values.files[index].type);
                          console.log(values.files[index].type);
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
          </div>
          <div>
            <input
              style={{ width: "6.8em" }}
              className="form-control mb-5 ms-auto mt-2"
              type="file"
              id="formFileMultiple"
              onChange={event => {
                if (!event.target.files) return;
                const filesArray = Array.from(event.target.files);
                const existingFiles = [...values.files];
                const combinedFiles = [...existingFiles, ...filesArray];
                values.files = combinedFiles;
                onchangeDisplayImages(combinedFiles);
                event.target.value = "";
              }}
              multiple
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default connect()(CreateRentForm);
