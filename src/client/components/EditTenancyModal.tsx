import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { tenancyStatusSequence } from "../../utils/statusSequence";
import { toast } from "react-toastify";
import axios from "axios";
import dayjs from "dayjs";
import Tenancy from "../../database/models/tenancy";
import PropertyForRent from "../../database/models/property_for_rent";

type Props = {
  selectedTenToManage: Tenancy | undefined;
  property: PropertyForRent | undefined;
  setSelectedTenToManage: (state: Tenancy | undefined) => void;
  initialLoad: () => void;
};

const EditTenancyModal = (props: Props) => {
  const { selectedTenToManage, property, setSelectedTenToManage, initialLoad } = props;

  const [rentalAgreementDate, setRentalAgreementDate] = useState(selectedTenToManage?.rentalAgreementDate);
  const [lenghtInDays, setLenghtInDays] = useState(selectedTenToManage?.lenghtInDays);
  const [depositAmount, setDepositAmount] = useState(selectedTenToManage?.deposit);
  const [isDepositPaid, setIsDepositPaid] = useState(selectedTenToManage?.isDepositPaid);
  const [isDepositReleased, setIsDepositReleased] = useState(selectedTenToManage?.isDepositReleased);
  const [outstandingRent, setOutstandingRent] = useState(selectedTenToManage?.outstandingRent);
  const [tenancyStatus, setTenancyStatus] = useState(String(selectedTenToManage?.tenancyStatus));
  const [showArchiveWarning, setShowArchiveWarning] = useState(false);
  const [reload, setReload] = useState<boolean>();

  const updateTenancy = async () => {
    const body = {
      rentalAgreementDate: rentalAgreementDate,
      lenghtInDays: lenghtInDays,
      deposit: depositAmount,
      isDepositPaid: isDepositPaid,
      isDepositReleased: isDepositReleased,
      outstandingRent: outstandingRent,
      tenancyStatus: tenancyStatus,
      tenancyId: selectedTenToManage?.id,
      propertyForRentId: property?.id
    };
    console.log(body);
    // axios call
    const res = await axios.put("/api/tenancy/update", body);
    if (res.status === 200) toast.success("Updated");
    if (res.status !== 200) toast.error("Oops Something went wrong updating this record. Please Try Again");
    setSelectedTenToManage(undefined);
    initialLoad();
  };

  const removeTenancy = async () => {
    const body = { tenancyId: selectedTenToManage?.id, propertyForRentId: property?.id };
    const res = await axios.put("/api/tenancy/archive", body);
    if (res.status === 200) toast.success("Removed");
    if (res.status !== 200) toast.error("Oops Something went wrong deleting this record. Please Try Again");
    setSelectedTenToManage(undefined);
    initialLoad();
  };

  useEffect(() => {
    setRentalAgreementDate(selectedTenToManage?.rentalAgreementDate);
    setLenghtInDays(selectedTenToManage?.lenghtInDays);
    setDepositAmount(selectedTenToManage?.deposit);
    setIsDepositPaid(selectedTenToManage?.isDepositPaid);
    setIsDepositReleased(selectedTenToManage?.isDepositReleased);
    setOutstandingRent(selectedTenToManage?.outstandingRent);
    setTenancyStatus(String(selectedTenToManage?.tenancyStatus));
  }, [selectedTenToManage]);

  return (
    <Modal show={Boolean(selectedTenToManage)}>
      <Modal.Header>
        <Modal.Title>
          {selectedTenToManage?.firstName} {selectedTenToManage?.lastName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column">
          <div></div>
          <div className="py-2 d-flex align-items-center">
            <label className="pe-4">Rental Agreement Date</label>
            <div className="col-4">
              <input
                value={dayjs(rentalAgreementDate).format("YYYY-MM-DD")}
                onChange={e => setRentalAgreementDate(e.target.value)}
                className="form-control"
                type="date"
              />
            </div>
          </div>
          <div className="py-2 d-flex align-items-center">
            <label className="pe-4">Tenancy Length (days)</label>
            <div className="col-4">
              <input value={lenghtInDays} onChange={e => setLenghtInDays(Number(e.target.value))} className="form-control" type="number" />
            </div>
          </div>
          <div className="py-2 d-flex align-items-center">
            <label className="pe-4">Outstanding Rent Amount</label>
            <div className="col-4">
              <input value={outstandingRent} onChange={e => setOutstandingRent(Number(e.target.value))} className="form-control" type="number" />
            </div>
          </div>
          <div className="py-2 d-flex align-items-center">
            <label className="pe-4 col-6">Tenancy Status</label>
            <select onChange={e => setTenancyStatus(e.target.value)} className="form-select">
              {tenancyStatusSequence.map((stat, i) => (
                <option selected={tenancyStatus === stat} key={i}>
                  {stat}
                </option>
              ))}
            </select>
          </div>
          <div className="py-2 d-flex align-items-center">
            <label className="pe-4">Deposit Amount</label>
            <div className="col-4">
              <input value={depositAmount} onChange={e => setDepositAmount(Number(e.target.value))} className="form-control" type="number" />
            </div>
          </div>
          <div className="py-2 d-flex align-items-center">
            <label className="pe-4">Deposit Paid</label>
            <input
              value={String(isDepositPaid)}
              checked={Boolean(isDepositPaid)}
              onChange={e => setIsDepositPaid(e.target.checked)}
              className="col-1"
              type="checkbox"
            />
          </div>
          <div className="py-2 d-flex align-items-center">
            <label className="pe-4">Deposit Released</label>
            <input
              value={String(isDepositReleased)}
              checked={Boolean(isDepositReleased)}
              onChange={e => setIsDepositReleased(e.target.checked)}
              className="col-1"
              type="checkbox"
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="me-auto">
          <Button onClick={() => setShowArchiveWarning(true)} variant="danger">
            <i className="bi bi-trash" />
          </Button>
          {showArchiveWarning && (
            <div className="position-fixed bg-white p-3 border rounded" style={{ maxWidth: "400px" }}>
              <div>
                Are you sure you want to remove tenant {selectedTenToManage?.firstName} {selectedTenToManage?.lastName} from this property?
              </div>
              <div className="w-100 d-flex" style={{ justifyContent: "end" }}>
                <button onClick={() => setShowArchiveWarning(false)} className="btn text-primary">
                  Exit
                </button>
                <button onClick={() => removeTenancy()} className="btn btn-danger" style={{ backgroundColor: "red" }}>
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
        <Button variant="link" className="text-secondary text-decoration-none" onClick={() => setSelectedTenToManage(undefined)}>
          Cancel
        </Button>
        <Button onClick={() => updateTenancy()} style={{ border: "none", backgroundColor: "#11828d" }}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default connect()(EditTenancyModal);
