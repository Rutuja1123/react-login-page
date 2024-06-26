import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {setCookie, getCookie, getCookieByName} from './util';

function LoginPage() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [lwa_access_token, set_lwa_access_token] = useState("");

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  // netlify
    window.amazon.Login.setClientId('amzn1.application-oa2-client.239fa509e746486e8efcbf36a4e9e709'); 

  <div id="amazon-root"></div>;

  window.onAmazonLoginReady = function () {
    window.amazon.Login.setClientId(
      "amzn1.application-oa2-client.b9bfa72ebbce4766807145912506899d"
    );
  };
  (function (d) {
    const a = d.createElement("script");
    a.type = "text/javascript";
    a.async = true;
    a.id = "amazon-login-sdk";
    a.src = "https://assets.loginwithamazon.com/sdk/na/login1.js";
    d.addEventListener("DOMContentLoaded", function () {
      //Allow content to load
      const ourElement = d.getElementById("amazon-root");
      ourElement.append(a);
    });
  })(document);

  // Authorize
  const handleClick = () => {
    var options = {};
    options.scope = "profile";
    options.pkce = true; // SDK generates a `code_verifier` and `code_challenge`
    window.amazon.Login.authorize(options, function (response) {
      if (response.error) {
        alert("oauth error " + response.error);
        return;
      }
    const payload = {
        "stage": "development",
            "accountLinkRequest": {
                "redirectUri": "https://lwa-poc.netlify.app/login",
                "authCode": response.code,
                "type": "AUTH_CODE"
            }
    }

    const endpoint = "api.eu.amazonalexa.com";
    const skill_id = "amzn1.ask.skill.4372204c-a922-4cd9-a20c-1dd6ad55c8f6";
    const url = "https://" + endpoint + "/v1/users/~current/skills/" + skill_id + "/enablement";

    console.log(response);
      window.amazon.Login.retrieveToken(response.code, function (response) {
        if (response.error) {
          alert("oauth error " + response.error);
          return;
        }
        // alert("Successfully Logged in with Amazon. Proceed");
        alert("Access Token: " + response.access_token);
        // alert(response);
        setCookie("lwatoken", response.access_token, response.expires_in);
        getCookie();
      
        const aclvalues = {
            lwa_access_token: response.access_token,
            aclUrl: url,
            aclPayload: payload,
        }
        const aclurl = 'https://api.amazonalexa.com/v1/users/~current/skills/amzn1.ask.skill.4372204c-a922-4cd9-a20c-1dd6ad55c8f6/enablement'
        const aclPayload = JSON.stringify(payload);
        const headers = {
        'Authorization': 'Bearer ' + response.access_token,
        'Content-Type': "application/json;charset=UTF-8"
        };

        console.log("aclValues" + aclvalues);

        window.amazon.Login.retrieveProfile(response.access_token, function(response) {
            if ( window.console && window.console.log )
               window.console.log(response);

            try {
                axios.post("https://example-backend.com/amazon/profile", response.profile)
                .then((res) => console.log(res.data.Status === "OK"))
                .then(navigate("/"));
    
            } catch (error) {
                console.log("Cannot read profile: " +  error);
            }
        });

        

        try {
            axios.post("https://example-backend.com/auth/token", aclvalues)
            .then((res) => console.log(res));

        } catch (error) {
            console.log("Cannot enable skill: " +  error);
        }
      });

    });
  };

 
  let currentState = "";
  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("https://example-backend.com/login", values)
      .then(res => console.log(res.data.Status + (currentState = res.data.Status)))
      .then(res => {
        if (currentState === "success") {
          navigate("/");
        }
      })
      .then((err) => console.log(err));
  };

  window.addEventListener("message", function (event) {
    if (event.origin === "https://na.account.amazon.com/") {
      console.log("Received message:", event.data);
    }
  });

  

  return (
    <div className="flex items-center justify-center h-screen select-none">
      <div className="p-4 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        <form className="py-3 gap-y-3" onSubmit={handleSubmit}>
          <div className="mb-2">
            <input
              type="email"
              className="form-input w-full px-4 py-2 border rounded-lg text-gray-700"
              required
              placeholder="Enter Email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </div>

          <div className="mb-2">
            <input
              type="password"
              className="form-input w-full px-4 py-2 border rounded-lg text-gray-700"
              required
              placeholder="Enter Password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />
          </div>

          <div className="mb-4">
            <button
              className="w-full bg-blue-500 text-black px-4 py-2 rounded-lg focus:outline-none"
              type="submit" onClick={handleSubmit}
            >
              Login
            </button>
          </div>

          <div className="mb-4">
          <div id="amazon-root">    
      {/* Login with Amazon Button */}
            <a id='LoginWithAmazon' onClick={handleClick}>
                <img border="0" alt="Login with Amazon"
            src="https://images-na.ssl-images-amazon.com/images/G/01/lwa/btnLWA_gold_156x32.png"
            width="156" height="32" />
            </a>
            </div>
          </div>

          <div className="flex flex-row p-2">
            <div>
              <span className="line pr-5 text-blue-600">
                Don't have an account?
              </span>
            </div>
            <div className="text-gray-600 font-semibold text-lg cursor-pointer hover:text-blue-500">
              <Link to="/Register">Register</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
