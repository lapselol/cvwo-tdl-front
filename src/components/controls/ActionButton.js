import React from "react";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 0,
    margin: theme.spacing(0.5),
  },
}));

export default function ActionButton(props) {
  const classes = useStyles();
  const { color, children, onClick } = props;

  return (
    <Button
      className={`${classes.root} ${classes[color]}`}
      color={color}
      variant="contained"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
