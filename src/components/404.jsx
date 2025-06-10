import { useLocation } from "react-router-dom";
import "./404.css"

const NotFound = () => {
    const location = useLocation();
    return (
        <div className="container">
            <h2>The Page</h2>
            <h1>{location.pathname}</h1>
            <h2>Could not be found</h2>
            <button onClick={() => window.location.href = "/"}>Go Home</button>
        </div>
    );
}

export default NotFound;