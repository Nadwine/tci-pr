import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import { connect } from "react-redux";
import islands from "../../utils/islandsData.json";
import { useNavigate } from "react-router-dom";
import { cloneDeep } from "lodash";
import { toast } from "react-toastify";

const axiosConfig = { headers: { "Content-Type": "multipart/form-data" } };

const CreateRentForm = props => {
  const navigate = useNavigate();
  const [fileBlobRef, setFileBlobRef] = useState<string[]>([]);
  const [questionBeingTyped, setQuestionBeingTyped] = useState("");

  const { values, errors, touched, handleSubmit, handleChange, handleBlur, setFieldValue } = useFormik({
    initialValues: {
      title: "",
      description: "",
      numOfRooms: "",
      numOfBathRooms: "",
      maxTenant: "",
      rentAmount: "",
      sqFt: "",
      internetIncluded: false,
      electricityIncluded: false,
      waterIncluded: false,
      isFurnished: false,
      availability: "",
      addressLine1: "",
      addressLine2: "",
      settlement: "",
      city: "",
      postcode: "",
      country: "",
      tenancyLength: "",
      listingManager: "admin",
      files: [] as File[],
      questions: [] as string[],
      productPackage: ""
    },
    async onSubmit(formValues, formikHelpers) {
      if (formValues.files.length === 0 || !formValues.files.find(f => f.type.includes("image"))) {
        toast.error("Please upload at least one picture with this listing");
        return;
      }
      if (formValues.productPackage === "basic" && formValues.files.find(f => f.type.includes("video"))) {
        toast.error("You've selected 'Basic' package. Please select 'Standard' or 'Premium' to enable video uploads");
        return;
      }
      //https://stackoverflow.com/questions/36485333/node-js-request-entity-too-large-with-multer-upload
      if (formValues.files.find(f => f.size > 49283072)) {
        // https://videocompress.prolab.sh/video
        const message = React.createElement(
          "div",
          { className: "text-center", style: { fontSize: "11px" } },
          "One or more of your files are too large for upload max 45mb. Try Compressing your video with the link below"
        );
        const compressButton = React.createElement(
          "button",
          {
            className: "btn btn-sm btn-secondary",
            style: { marginTop: "20px" },
            onClick: async () => {
              window.open("https://videocompress.prolab.sh/video", "_blank")?.focus();
            }
          },
          "Compress"
        );
        const El = React.createElement("div", { className: "d-flex flex-column" }, [message, compressButton]);
        // toast.error("One or more of your files are too large for upload max 45mb.");
        toast.error(El, { autoClose: 10000, closeOnClick: false });
        return;
      }
      const billsIncluded = formValues.electricityIncluded || formValues.internetIncluded || formValues.waterIncluded;
      const body = {
        files: formValues.files,
        title: formValues.title,
        description: formValues.description,
        numOfRooms: formValues.numOfRooms,
        numOfBathRooms: formValues.numOfBathRooms,
        maxTenant: formValues.maxTenant,
        rentAmount: formValues.rentAmount,
        sqFt: formValues.sqFt,
        billsIncluded: billsIncluded,
        internetIncluded: formValues.internetIncluded,
        electricityIncluded: formValues.electricityIncluded,
        waterIncluded: formValues.waterIncluded,
        isFurnished: formValues.isFurnished,
        availability: formValues.availability,
        addressLine1: formValues.addressLine1,
        addressLine2: formValues.addressLine2,
        settlement: formValues.settlement,
        city: formValues.city,
        tenancyLength: formValues.tenancyLength,
        listingManager: formValues.productPackage === "basic" ? "landlord" : "admin", //formValues.listingManager,
        postcode: "TKCA 1ZZ",
        country: "Turks and Caicos Islands",
        questions: JSON.stringify(formValues.questions),
        productPackage: formValues.productPackage
      };
      const res = await axios.post("/api/listing/rent/create", body, axiosConfig);
      if (res.status === 200) navigate("/admin/dashboard/listings");
      if (res.status !== 200) {
        toast.error("Oops something went wrong. If you continue to see this issue please contact your administrator for further assistance");
        console.log("/api/listing/rent/create", res);
      }
    },
    validate(values) {
      //
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
    <div className="create-rent-form d-flex justify-content-center row">
      <div className="col-md-6 col-sm-10 col-lg-5">
        <form onSubmit={handleSubmit} onKeyPress={e => e.key === "Enter" && e.preventDefault()} onKeyUp={e => e.key === "Enter" && e.preventDefault()}>
          <h4 className="text-center pb-4 mt-5">Add property for rent</h4>
          <div className="py-5">
            <label>
              Select your desired
              <button type="button" className="btn text-primary ps-1" onClick={() => navigate(`/products`)}>
                package
              </button>
            </label>
            <select name="productPackage" onChange={handleChange} value={values.productPackage} className="form-select" required>
              <option selected value="">
                Select an option
              </option>
              <option value="basic">Basic</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Island
            </label>
            <select name="city" onChange={handleChange} value={values.city} className="form-select" required>
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
              <select name="settlement" onChange={handleChange} value={values.settlement} className="form-select" required>
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
            <input name="addressLine1" value={values.addressLine1} onChange={handleChange} type="text" className="form-control" required />
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
            <input
              name="title"
              value={values.title}
              onChange={handleChange}
              type="text"
              className="form-control"
              required
              placeholder="eg. 2 Bedroom Apartment, The Bight, Providenciales"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="maxTenant" className="form-label">
              Maximum number of tenants
            </label>
            <input
              name="maxTenant"
              value={values.maxTenant}
              onChange={handleChange}
              type="number"
              onWheel={e => (e.target as HTMLElement)!.blur()}
              className="form-control"
              required
            />
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
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="numOfBathRooms" className="form-label">
              Bathrooms
            </label>
            <input
              name="numOfBathRooms"
              value={values.numOfBathRooms}
              onChange={handleChange}
              type="number"
              onWheel={e => (e.target as HTMLElement)!.blur()}
              className="form-control"
              required
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
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="availability" className="form-label">
              Available From
            </label>
            <input name="availability" value={values.availability} onChange={handleChange} className="form-control" type="date" required />
          </div>
          <div className="mb-3">
            <label htmlFor="tenancyLength" className="form-label">
              Rental Length {"(Days)"}
            </label>
            <div className="d-flex flex-row">
              <input
                placeholder="eg.  Enter 365 for 12 months"
                name="tenancyLength"
                value={values.tenancyLength}
                onChange={handleChange}
                type="number"
                onWheel={e => (e.target as HTMLElement)!.blur()}
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="input-group mb-3">
            <label htmlFor="rentAmount" className="form-label w-100">
              Rent per month
            </label>
            <span className="input-group-text">$</span>
            <input
              name="rentAmount"
              value={values.rentAmount}
              onChange={handleChange}
              type="number"
              onWheel={e => (e.target as HTMLElement)!.blur()}
              className="form-control"
              required
            />
            <span className="input-group-text">.00</span>
          </div>
          <div className="inclusions pt-4">
            <p className="fs-5 w-100 pt-2 mb-1">Inclusions</p>
          </div>
          <div className="mb-3 form-check">
            <input name="internetIncluded" value={String(values.internetIncluded)} type="checkbox" className="form-check-input" onChange={handleChange} />
            <label className="form-check-label" htmlFor="internetIncluded">
              Internet Included
            </label>
          </div>
          <div className="mb-3 form-check">
            <input name="electricityIncluded" value={String(values.electricityIncluded)} type="checkbox" className="form-check-input" onChange={handleChange} />
            <label className="form-check-label" htmlFor="electricityIncluded">
              Electricity Included
            </label>
          </div>
          <div className="mb-3 form-check">
            <input name="waterIncluded" value={String(values.waterIncluded)} type="checkbox" className="form-check-input" onChange={handleChange} />
            <label className="form-check-label" htmlFor="waterIncluded">
              Water Included
            </label>
          </div>
          <div className="mb-5 form-check">
            <input name="isFurnished" value={String(values.isFurnished)} type="checkbox" className="form-check-input" onChange={handleChange} />
            <label className="form-check-label" htmlFor="isFurnished">
              Furnished
            </label>
          </div>
          {/* <div className="managment type">
            <div className="pb-2">Managed By Admin?</div>
            <select
              value={values.listingManager}
              onChange={e => setFieldValue("listingManager", e.target.value)}
              className="col-10 form-select"
              aria-label="Default select example"
            >
              <option value="" selected>
                Would you like us to manage this property for you?
              </option>
              <option value="admin">Yes</option>
              <option value="landlord">No</option>
            </select>
          </div> */}
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
                      style={{ zIndex: +1 }}
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
              style={{ width: "7.5em" }}
              className="form-control mb-5 ms-auto mt-2"
              type="file"
              id="formFileMultiple"
              accept="image/jpg, image/jpeg, image/png, video/*"
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
          <div className="mb-3" style={{ alignItems: "baseline" }}>
            <label htmlFor="sqFt" className="form-label text-muted">
              What would you like to ask your future tenant?
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
              <button type="button" onClick={() => appendQuestion()} className="btn btn-dark mt-2 float-end" style={{ marginLeft: "10px" }}>
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
          <hr></hr>
          <button type="submit" id="create-rent-submit-button" className="btn btn-dark mt-3 mb-5">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default connect()(CreateRentForm);
