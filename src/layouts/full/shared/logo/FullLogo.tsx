

import Logo from "../../../../../public/flyingstarslogo.png";
import { Link } from "react-router";
const FullLogo = () => {
  return (
    <Link to={"/"}>
      <img src={Logo} alt="logo" className="block w-48" />
    </Link>
  );
};

export default FullLogo;
