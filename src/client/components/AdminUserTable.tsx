import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import User from "../../database/models/user";
import dayjs from "dayjs";

const fakeData = [
  {
    id: 1,
    username: "admin1",
    password: "$2b$10$tvc8WYw278jhiSaKQOHVj.dU2cZvSGbY.WVlGuZcLinZls2GLfawO",
    email: "admin@mail.com",
    verified: true,
    accountType: "admin",
    createdAt: "2021-05-28T15:36:56.200",
    updatedAt: "2021-08-28T13:40:02.200"
  },
  {
    id: 2,
    username: "user1",
    password: "$2b$10$tvc8WYw278jhiSaKQOHVj.dU2cZvSGbY.WVlGuZcLinZls2GLfawO",
    email: "user@mail.com",
    verified: true,
    accountType: "tenant",
    createdAt: "2021-05-28T15:36:56.200",
    updatedAt: "2021-08-28T13:40:02.200"
  },
  {
    id: 3,
    username: "user2",
    password: "$2b$10$tvc8WYw278jhiSaKQOHVj.dU2cZvSGbY.WVlGuZcLinZls2GLfawO",
    email: "user2@mail.com",
    verified: true,
    accountType: "tenant",
    createdAt: "2021-05-28T15:36:56.200",
    updatedAt: "2021-08-28T13:40:02.200"
  },
  {
    id: 4,
    username: "admin2",
    password: "$2b$10$tvc8WYw278jhiSaKQOHVj.dU2cZvSGbY.WVlGuZcLinZls2GLfawO",
    email: "admin2@mail.com",
    verified: true,
    accountType: "admin",
    createdAt: "2021-05-28T15:36:56.200",
    updatedAt: "2021-08-28T13:40:02.200"
  },
  {
    id: 5,
    username: "landlord5",
    password: "$2b$10$tvc8WYw278jhiSaKQOHVj.dU2cZvSGbY.WVlGuZcLinZls2GLfawO",
    email: "landlord2@mail.com",
    verified: true,
    accountType: "landlord",
    createdAt: "2021-05-28T15:36:56.200",
    updatedAt: "2021-08-28T13:40:02.200"
  }
];

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
    header: () => "email",
    cell: info => info.renderValue(),
    footer: info => info.column.id
  }),
  columnHelper.accessor("verified", {
    header: () => <span>Verified</span>,
    footer: info => info.column.id
  }),
  columnHelper.accessor("accountType", {
    header: "AccountType",
    footer: info => info.column.id
  }),
  columnHelper.accessor("createdAt", {
    cell: info => dayjs(info.renderValue()).fromNow(),
    header: "Created",
    footer: info => info.column.id
  })
];

export const AdminUserTable = props => {
  const [data, setData] = useState(() => [...fakeData]);
  // @ts-ignore
  const table = useReactTable({ columns, data, getCoreRowModel: getCoreRowModel() });
  return (
    <div className="p-2">
      <table>
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
  );
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AdminUserTable);
