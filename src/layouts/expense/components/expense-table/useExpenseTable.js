import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { Box, Icon, IconButton, Menu } from "@mui/material";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import ExpenseRepository from "layouts/expense/repository/ExpenselRepository";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const ActionMenu = (props) => {
  const {
    openMenu,
    handleCloseMenu,
    handleEditAction,
    handelDeleteAction,
    anchorEl,
  } = props;
  return (
    <Menu
      anchorEl={anchorEl}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <Box display="flex" flexDirection="column">
        <MDButton
          variant="text"
          color="text"
          onClick={() => handleEditAction()}
        >
          <Icon>edit</Icon>
          &nbsp;edit
        </MDButton>
        <MDButton
          variant="text"
          color="error"
          onClick={() => handelDeleteAction()}
        >
          <Icon>delete</Icon>
          &nbsp;delete
        </MDButton>
      </Box>
    </Menu>
  );
};

const useTables = (rowData, setOpenAlert, setAlertMessage, getExpense) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const [openMenu, setOpenMenu] = useState(false);

  const handleOpenMenu = (event, Id, categoryName) => {

    setAnchorEl(event.currentTarget);
    setSelectedId(Id);

    setOpenMenu(event.currentTarget);
  };

  //Close Menu
  const handleCloseMenu = () => setOpenMenu(false);

  const handleEditAction = () => {
    navigate("/expense/edit", { state: { id: selectedId } });
  };

  //Delete Category
  const deleteExpenseById = async (id) => {
    return await ExpenseRepository.delete(id);
  };

  //User form hook for deletion
  const { mutateAsync, isLoading: isMutate } = useMutation(deleteExpenseById, {
    onSuccess: (response) => {
      getExpense();

      handleCloseMenu();
      setOpenAlert(true);
      setOpenAlert(true);
      setAlertMessage("Expense Deletion Successful");
    },
    onError: (err) => {
      setOpenAlert(true);
      setAlertMessage("Expense Deletion Unsucessful");
    },
  });

  const remove = async () => {
    await mutateAsync(selectedId);
    queryClient.invalidateQueries("expense");
  };

  const handelDeleteAction = () => {
    remove();
  };

  const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  `;

  const columns = [
    { Header: "Expense name", accessor: "expense_name", align: "center" },
    { Header: "Amount", accessor: "amount", align: "center" },
    {
      Header: "Expense Date Time",
      accessor: "expense_Date_time",
      align: "center",
    },
    { Header: "Expense Status ", accessor: "expense_status", align: "center" },
    { Header: "Expense Type", accessor: "expense_type", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = rowData?.map((row) => ({
    expense_name: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {row.expense_name}
      </MDTypography>
    ),
    amount: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {row.amount}
      </MDTypography>
    ),
    expense_Date_time: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {row.expense_Date_time}
      </MDTypography>
    ),
    expense_status: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {row.expense_status}
      </MDTypography>
    ),
    expense_type: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {row.expense_type}
      </MDTypography>
    ),
    action: (
      <>
        <IconButton
          size="small"
          disableRipple
          color="inherit"
          aria-controls="notification-menu"
          aria-haspopup="true"
          variant="contained"
          onClick={(e) => handleOpenMenu(e, row?._id, row.name)}
        >
          <MoreVertRoundedIcon />
        </IconButton>
        <ActionMenu
          openMenu={openMenu}
          anchorEl={anchorEl}
          handleCloseMenu={handleCloseMenu}
          handleEditAction={handleEditAction}
          handelDeleteAction={handelDeleteAction}
        />
      </>
    ),
  }));

  return { rows, columns };
};
export default useTables;
