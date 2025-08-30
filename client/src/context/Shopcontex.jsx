import React, { useState, createContext } from 'react';

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
