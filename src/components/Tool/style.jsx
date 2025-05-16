const style = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "95vh", // Full viewport height
  },
  paper: {
    //marginTop: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "5px",
    paddingTop: "1rem",
    marginTop: 70,
    //boxShadow: "0 4px 6px rgba(14, 13, 13, 0.1)",
    //backgroundColor: "rgb(247 247 247)",
  },
  form: {
    width: "100%",
    marginTop: 20,
  },
  submit: {
    marginTop: 15,
    marginBottom: 15,
    padding: "10px 20px",
  },
  avatar: {
    margin: 5,
    backgroundColor: "#1976d2",
    width: 100,
    height: 100,
  },
  icon: {
    fontSize: 40,
    cursor: 'pointer',
  },

  table: {
    padding: "25px",
    width: "100%",
    minWidth: 700,
    marginTop: 70,
  },

  tableGridContainer: {
    paddingTop: "20px",
    paddingBottom: "20px"
  },

  dialogEditPwd: {
    paddingTop: "60px"
  },
};

export default style;
