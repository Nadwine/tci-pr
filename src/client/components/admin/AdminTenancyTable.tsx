import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import User from "../../../database/models/user";
import dayjs from "dayjs";
import axios from "axios";
import { toast } from "react-toastify";
import Listing from "../../../database/models/listing";
import { useNavigate } from "react-router-dom";
import PropertyTenant from "../../../database/models/tenant_property";

const columnHelper = createColumnHelper<PropertyTenant>();
const columns = [
  columnHelper.accessor("id", {
    cell: info => info.getValue(),
    footer: info => info.column.id
  }),
  columnHelper.accessor("rentalAgreementDate", {
    header: () => <span>Rental Agreement Date</span>,
    footer: info => info.column.id
  }),
  columnHelper.accessor("deposit", {
    header: "Deposit",
    footer: info => info.column.id
  }),
  columnHelper.accessor("isDepositPaid", {
    header: "Deposit Paid?",
    footer: info => info.column.id
  }),
  columnHelper.accessor("isDepositReleased", {
    header: "Deposit Released?",
    footer: info => info.column.id
  }),
  columnHelper.accessor("tenancyStatus", {
    header: "Status",
    footer: info => info.column.id
  }),
  columnHelper.accessor("PropertyForRent.Listing.Address.addressLine1", {
    header: "Address Line1",
    footer: info => info.column.id
  }),
  columnHelper.accessor("User.Admin.User.ListingLandlord.lastName", {
    header: "Landlord",
    footer: info => info.column.id
  }),
  columnHelper.accessor("createdAt", {
    cell: info => dayjs(info.renderValue()).fromNow(),
    header: "Date Created",
    footer: info => info.column.id
  })
];

export const AdminTenancyTable = props => {
  const [data, setData] = useState<PropertyTenant[]>([]);
  const navigate = useNavigate();

  const loadData = async () => {
    const res = await axios.get("/api/property-tenant/all");
    if (res.status !== 200) {
      toast.error("error fetching /api/property-tenant/all");
      return;
    }
    setData(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);
  // @ts-ignore
  const table = useReactTable({ columns, data, getCoreRowModel: getCoreRowModel() });
  return (
    <div className="p-2">
      <h3 className="m-5"> Tenancies</h3>
      <div className="ms-5">
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
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default connect()(AdminTenancyTable);
