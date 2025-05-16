import { createContext, useContext, useReducer } from "react";
import PropTypes from 'prop-types';

// Create the context
const StateContext = createContext();

// Create a provider component
export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

StateProvider.propTypes = {
  reducer: PropTypes.func.isRequired,
  initialState: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

// Custom hook to use the state
export const useStateValue = () => useContext(StateContext);
