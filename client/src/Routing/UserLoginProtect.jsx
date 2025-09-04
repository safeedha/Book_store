import PropTypes from "prop-types";
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export function UserLoginProtect({ children }) {
  const user = useSelector((state) => state.user?.userInfo);

  if (user) {
    return <Navigate to={'/'} />;
  }
  return children;
}
UserLoginProtect.propTypes = {
  children: PropTypes.node.isRequired,
};
export default UserLoginProtect;
