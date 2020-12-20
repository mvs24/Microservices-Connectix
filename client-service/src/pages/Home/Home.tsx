import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../../store/actions/userActions";
import LoadingSpinner from "../../shared/LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../shared/ErrorModal/ErrorModal";
import { RootState } from "../../index";
import { Post } from "../../store/types/userTypes";
import PostComponent from "./components/Post";
import { removeError } from "../../store/actions/userActions";
import classes from "./Home.module.css";
import Input from "../../shared/Input/Input";
import { Link } from "react-router-dom";
import { Header } from "../../components/Header/Header";

const Home = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(getPosts());
  }, []);

  return (
    <div>
      {userState.loading && <LoadingSpinner />}
      {userState.error && (
        <ErrorModal removeHandler={() => dispatch(removeError())}>
          {userState.error}
        </ErrorModal>
      )}
      <Header userState={userState} />
      <div className={classes.homePostsAndProfile}>
        <div className={classes.homePosts}>
          {userState.loading === false &&
            userState.homePosts?.map((post: Post) => (
              <PostComponent key={post._id} post={post} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
