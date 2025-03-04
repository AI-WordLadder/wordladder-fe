import "./navbar.css";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, LogOut, LogIn, Menu, X } from "lucide-react";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Navbar = () => {

    <div className="Navbar">
        <h1>WORDLADDER</h1>
            <button className="barbutton">Shuffle</button>
            <button className="barbutton" onClick={}>3-letters</button>
            <button className="barbutton">4-letters</button>
            <button className="barbutton">5-letters</button>
            <button className="barbutton blind">blind search</button>            
            <button className="barbutton heuristic">heuristic search</button>


    </div>
  );
};
export default Navbar;