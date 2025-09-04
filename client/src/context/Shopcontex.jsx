import  { useState, createContext } from 'react';
import PropTypes from "prop-types";
export const shopcontext = createContext();

function ShopcontexProvider(props) {
  const [search, setSearch] = useState('');

  return (
    <shopcontext.Provider value={{ search, setSearch }}>
      {props.children}
    </shopcontext.Provider>
  );
}

export default ShopcontexProvider;
ShopcontexProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
