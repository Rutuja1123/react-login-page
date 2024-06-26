import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LandingPage() {
    const [auth, setAuth] = useState(false);

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    let currentState = '';
    useEffect(() => {
      axios.get("https://example-backend.com")
      .then( res => {
        console.log(currentState = res.data.Status)
        if (currentState === "success"){
          setAuth(true);
          navigate("/");
        }
      })
      .then(err => console.log(err));
    });

    const handleDelete = () => {
      axios.get("https://example-backend.com/logout")
      .then(res => {
        window.location.reload(true);
      }).catch(err => console.log(err));
    }

    return (
        <div className="flex items-center justify-center h-screen select-none">
        <div className="p-4 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-2xl font-semibold text-center mb-4">
            LWA-POC 
          </h2>
          { auth ?
          <div className="text-center">
            <h3>Authorized User</h3>
            <button
              className="primary-button w-full bg-blue-500 text-white px-4 py-2 rounded-lg focus:outline-none"
              type="submit"
              onClick={handleDelete}
            >
              LogOut
            </button>
          </div> 
            :
          <div className="text-center">
            <br></br>
            <div>
            <Link to="/login"
              className="primary-button w-full bg-blue-500 text-white px-4 py-2 rounded-lg focus:outline-none"
            >
              LogOut
            </Link></div>
          </div>
          }
        </div>
        </div>
    )
}

export default LandingPage;