import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { RootState } from "..";

interface Props {
  path: string;
  WrappedComponent: React.FC;
  exact: boolean;
  restricted: boolean;
}

const PrivateRoute = (props: Props) => {
  const { WrappedComponent, path, exact, restricted } = props;

  const userState = useSelector((state: RootState) => state.user);

  if (!userState.isAuthenticated && restricted) {
    return <Redirect to="/" />;
  }

  return <Route component={WrappedComponent} exact={exact} path={path} />;
};

export default PrivateRoute;
