import { useLocation, /*useMatch,*/ useNavigate, useParams } from "react-router-dom";

const withRouter = (Component) => { 
    const Wrapper = (props) => {
        const navigate = useNavigate();
        const location = useLocation();
        const params = useParams();
        //const match = useMatch();
        
        return <Component {...props} 
            router={{ location, navigate, params }} 
        />;
    };

    return Wrapper;
 }

 export default withRouter;
