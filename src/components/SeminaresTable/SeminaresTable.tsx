import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../../api/queryClient";
import { getSeminares, Seminar, Seminars } from "../../api/seminares";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Paper } from "@mui/material";
import { ConfirmRemoveModal } from "../ConfirmRemoveModal/ConfirmRemoveModal";

export const SeminaresTable = () => {
  const [seminars, setSeminars] = useState<Seminars>([]);
  const [openConfirmRemoveModal, setOpenConfirmRemoveModal] =
    useState<boolean>(false);
  const [idToRemoveSeminar, setIdToRemoveSeminar] = useState<string>("");

  const handleOpenConfirmRemoveModal = () => setOpenConfirmRemoveModal(true);
  const handleCloseConfirmRemoveModal = () => setOpenConfirmRemoveModal(false);

  const getSeminaresQuery = useQuery(
    {
      queryFn: () => getSeminares(),
      queryKey: ["seminares"],
      retry: false,
    },
    queryClient
  );

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
    },
    {
      field: "title",
      headerName: "Title",
      width: 90,
    },
    {
      field: "description",
      headerName: "Description",
      width: 90,
    },
    {
      field: "date",
      headerName: "Date",
      width: 90,
    },
    {
      field: "time",
      headerName: "Time",
      width: 90,
    },
    {
      field: "photo",
      headerName: "Photo",
      width: 90,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 90,
      disableColumnMenu: true,
      renderCell: (param) => {
        const currentRow: Seminar = param.row;
        return (
          <>
            {/* <Button
              variant="text"
              color="primary"
              sx={{ textTransform: "none" }}
              onClick={() => handleRowClick(currentRow.createdAt)}
            >
              Go to daily
            </Button> */}
            <Button
              variant="text"
              color="primary"
              sx={{ textTransform: "none", color: "red" }}
              onClick={() => {
                setIdToRemoveSeminar(currentRow.id);
                handleOpenConfirmRemoveModal();
              }}
            >
              Remove
            </Button>
          </>
        );
      },
    },
  ];

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const handlePaginationModelChange = (newPaginationModel: {
    page: number;
    pageSize: number;
  }) => {
    setPaginationModel(newPaginationModel);
  };

  useEffect(() => {
    const seminarsList = getSeminaresQuery.data;
    if (seminarsList) {
      setSeminars(seminarsList);
    }
  }, [getSeminaresQuery.data]);

  if (getSeminaresQuery.status === "pending") {
    <div>Загрузочка</div>;
  }

  if (getSeminaresQuery.status === "error") {
    <div>Ошибочка getSeminaresQuery</div>;
  }

  return (
    <>
      <Paper sx={{ height: "83.5vh", width: "100%" }}>
        <DataGrid
          rows={seminars}
          columns={columns}
          paginationModel={paginationModel}
          pageSizeOptions={[5]}
          disableColumnSelector
          sx={{ border: 0 }}
          disableRowSelectionOnClick
          onPaginationModelChange={handlePaginationModelChange}
        />
      </Paper>
      <ConfirmRemoveModal
        open={openConfirmRemoveModal}
        handleClose={handleCloseConfirmRemoveModal}
        idToRemove={idToRemoveSeminar}
      />
    </>
  );
};
