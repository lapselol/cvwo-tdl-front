import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  AppBar,
  Toolbar,
  Grid,
  IconButton,
  Badge,
  Tooltip,
  Button,
} from "@mui/material";
import { Logout, NotificationsNone } from "@mui/icons-material";

import { isOverdue } from "../services/dateHandler";
import { getAllTasks } from "../services/taskService";

export default function Appbar(props) {
  const { handleLogout } = props;
  const [count, setCount] = useState(0);
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
  const navigate = useNavigate();

  //for notification icon
  const countOverdue = () => {
    let numOverdue = 0;
    getAllTasks().then((data) => {
      for (var task of data) {
        if (isOverdue(task.deadline) && !task.completed) {
          numOverdue += 1;
        }
      }
      setCount(numOverdue);
    });
  };

  useEffect(() => {
    countOverdue();
  }, []);

  const handleLogoutClick = () => {
    console.log("Clicked Logout");
    axios
      .delete(`${API_ENDPOINT}/logout`, { withCredentials: true })
      .then((response) => {
        handleLogout();
        navigate("../", { replace: true });
      })
      .catch((error) => {
        console.log("logout error", error);
      });
  };

  return (
    <AppBar position="static" color="transparent">
      <Toolbar>
        <Grid container alignItems="center">
          <Grid item sm></Grid>
          <Grid item>
            <Tooltip title="You have overdue items" arrow>
              <IconButton>
                <Badge badgeContent={count} color="error">
                  <NotificationsNone fontSize="medium" />
                </Badge>
              </IconButton>
            </Tooltip>
            <IconButton disableRipple></IconButton>
            <Button
              variant="contained"
              startIcon={<Logout />}
              onClick={() => {
                handleLogoutClick();
              }}
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
