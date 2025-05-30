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

const columnHelper = createColumnHelper<Listing>();
const columns = [
  columnHelper.accessor("id", {
    cell: info => info.getValue(),
    footer: info => info.column.id
  }),
  columnHelper.accessor(row => row.title, {
    id: "title",
    cell: info => <i>{info.getValue()}</i>,
    header: () => <span>Title</span>,
    footer: info => info.column.id
  }),
  columnHelper.accessor("listingType", {
    header: () => <span>Listing Type</span>,
    footer: info => info.column.id
  }),
  columnHelper.accessor("Address.addressLine1", {
    header: "Address Line1",
    footer: info => info.column.id
  }),
  columnHelper.accessor("createdAt", {
    cell: info => dayjs(info.renderValue()).fromNow(),
    header: "Date Created",
    footer: info => info.column.id
  })
];

export const AdminApproveListingTable = props => {
  const [data, setData] = useState<Listing[]>([]);
  const navigate = useNavigate();

  const loadData = async () => {
    const res = await axios.get("/api/listings/approve");
    if (res.status !== 200) {
      toast.error("error fetching /api/listings/approve");
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
      <h3 className="m-5"> Listings to Approve</h3>
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
              <tr onClick={() => navigate(`/edit-listing/rent/${row.original.id}`)} key={row.id}>
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

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AdminApproveListingTable);
