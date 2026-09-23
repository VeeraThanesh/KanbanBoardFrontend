import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Pagination,
  IconButton,
  Paper,
} from "@mui/material";

const MasterTable = ({
  columns,
  data,
  page,
  rowsPerPage = 5,
  onPageChange,
  onEdit,
  onDelete,
  editIcon,
  deleteIcon,
}) => {
  const [sortField, setSortField] = useState(columns[0]?.id || "");
  const [sortOrder, setSortOrder] = useState("asc");

  // SORTING
  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];
    const compare =
      typeof valA === "string" ? valA.localeCompare(valB) : valA - valB;
    return sortOrder === "asc" ? compare : -compare;
  });

  // PAGINATION
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage);

  const handleSort = (id) => {
    if (sortField === id) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(id);
      setSortOrder("asc");
    }
  };

  // Styled Components for Custom Look
  const StyledTableContainer = {
    borderRadius: "12px",
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.08)",
    overflow: "hidden",
    border: "1px solid #e0e0e0",
  };

  const StyledTableHead = {
    backgroundColor: "#1f2937", // Matching Sidebar Dark Theme
    "& th": {
      color: "#ffffff",
      fontWeight: "600",
      fontSize: "0.95rem",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      borderBottom: "none",
      padding: "16px",
    },
  };

  const StyledTableRow = {
    "&:nth-of-type(even)": {
      backgroundColor: "#f9fafb", // Alternating stripes
    },
    "&:hover": {
      backgroundColor: "#f3f4f6",
      cursor: "pointer",
      transform: "scale(1.002)",
      transition: "all 0.2s ease-in-out",
      boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    },
    transition: "all 0.2s ease",
  };

  const StyledTableCell = {
    color: "#374151",
    fontSize: "0.9rem",
    padding: "16px",
    borderBottom: "1px solid #f0f0f0",
  };

  return (
    <Paper sx={StyledTableContainer} elevation={0}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={StyledTableHead}>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.id}>
                  {col.sortable ? (
                    <TableSortLabel
                      active={sortField === col.id}
                      direction={sortOrder}
                      onClick={() => handleSort(col.id)}
                      sx={{
                        color: "white !important",
                        "& .MuiTableSortLabel-icon": {
                          color: "white !important",
                        },
                        "&:hover": {
                          color: "#e5e7eb !important",
                        },
                      }}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
              {(onEdit || onDelete) && <TableCell align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={row.id || row._id} sx={StyledTableRow}>
                {columns.map((col) => (
                  <TableCell key={col.id} sx={StyledTableCell}>
                    {col.id === "serialNo"
                      ? startIndex + index + 1
                      : row[col.id]}
                  </TableCell>
                ))}
                {(onEdit || onDelete) && (
                  <TableCell align="center" sx={StyledTableCell}>
                    <Box display="flex" justifyContent="center" gap={1}>
                      {onEdit && (
                        <IconButton
                          onClick={() => onEdit(row)}
                          size="small"
                          sx={{
                            color: "#3b82f6",
                            backgroundColor: "rgba(59, 130, 246, 0.1)",
                            "&:hover": {
                              backgroundColor: "#3b82f6",
                              color: "white",
                            },
                          }}
                        >
                          {editIcon || <span>Edit</span>}
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton
                          onClick={() => onDelete(row)}
                          size="small"
                          sx={{
                            color: "#ef4444",
                            backgroundColor: "rgba(239, 68, 68, 0.1)",
                            "&:hover": {
                              backgroundColor: "#ef4444",
                              color: "white",
                            },
                          }}
                        >
                          {deleteIcon || <span>Delete</span>}
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINATION */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={2}
        sx={{
          backgroundColor: "#fff",
          borderTop: "1px solid #f0f0f0",
        }}
      >
        <Pagination
          count={Math.ceil(data.length / rowsPerPage)}
          page={page}
          onChange={(e, value) => onPageChange(value)}
          color="primary"
          shape="rounded"
          sx={{
            "& .Mui-selected": {
              backgroundColor: "#1f2937 !important", // Matching dark theme
              color: "#fff",
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default MasterTable;
