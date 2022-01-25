import React, { useState } from "react";
import axios from "axios";

import { IconButton, OutlinedInput, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import "../../App.css";

const initialFValues = {
  email: "",
  password: "",
  loginErrors: "",
  showPassword: false,
};
export default function Login(props) {
  const { handleSuccessfulAuth, handleMouseDownPassword } = props;
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

  const [values, setValues] = useState(initialFValues);

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

  const handleSubmit = (event) => {
    console.log(values, "login");
    axios
      .post(
        `${API_ENDPOINT}/sessions`,
        {
          user: {
            email: values.email,
            password: values.password,
          },
        },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.logged_in) {
          localStorage.setItem("token", response.data.jwt);
          handleSuccessfulAuth(response.data);
        }
      })
      .catch((error) => {
        console.log("login error", error);
      });
    event.preventDefault();
  };

  return (
    <div className="Home">
      <h1>Sign In</h1>
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
        <button type="submit" className="primary" id="auth">
          Login
        </button>
      </form>
      <hr />
      <p>
        Don't have an account?&ensp;
        <a href="/register">
          <span>Sign up</span>
        </a>
      </p>
    </div>
  );
}
