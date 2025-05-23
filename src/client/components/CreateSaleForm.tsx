import axios from "axios";
import { useFormik } from "formik";
import { cloneDeep } from "lodash";
import React, { useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import islands from "../../utils/islandsData.json";

const axiosConfig = { headers: { "Content-Type": "multipart/form-data" } };

const CreateSaleForm = props => {
  const navigate = useNavigate();
  const [fileBlobRef, setFileBlobRef] = useState<string[]>([]);
  const [questionBeingTyped, setQuestionBeingTyped] = useState("");

  const { values, errors, touched, handleSubmit, handleChange, handleBlur, setFieldValue } = useFormik({
    initialValues: {
      title: "",
      description: "",
      numOfRooms: "",
      numOfBathRooms: "",
      sqFt: "",
      saleAmount: "",
      isFurnished: false,
      availability: "",
      addressLine1: "",
      addressLine2: "",
      settlement: "",
      city: "",
      postcode: "",
      country: "",
      files: [] as File[],
      questions: [] as string[]
    },
    async onSubmit(formValues, formikHelpers) {
      const body = {
        files: formValues.files,
        title: formValues.title,
        description: formValues.description,
        numOfRooms: formValues.numOfRooms,
        numOfBathRooms: formValues.numOfBathRooms,
        sqFt: formValues.sqFt,
        saleAmount: formValues.saleAmount,
        isFurnished: formValues.isFurnished,
        availability: formValues.availability,
        addressLine1: formValues.addressLine1,
        addressLine2: formValues.addressLine2,
        settlement: formValues.settlement,
        city: formValues.city,
        postcode: "TKCA 1ZZ",
        country: "Turks & Caicos Islands",
        questions: JSON.stringify(formValues.questions)
      };
      await axios
        .post("/api/listing/sale/create", body, axiosConfig)
        .then(res => navigate(`/search/sale?searchText=${body.city}&page=0`))
        .catch(err => console.log("/api/listing/sale/create", err));
    },
    validate(values) {
      // Add validations
    }
  });
  const onchangeDisplayImages = (filesArray: any[]) => {
    if (filesArray.length === 0) return;
    const fileBlobs = filesArray.map(blob => URL.createObjectURL(blob));
    setFileBlobRef(fileBlobs);
  };

  const appendQuestion = () => {
    if (questionBeingTyped !== "") {
      const newQuestions = [...values.questions, questionBeingTyped];
      setFieldValue("questions", newQuestions);
      setQuestionBeingTyped("");
    }
  };

  const removeQuestion = (index: number) => {
    const newQuestions = cloneDeep(values.questions);
    newQuestions.splice(index, 1);
    setFieldValue("questions", newQuestions);
  };

  const selectedIsland = islands.find(i => i.name === values.city);

  return (
    <div className="create-sale-form d-flex justify-content-center row">
      <div className="col-md-6 col-sm-10 col-lg-5">
        <form onSubmit={handleSubmit} onKeyPress={e => e.key === "Enter" && e.preventDefault()} onKeyUp={e => e.key === "Enter" && e.preventDefault()}>
          <h4 className="text-center pb-4 pt-3">Add property for sale</h4>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Island
            </label>
            <select name="city" onChange={handleChange} value={values.city} className="form-select">
              <option selected value="">
                Select an option
              </option>
              {islands.map((c, i) => (
                <option key={i} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          {values.city && selectedIsland && selectedIsland?.settlements.length > 1 && (
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
              Advert title
            </label>
            <input name="title" value={values.title} onChange={handleChange} type="text" className="form-control" />
          </div>
          <div className="mb-3">
            <label htmlFor="numOfRooms" className="form-label">
              Rooms
            </label>
            <input
              name="numOfRooms"
              value={values.numOfRooms}
              onChange={handleChange}
              type="number"
              onWheel={e => (e.target as HTMLElement)!.blur()}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="numOfBathRooms" className="form-label">
              Baths
            </label>
            <input
              name="numOfBathRooms"
              value={values.numOfBathRooms}
              onChange={handleChange}
              type="number"
              onWheel={e => (e.target as HTMLElement)!.blur()}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="sqFt" className="form-label">
              Square feet
            </label>
            <input
              name="sqFt"
              value={values.sqFt}
              onChange={handleChange}
              type="number"
              onWheel={e => (e.target as HTMLElement)!.blur()}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              onKeyUp={e => e.key === "Enter" && setFieldValue("description", values.description + "\r\n")}
              className="form-control"
              placeholder="Additional details"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="availability" className="form-label">
              Availability
            </label>
            <input name="availability" value={values.availability} onChange={handleChange} className="form-control" type="date" />
          </div>
          <div className="input-group mb-3">
            <label htmlFor="saleAmount" className="form-label w-100">
              Sale Amount
            </label>
            <span className="input-group-text">$</span>
            <input
              name="saleAmount"
              value={values.saleAmount}
              onChange={handleChange}
              type="number"
              onWheel={e => (e.target as HTMLElement)!.blur()}
              className="form-control"
            />
            <span className="input-group-text">.00</span>
          </div>
          <div className="mb-5 form-check">
            <input name="isFurnished" value={String(values.isFurnished)} type="checkbox" className="form-check-input" onChange={handleChange} />
            <label className="form-check-label" htmlFor="isFurnished">
              Furnished
            </label>
          </div>
          <div className="inclusions">
            <p className="fs-5 w-100 pt-2 mb-1">Photos/Videos</p>
          </div>
          <div className="row ms-1 me-1 images-container rounded-3" style={{ backgroundColor: "#80808030", minHeight: 100 }}>
            {values.files.length === 0 && <div className="w-100 text-center pt-4 text-secondary">No Files</div>}
            {values.files.length > 0 &&
              fileBlobRef.map((blob, index) => (
                <div
                  className="image-box d-flex"
                  data-file-index={index}
                  key={index}
                  style={{ maxWidth: "100px", maxHeight: "100px", overflow: "scroll", marginLeft: "3px", marginBottom: "4px" }}
                >
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
                        className="letterbox-img"
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
                      //TODO: video cannot exit, the mouse captures play btn
                      <video
                        className="letterbox-img"
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
          <div className="mb-3">
            <p className="fs-5 w-100 mb-1">Questions</p>
          </div>
          <div className="mb-3">
            <label htmlFor="sqFt" className="form-label text-muted">
              What would you like to ask the buyer?
            </label>
            <div className="d-flex flex-row">
              <input
                name="question"
                value={questionBeingTyped}
                onChange={e => setQuestionBeingTyped(e.target.value)}
                type="text"
                className="form-control w-75"
                onKeyUp={e => e.key === "Enter" && appendQuestion()}
              />
              <button type="button" onClick={() => appendQuestion()} className="btn btn-primary mt-2 float-end" style={{ marginLeft: "10px" }}>
                <i className="bi bi-plus" /> Add
              </button>
            </div>
          </div>
          {values.questions.map((q, i) => (
            <div
              key={i}
              className="row ms-1 me-1 images-container rounded-3 mb-2 align-content-center shadow-sm"
              style={{ backgroundColor: "white", height: "40px" }}
            >
              <div className="w-100 text-muted">
                {q}
                <i className="bi bi-x-circle-fill text-danger float-end point" onClick={() => removeQuestion(i)} />
              </div>
            </div>
          ))}
          <button type="submit" id="create-sale-submit-button" className="btn btn-primary" style={{ marginTop: "100px" }}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default connect()(CreateSaleForm);
