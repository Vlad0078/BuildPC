import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import React from "react";
import { Spec } from "../models/spec";

interface SpecTableProps {
  specs: Record<string, Spec<unknown>>;
}

const SpecTable: React.FC<SpecTableProps> = ({ specs }) => {
  const specList = Object.values(specs);

  return (
    <TableContainer>
      <Table>
        <TableBody>
          {specList.map((spec) => (
            <TableRow
              key={spec.name}
              sx={{
                "&:nth-of-type(even)": {
                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                },
              }}
            >
              <TableCell sx={{ fontSize: "1.4rem", color: "#424242" }}>
                {spec.prettyName}
              </TableCell>
              <TableCell align="right" sx={{ fontSize: "1.4rem" }}>
                {spec.prettyValue}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SpecTable;
