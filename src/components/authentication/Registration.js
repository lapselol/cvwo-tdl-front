import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { IconButton, OutlinedInput, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import Notification from "../Notification";
import "../../App.css";

const initialFValues = {
  email: "",
  password: "",
  password_confirmation: "",
  loginErrors: "",
  showPassword: false,
};

export default function Registration(props) {
  const { handleLogin } = props;
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

  const [values, setValues] = useState(initialFValues);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  let navigate = useNavigate();

  const handleSuccessfulAuth = (data) => {
    handleLogin(data);
    navigate("/dashboard");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (event) => {
    axios
      .post(
        `${API_ENDPOINT}/registrations`,
        {
          user: {
            email: values.email,
            password: values.password,
            password_confirmation: values.password_confirmation,
          },
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response)
        if (response.data.status === "created") {
          localStorage.setItem("token", response.data.jwt);
          handleSuccessfulAuth(response.data);
        }
      })
      .catch((error) => {
        console.log("registration error", error);
        setNotify({
          isOpen: true,
          message: "Please choose a different email",
          type: "error",
        });
      });
    event.preventDefault();
  };

  return (
    <div className="Home">
      <h1>Sign Up</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <OutlinedInput
            type="email"
            name="email"
            value={values.email}
            onChange={handleInputChange}
            sx={{ width: "48ch" }}
            placeholder="welcome@gmail.com"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <OutlinedInput
            type={values.showPassword ? "text" : "password"}
            name="password"
            value={values.password}
            onChange={handleInputChange}
            sx={{ width: "48ch" }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Confirm Password</label>
          <OutlinedInput
            type={values.showPassword ? "text" : "password"}
            name="password_confirmation"
            value={values.password_confirmation}
            onChange={handleInputChange}
            sx={{ width: "48ch" }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </div>
        <button type="submit" className="primary" id="auth">
          Register
        </button>
      </form>
    <Notification notify={notify} setNotify={setNotify} />
    </div>
  );
}
