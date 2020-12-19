import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../../store/actions/userActions";
import { useHttp } from "../../hooks/useHttp";
import LoadingSpinner from "../../shared/LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../shared/ErrorModal/ErrorModal";
import { RootState } from "../../index";
import { Post } from "../../store/types/userTypes";
import PostComponent from "./components/Post";

const Home = () => {
  const { error, loading, sendRequest, removeError } = useHttp();
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.user);

  useEffect(() => {
    (() => {
      dispatch(getPosts());
    })();
  }, []);

  return (
    <div>
      {userState.loading && <LoadingSpinner />}
      {userState.error && (
        <ErrorModal removeHandler={removeError}>{userState.error}</ErrorModal>
      )}
      {userState.loading === false &&
        userState.homePosts?.map((post: Post) => (
          <PostComponent key={post._id} post={post} />
        ))}
    </div>
  );
};

export default Home;
