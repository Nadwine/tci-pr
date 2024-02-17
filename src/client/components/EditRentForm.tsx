import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import { connect } from "react-redux";
import islands from "../../utils/islandsData.json";
import { useNavigate, useParams } from "react-router-dom";
import { cloneDeep } from "lodash";
import Listing from "../../database/models/listing";
import ListingQuestion from "../../database/models/listing_question";
import ListingMedia from "../../database/models/listing_media";
import { toast } from "react-toastify";

const axiosConfig = { headers: { "Content-Type": "multipart/form-data" } };

const EditRentForm = ({ listing }: { listing: Listing }) => {
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const [fileBlobRef, setFileBlobRef] = useState<string[]>([]);
  const [questionBeingTyped, setQuestionBeingTyped] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  const flipApprovalVal = async () => {
    const value = listing.isApproved ? false : true;
    const res = await axios.post("/api/listing/approve-status", { isApproved: value, id: listing.id });
    if (res.status === 200) window.location.reload();
    if (res.status !== 200) toast.error("Error: /api/listing/approve-status");
  };

  const { values, errors, touched, handleSubmit, handleChange, handleBlur, setFieldValue } = useFormik({
    initialValues: {
      title: listing.title,
      description: listing.description,
      numOfRooms: listing.PropertyForRent.numOfRooms,
      numOfBathRooms: listing.PropertyForRent.numOfBathRooms,
      maxTenant: listing.PropertyForRent.maxTenant,
      rentAmount: listing.PropertyForRent.rentAmount,
      sqFt: listing.PropertyForRent.sqFt,
      internetIncluded: listing.PropertyForRent.internetIncluded,
      electricityIncluded: listing.PropertyForRent.electricityIncluded,
      waterIncluded: listing.PropertyForRent.waterIncluded,
      isFurnished: listing.PropertyForRent.isFurnished,
      availability: listing.PropertyForRent.availability,
      addressLine1: listing.Address.addressLine1,
      addressLine2: listing.Address.addressLine2,
      settlement: listing.Address.settlement,
      city: listing.Address.city,
      postcode: listing.Address.postcode,
      country: listing.Address.country,
      files: listing.ListingMedia.sort((a, b) => Number(a.label) - Number(b.label)) as ListingMedia[],
      questions: listing.ListingQuestions as ListingQuestion[],
      fullFiles: null
    },
    async onSubmit(formValues, formikHelpers) {
      if (document.activeElement?.id === "edit-rent-btn") return;
      const billsIncluded = formValues.electricityIncluded || formValues.internetIncluded || formValues.waterIncluded;
      const body = {
        files: formValues.files,
        title: values.title,
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
        postcode: "TKCA 1ZZ",
        country: "Turks & Caicos Islands",
        questions: JSON.stringify(formValues.questions),
        fullFiles: JSON.stringify(formValues.fullFiles)
      };
      await axios
        .put(`/api/listing/rent/${id}`, body, axiosConfig)
        .then(res => window.location.reload())
        .catch(err => {
          toast.error("error updating listing. try again");
          console.log("/api/listing/rent/create", err);
        });
    },
    validate(values) {
      //
    }
  });

  const onchangeDisplayImages = (filesArray: any[]) => {
    if (filesArray.length === 0) return;
    const fileBlobs = filesArray.map(fileFromPcOrDatabase => {
      if (fileFromPcOrDatabase.size) {
        //From PC
        return URL.createObjectURL(fileFromPcOrDatabase);
      } else {
        //From DB
        return fileFromPcOrDatabase;
      }
    });
    setFileBlobRef(fileBlobs);
  };

  const appendQuestion = () => {
    if (questionBeingTyped !== "" && values.questions !== undefined) {
      //@ts-ignore
      const newQuestions: ListingQuestion[] = [...values.questions, { text: questionBeingTyped, listingId: listing.id, action: "create" }];
      setFieldValue("questions", newQuestions);
      setQuestionBeingTyped("");
    }
  };

  const removeQuestion = (index: number) => {
    const newQuestions: ListingQuestion[] = cloneDeep(values.questions);
    //@ts-ignore
    newQuestions[index].action = "delete";
    setFieldValue("questions", newQuestions);
  };

  const selectedIsland = islands.find(i => i.name === values.city);

  const disableStyle: React.CSSProperties = {
    pointerEvents: isDisabled === true ? "none" : "all"
  };
  return (
    <div className="create-rent-form d-flex justify-content-center row">
      <div className="col-md-6 col-sm-10 col-lg-5">
        <h4 className="text-center pb-4 mt-5">
          Edit property <i className="bi bi-pencil-fill text-info px-1" style={{ fontSize: "20px" }}></i>
          <button id="edit-rent-btn" onClick={() => setIsDisabled(!isDisabled)} className={`edit float-end btn btn-${isDisabled ? "primary" : "secondary"}`}>
            {isDisabled ? "Edit" : "Cancel"}
          </button>
        </h4>
        <div className="w-100 text-center mb-5">
          <button onClick={() => flipApprovalVal()} className={`btn btn-lg btn-${!listing.isApproved ? "success" : "danger"}`}>
            {!listing.isApproved ? "Approve" : "Revoke Approval"}
          </button>
        </div>
        <form onSubmit={handleSubmit} onKeyPress={e => e.key === "Enter" && e.preventDefault()} onKeyUp={e => e.key === "Enter" && e.preventDefault()}>
          <div className={`${isDisabled && "disabled-section"}`} style={disableStyle}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Island
              </label>
              <select name="city" onChange={handleChange} value={values.city} className="form-select">
                {islands.map((c, i) => (
                  <option key={i} selected={c.name === values.city} value={c.name}>
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
                  {selectedIsland?.settlements.map((s, i) => (
                    <option key={i} selected={s === values.settlement} value={s}>
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
              <label htmlFor="rentAmount" className="form-label w-100">
                Rent per month
              </label>
              <span className="input-group-text">$</span>
              <input name="rentAmount" value={values.rentAmount} onChange={handleChange} type="number" className="form-control" />
              <span className="input-group-text">.00</span>
            </div>
            <div className="inclusions pt-4">
              <p className="fs-5 w-100 pt-2 mb-1">Inclusions</p>
            </div>
            <div className="mb-3 form-check">
              <input
                name="internetIncluded"
                checked={Boolean(values.internetIncluded)}
                value={String(values.internetIncluded)}
                type="checkbox"
                className="form-check-input"
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="internetIncluded">
                Internet Included
              </label>
            </div>
            <div className="mb-3 form-check">
              <input
                name="electricityIncluded"
                checked={Boolean(values.electricityIncluded)}
                value={String(values.electricityIncluded)}
                type="checkbox"
                className="form-check-input"
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="electricityIncluded">
                Electricity Included
              </label>
            </div>
            <div className="mb-3 form-check">
              <input
                name="waterIncluded"
                checked={Boolean(values.waterIncluded)}
                value={String(values.waterIncluded)}
                type="checkbox"
                className="form-check-input"
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="waterIncluded">
                Water Included
              </label>
            </div>
            <div className="mb-5 form-check">
              <input
                name="isFurnished"
                checked={Boolean(values.isFurnished)}
                value={String(values.isFurnished)}
                type="checkbox"
                className="form-check-input"
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="isFurnished">
                Furnished
              </label>
            </div>
            <div className="inclusions">
              <p className="fs-5 w-100 pt-2 mb-1">Photos/Videos</p>
            </div>
            {/* Media Display Box Start */}
            <div className="row ms-1 me-1 images-container rounded-3" style={{ backgroundColor: "#80808030", minHeight: 100 }}>
              {values.files.length === 0 && <div className="w-100 text-center pt-4 text-secondary">No Files</div>}
              {values.files.length > 0 &&
                values.files.map((f, index) => {
                  return (
                    // @ts-ignore
                    f.action !== "delete" && (
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
                              const filesLeftAfterRemove = cloneDeep(values.files); //values.files.filter((img, i) => i !== index);
                              //@ts-ignore
                              filesLeftAfterRemove[index].action = "delete";
                              setFieldValue("files", filesLeftAfterRemove);
                              setFieldValue("fullFiles", filesLeftAfterRemove);
                              // update image blob render
                              // onchangeDisplayImages(cloneDeep(fileBlobRef).splice(index, 1));
                            }}
                          >
                            <i className=" bi-x-lg" />
                          </button>
                          {/* @ts-ignore */}
                          {(values.files[index]?.mediaType?.includes("image") || values.files[index]?.type?.includes("image")) && (
                            <img
                              className="letterbox-img"
                              data-file-index={index}
                              width={150}
                              draggable
                              src={f.mediaUrl || fileBlobRef[index]}
                              // onDragStart={e => {
                              //   e.dataTransfer.setData("file-index", `${index}`);
                              //   e.dataTransfer.setData("file-type", values.files[index].type);
                              //   console.log(values.files[index].type);
                              // }}
                            />
                          )}
                          {/* @ts-ignore */}
                          {(values.files[index]?.mediaType?.includes("video") || values.files[index]?.type?.includes("video")) && (
                            //TODO: video cannot exit, the mouse captures play btn
                            <video
                              className="letterbox-img"
                              data-file-index={index}
                              width={150}
                              draggable
                              src={f.mediaUrl || fileBlobRef[index]}
                              // onDragStart={e => {
                              //   e.dataTransfer.setData("file-index", `${index}`);
                              //   e.dataTransfer.setData("file-type", values.files[index].type);
                              //   console.log(values.files[index].type);
                              // }}
                            />
                          )}
                        </div>
                      </div>
                    )
                  );
                })}
            </div>
            {/* Media Display Box End */}
            <div>
              <input
                style={{ width: "6.8em" }}
                className="form-control mb-5 ms-auto mt-2"
                type="file"
                id="formFileMultiple"
                onChange={event => {
                  if (!event.target.files) return;
                  const fileReader = new FileReader();
                  const filesArray = Array.from(event.target.files);
                  const existingFiles = [...values.files];
                  const combinedFiles = [...existingFiles, ...filesArray];
                  //@ts-ignore
                  values.files = [...existingFiles, ...filesArray];
                  const fileConverted = [];
                  for (let fI = 0; fI < filesArray.length; fI++) {
                    //@ts-ignore
                    fileConverted[fI] = {
                      type: filesArray[fI].type,
                      name: filesArray[fI].name,
                      size: filesArray[fI].size
                    };
                  }
                  //@ts-ignore
                  values.fullFiles = [...existingFiles, ...fileConverted];
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
                What would you like to ask your tenant?
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
            {values?.questions
              // @ts-ignore
              .filter(q => !q.action || q.action !== "delete")
              .map((q, i) => (
                <div
                  key={i}
                  className="row ms-1 me-1 images-container rounded-3 mb-2 align-content-center shadow-sm"
                  style={{ backgroundColor: "white", height: "40px" }}
                >
                  <div className="w-100 text-muted">
                    {q.text}
                    <i className="bi bi-x-circle-fill text-danger float-end point" onClick={() => removeQuestion(i)} />
                  </div>
                </div>
              ))}
            <button type="submit" id="create-rent-submit-button" className="btn btn-dark mt-3">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default connect()(EditRentForm);
