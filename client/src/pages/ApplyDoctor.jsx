import React, { useState } from "react";
import "../styles/contact.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

axios.defaults.baseURL =
  process.env.REACT_APP_SERVER_DOMAIN || "http://localhost:5015/api";


const ApplyDoctor = () => {
  const navigate = useNavigate();
  const [formDetails, setFormDetails] = useState({
    specialization: "",
    experience: "",
    fees: "",
  });

  const inputChange = (e) => {
    const { name, value } = e.target;
    return setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

 const btnClick = async (e) => {
  e.preventDefault();
  try {
    const { data } = await toast.promise(
      axios.post(
        "/doctor/applyfordoctor",   // ❓ confirm if it's /user/applyfordoctor in backend
        {
          specialization: formDetails.specialization,
          experience: formDetails.experience,
          fees: formDetails.fees,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ),
      {
        success: "Doctor application sent successfully",
        error: "Unable to send Doctor application",
        loading: "Sending doctor application...",
      }
    );

    console.log("APPLY DOCTOR RESPONSE:", data);

    if (data?.success) {
      navigate("/");
    }
  } catch (error) {
    console.error("APPLY DOCTOR ERROR:", error?.response?.data || error.message);
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};


      navigate("/");
    } catch (error) {
      return error;
    }
  };

  return (
    <>
      <Navbar />
      <section
        className="register-section flex-center apply-doctor"
        id="contact"
      >
        <div className="register-container flex-center contact">
          <h2 className="form-heading">Apply for Doctor</h2>
          <form className="register-form ">
            <input
              type="text"
              name="specialization"
              className="form-input"
              placeholder="Enter your specialization"
              value={formDetails.specialization}
              onChange={inputChange}
            />
            <input
              type="number"
              name="experience"
              className="form-input"
              placeholder="Enter your experience (in years)"
              value={formDetails.experience}
              onChange={inputChange}
            />
            <input
              type="number"
              name="fees"
              className="form-input"
              placeholder="Enter your fees  (in dollars)"
              value={formDetails.fees}
              onChange={inputChange}
            />
            <button
              type="submit"
              className="btn form-btn"
              onClick={btnClick}
            >
              apply
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ApplyDoctor;
