import PropTypes from "prop-types";

import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


function Adminprotect({ children }) {
  const admin = useSelector((state) => state.admin?.adminInfo);
  return admin ? children : <Navigate to="/admin/login" />;
}
Adminprotect.propTypes = {
  children: PropTypes.node.isRequired,
};
export default Adminprotect;
