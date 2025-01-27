import instance from "./instance";
import { setUserDetails } from "../feature/userSlice";

export const Createaccount = async (formData) => {
  try {
    const response = await instance.post("user/signup", formData);
    return response;
  } catch (error) {
    console.error("Error in Createaccount:", error);
    throw error;
  }
};

export const userLogin = async (email, password, dispatch, navigate, toast) => {
  try {
    const response = await instance.post("user/login", { email, password });
    if (response.status === 200) {
      toast.success("Login successful!");
      dispatch(setUserDetails(response.data.user));
    }
  } catch (error) {
    if (error.response?.status === 403) {
      toast.error("Your account has been temporarily blocked. Please try again later.");
      return;
    }

    if (error.response?.data?.message === "Email not verified") {
      toast.error("Your email is not verified. To verify, please enter the OTP.");
      navigate("/otp", { state: { email } });
      return;
    }

    if (error.response?.data?.message === "Invalid email and password") {
      toast.error("Invalid email and password");
      return;
    }

   
    console.error("Error in userLogin:", error);
    throw error;
  }
};
