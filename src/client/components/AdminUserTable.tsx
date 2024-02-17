import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import User from "../../database/models/user";
import dayjs from "dayjs";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const columnHelper = createColumnHelper<User>();
const columns = [
  columnHelper.accessor("id", {
    cell: info => info.getValue(),
    footer: info => info.column.id
  }),
  columnHelper.accessor(row => row.username, {
    id: "username",
    cell: info => <i>{info.getValue()}</i>,
    header: () => <span>Username</span>,
    footer: info => info.column.id
  }),
  columnHelper.accessor("email", {
    header: () => "Email",
    cell: info => info.renderValue(),
    footer: info => info.column.id
  }),
  columnHelper.accessor("verified", {
    header: () => <span>Verified</span>,
    footer: info => info.column.id
  }),
  columnHelper.accessor("accountType", {
    header: "Account Type",
    footer: info => info.column.id
  }),
  columnHelper.accessor("createdAt", {
    cell: info => dayjs(info.renderValue()).fromNow(),
    header: "Date Created",
    footer: info => info.column.id
  })
];

export const AdminUserTable = props => {
  const [data, setData] = useState<User[]>([]);
  const navigate = useNavigate();

  const loadData = async () => {
    const res = await axios.get("/api/users");
    if (res.status !== 200) {
      toast.error("error fetching /api/users");
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
      <h3 className="m-5"> Users</h3>
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
                  <td onClick={() => navigate(`/user/${row.original.id}`)} key={cell.id}>
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

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AdminUserTable);
