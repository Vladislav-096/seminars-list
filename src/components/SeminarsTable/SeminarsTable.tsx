import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../../api/queryClient";
import { getSeminares, Seminar, Seminars } from "../../api/seminars";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Paper } from "@mui/material";
import { ConfirmRemoveModal } from "../ConfirmRemoveModal/ConfirmRemoveModal";
import { EditModal } from "../EditModal/EditModal";
import { initialRowData } from "../../constants/constants";
import { Loader } from "../Loader/Loader";

export const SeminarsTable = () => {
  const [seminars, setSeminars] = useState<Seminars>([]);
  const [openConfirmRemoveModal, setOpenConfirmRemoveModal] =
    useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [idToRemoveSeminar, setIdToRemoveSeminar] = useState<string>("");
  const [seminarToEdit, setSeminarToEdit] = useState<Seminar>(initialRowData);

  const handleOpenConfirmRemoveModal = () => setOpenConfirmRemoveModal(true);
  const handleCloseConfirmRemoveModal = () => setOpenConfirmRemoveModal(false);
  const handleOpenEditModal = () => setOpenEditModal(true);
  const handleCloseEditModal = () => setOpenEditModal(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const getSeminaresQuery = useQuery(
    {
      queryFn: () => getSeminares(),
      queryKey: ["seminars"],
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
      width: 222,
      disableColumnMenu: true,
      renderCell: (param) => {
        const currentRow: Seminar = param.row;
        return (
          <>
            <Button
              variant="text"
              color="primary"
              sx={{ textTransform: "none" }}
              onClick={() => {
                setSeminarToEdit(currentRow);
                handleOpenEditModal();
              }}
            >
              Edit seminar
            </Button>
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

  const disableButtonTemporarily = () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });
  };

  const handleRefetch = async () => {
    setIsDisabled(true);
    getSeminaresQuery.refetch();
    await disableButtonTemporarily();
    setIsDisabled(false);
  };

  useEffect(() => {
    const seminarsList = getSeminaresQuery.data;
    if (seminarsList) {
      setSeminars(seminarsList);
    }
  }, [getSeminaresQuery.data]);

  if (getSeminaresQuery.status === "pending") {
    return <Loader />;
  }

  if (getSeminaresQuery.status === "error") {
    return (
      <div>
        <p>Server error</p>
        <button disabled={isDisabled} onClick={handleRefetch}>
          Try again
        </button>
      </div>
    );
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
      <Loader />
      <ConfirmRemoveModal
        open={openConfirmRemoveModal}
        handleClose={handleCloseConfirmRemoveModal}
        idToRemove={idToRemoveSeminar}
      />
      <EditModal
        open={openEditModal}
        handleClose={handleCloseEditModal}
        row={seminarToEdit}
      />
    </>
  );
};
