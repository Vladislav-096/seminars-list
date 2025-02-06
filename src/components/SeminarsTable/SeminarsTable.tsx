import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../../api/queryClient";
import { getSeminares, Seminar, Seminars } from "../../api/seminars";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Paper, Typography } from "@mui/material";
import { ConfirmRemoveModal } from "../ConfirmRemoveModal/ConfirmRemoveModal";
import { EditModal } from "../EditModal/EditModal";
import { initialRowData } from "../../constants/constants";
import { Loader } from "../Loader/Loader";
import { ToolTipCell } from "../TooltipSell/TooltipCell";

// Компонент таблицы, используется библиотека MUI (в ТЗ отсутвтовали требования касательно библиотек компонентов)
export const SeminarsTable = () => {
  const [seminars, setSeminars] = useState<Seminars>([]);
  const [openConfirmRemoveModal, setOpenConfirmRemoveModal] =
    useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [idToRemoveSeminar, setIdToRemoveSeminar] = useState<string>("");
  const [seminarToEdit, setSeminarToEdit] = useState<Seminar>(initialRowData);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 15,
  });

  const handleOpenConfirmRemoveModal = () => setOpenConfirmRemoveModal(true);
  const handleCloseConfirmRemoveModal = () => setOpenConfirmRemoveModal(false);
  const handleOpenEditModal = () => setOpenEditModal(true);
  const handleCloseEditModal = () => setOpenEditModal(false);
  const [isDisabled, setIsDisabled] = useState(false);

  // GET-запрос для получения семинаров, используется react-query
  const getSeminaresQuery = useQuery(
    {
      queryFn: () => getSeminares(),
      queryKey: ["seminars"],
      retry: false,
    },
    queryClient
  );

  // Конфигурация колонок таблицы
  const columns: GridColDef[] = [
    {
      field: "actions",
      headerName: "Actions",
      width: 222,
      disableColumnMenu: true,
      sortable: false,
      type: "actions",
      hideSortIcons: true,
      resizable: false,
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
    {
      field: "id",
      headerName: "ID",
      width: 60,
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
    },
    {
      field: "title",
      headerName: "Title",
      width: 150,
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
      renderCell: ToolTipCell,
    },
    {
      field: "description",
      headerName: "Description",
      width: 150,
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
      renderCell: ToolTipCell,
    },
    {
      field: "date",
      headerName: "Date",
      width: 120,
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
    },
    {
      field: "time",
      headerName: "Time",
      width: 90,
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
    },
    {
      field: "photo",
      headerName: "Photo",
      width: 155,
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
      renderCell: ToolTipCell,
    },
  ];

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
      }, 2000);
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
        <p>
          <span>Server error: </span>
          <span>{getSeminaresQuery.error.message}</span>
        </p>
        <button disabled={isDisabled} onClick={handleRefetch}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Schedule of seminars
      </Typography>
      <Paper sx={{ height: "89vh", width: "100%" }}>
        <DataGrid
          rows={seminars}
          columns={columns}
          paginationModel={paginationModel}
          pageSizeOptions={[15]}
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
      <EditModal
        open={openEditModal}
        handleClose={handleCloseEditModal}
        row={seminarToEdit}
      />
    </>
  );
};
