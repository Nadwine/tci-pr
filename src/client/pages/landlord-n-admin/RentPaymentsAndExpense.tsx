import React, { useEffect, useRef, useState } from "react";
import { connect, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Listing from "../../../database/models/listing";
import { RootState } from "../../redux/store";
import axios from "axios";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import Expense from "../../../database/models/expense";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import dayjs from "dayjs";

const columnHelper = createColumnHelper<Expense>();
const columns = [
  columnHelper.accessor("operation", {
    header: () => <div style={{ width: "0.5em" }}></div>,
    // cell: info => (info.getValue() === "add" ? "+" : "-"),
    cell: info => (
      <div>
        {info.getValue() === "add" ? (
          <span style={{ fontSize: "1.7em", lineHeight: "1em" }} className="text-success">
            +
          </span>
        ) : (
          <span style={{ fontSize: "1.7em", lineHeight: "1em" }} className="text-danger">
            -
          </span>
        )}
      </div>
    ),
    footer: info => info.column.id
  }),
  columnHelper.accessor(row => row.amount, {
    id: "amount",
    cell: info => <i>{info.getValue()}</i>,
    header: () => <span>Amount</span>,
    footer: info => info.column.id
  }),
  columnHelper.accessor("category", {
    header: () => "Category",
    cell: info => info.renderValue(),
    footer: info => info.column.id
  }),
  columnHelper.accessor("date", {
    header: () => <span>Date</span>,
    footer: info => info.column.id
  }),
  columnHelper.accessor("description", {
    header: "Description",
    footer: info => info.column.id
  })
];

const RentPaymentsAndExpense = props => {
  const params = useParams();
  const listingId = params.id;
  const [listing, setListing] = useState<Listing>();
  const [allowedToView, setAllowedToView] = useState(true);
  const property = listing?.PropertyForRent;
  const tenancies = property?.Tenancies;
  const onGoingTenancies = tenancies?.filter(t => t.tenancyStatus !== "ended" && t.isHistory === false);
  const tenancyAgreement = onGoingTenancies && onGoingTenancies[0]?.TenancyDocuments?.find(d => d.documentType === "tenancy-agreement");
  const allTenants = onGoingTenancies?.map(tc => tc.Tenants.find(t => t));
  const expenses = property?.Expenses;
  const propertyDocs = property?.PropertyDocuments;
  const offers = listing?.Offers;
  const loginUsr = useSelector((r: RootState) => r.auth.user);
  const [showCreateExpenseModal, setShowCreateExpenseModal] = useState(false);

  const initialLoad = async () => {
    const res = await axios.get(`/api/listing/rent/expanded/${listingId}`);
    if (res.data.message === "Unauthorized") {
      setAllowedToView(false);
      return;
    }
    setListing(res.data);
  };

  const CreateExpenseModal = (props: any) => {
    const [documentType, setDocumentType] = useState("receipt");
    const [expenseType, setExpenseType] = useState("rent_payment");
    const [attachExpense, setAttachExpense] = useState(false);
    const [operation, setOperation] = useState("minus");
    const [expenseAmount, setExpenseAmount] = useState<number>();
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [selectedTenancyId, setSelectedTenancyId] = useState<number>();
    const formRef = useRef(null);

    const uploadDoc = async e => {
      e.preventDefault();
      const formData = new FormData(formRef.current || undefined);
      const body: any = { propertyForRentId: property?.id, category: "purchase" };
      for (var pair of formData.entries()) {
        body[pair[0]] = pair[1];
      }
      if (body.expenseType === "rent_payment") {
        if (!body.attachExpense) {
          toast.error("Please attach expense data for this rent payment.");
          return;
        }
        if (!body.selectedTenancyId) {
          toast.error("Please select a tenant");
          return;
        }
        body.category = "rent_payment";
      }

      if (attachExpense) {
        if (!operation || !expenseAmount || !date || !description) {
          toast.error("Attach Expense is selected. Please fill in expense data");
          return;
        }
      }

      const res = await axios.post("/api/expense/create", body, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.status === 200) {
        toast.success("Success");
        setShowCreateExpenseModal(false);
        initialLoad();
      } else {
        toast.error("Something went wrong uploading this document");
      }
    };

    return (
      <>
        <Modal show={props.show} centered onHide={() => setShowCreateExpenseModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>New Expense</Modal.Title>
          </Modal.Header>
          <form ref={formRef} onSubmit={uploadDoc} className="d-flex flex-column justify-content-center">
            <Modal.Body>
              <div className="py-2 d-flex align-items-center">
                <label className="pe-5">Expense Type</label>
                <div className="col-7">
                  <select name="expenseType" onChange={e => setExpenseType(e.target.value)} className="form-select">
                    <option selected={expenseType === "rent_payment"} value="rent_payment">
                      Rent Payment
                    </option>
                    <option selected={expenseType === "purchase"} value="purchase">
                      Purchase
                    </option>
                  </select>
                </div>
              </div>
              {expenseType === "rent_payment" && (
                <div className="py-2 d-flex align-items-center">
                  <label className="pe-4">Choose Tenant</label>
                  <select name="selectedTenancyId" onChange={e => setSelectedTenancyId(Number(e.target.value))} className="form-select">
                    <option selected value="">
                      Select an option
                    </option>
                    {onGoingTenancies?.map((tc, i) => (
                      <option key={i} selected={selectedTenancyId === tc.id} value={tc.id}>
                        {tc.Tenants[0]?.firstName} {tc.Tenants[0]?.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="py-2 d-flex align-items-center">
                <label className="pe-5">File</label>
                <div className="col-7">
                  <input className="form-control form-control-sm" name="file" id="formFileSm" type="file" />
                </div>
              </div>
              {expenseType !== "rent_payment" && (
                <div className="py-2 d-flex align-items-center">
                  <label className="pe-4">Document Type</label>
                  <select name="documentType" onChange={e => setDocumentType(e.target.value)} className="form-select">
                    <option selected={documentType === "receipt"} value="receipt">
                      receipt
                    </option>
                    <option selected={documentType === "inspection"} value="inspection">
                      inspection
                    </option>
                  </select>
                </div>
              )}
              {documentType && documentType === "receipt" && (
                <div className="py-2 d-flex align-items-center">
                  <label className="pe-4">Attach Expense Data</label>
                  <input
                    name="attachExpense"
                    value={String(attachExpense)}
                    checked={Boolean(attachExpense)}
                    onChange={e => setAttachExpense(e.target.checked)}
                    className="col-4"
                    type="checkbox"
                  />
                </div>
              )}
              {attachExpense && (
                <div>
                  <div className="py-2 d-flex align-items-center">
                    <label className="pe-4">Operation</label>
                    <select name="operation" onChange={e => setOperation(e.target.value)} className="form-select">
                      <option selected={operation === "minus"} value="minus">
                        {"- "}Minus
                      </option>
                      <option selected={operation === "add"} value="add">
                        {"+ "}Add
                      </option>
                    </select>
                  </div>
                  <div className="py-2 d-flex align-items-center">
                    <label className="pe-4">Amount</label>
                    <div className="col-4">
                      <input
                        name="expenseAmount"
                        value={expenseAmount}
                        onChange={e => setExpenseAmount(Number(e.target.value))}
                        type="number"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="py-2 d-flex align-items-center">
                    <label className="pe-4">Date Of Transaction</label>
                    <div className="col-4">
                      <input
                        name="date"
                        value={dayjs(date).format("YYYY-MM-DDTHH:MM")}
                        onChange={e => setDate(e.target.value)}
                        type="datetime-local"
                        className="form-control"
                        style={{ width: "13em" }}
                      />
                    </div>
                  </div>
                  <div className="py-2 d-flex align-items-center">
                    <label className="pe-4">Description</label>
                    <div className="col-4">
                      <input
                        name="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        type="text"
                        className="form-control"
                        style={{ width: "14em" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <div>
                <button className="btn text-primary" type="submit">
                  Log
                </button>
              </div>
            </Modal.Footer>
          </form>
        </Modal>
      </>
    );
  };

  useEffect(() => {
    initialLoad();
  }, []);

  const table = useReactTable({ columns, data: expenses || [], getCoreRowModel: getCoreRowModel() });
  return (
    <div className="finance-page px-md-5">
      <CreateExpenseModal show={showCreateExpenseModal} />
      <h5 className="pt-3">Rent & Financial Data</h5>
      <div className="creation-menu py-4">
        <button onClick={() => setShowCreateExpenseModal(true)} className="btn btn-success">
          Log New Expense
        </button>
      </div>
      <div>
        <table className="table table-striped table-hover">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td onClick={() => console.log("CLICKED")} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default connect()(RentPaymentsAndExpense);
