import classes from "./Me.module.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../..";
import { useHttp } from "../../hooks/useHttp";
import ErrorModal from "../../shared/ErrorModal/ErrorModal";
import LoadingSpinner from "../../shared/LoadingSpinner/LoadingSpinner";
import Button from "../../shared/Button/Button";
import { useHistory } from "react-router-dom";

interface MyPost {
  content: string;
  createdAt: Date;
  postType: string;
  user: string;
  version: number;
  _id: string;
}
interface Follower {
  email: string;
  lastname: string;
  name: string;
  photo: string;
  profile: string;
  role: string;
  __v: number;
  _id: string;
}

interface Following {
  email: string;
  lastname: string;
  name: string;
  profile: string;
  role: string;
  __v: number;
  _id: string;
}

const Me = () => {
  const { loading, error, sendRequest, removeError } = useHttp();
  const [myPosts, setMyPosts] = useState<null | MyPost[]>(null);
  const [myFollowers, setMyFollowers] = useState<null | Follower[]>(null);
  const [myFollowings, setMyFollowings] = useState<null | Following[]>(null);
  const userState = useSelector((state: RootState) => state.user);

  const history = useHistory();

  useEffect(() => {
    (async () => {
      const myPosts = await sendRequest("get", "/api/moderations/my-posts");
      setMyPosts(myPosts.data);
      const myFollowers = await sendRequest("get", "/api/followings/followers");
      setMyFollowers(
        myFollowers.data.map((follower: any) => follower.follower)
      );
      const myFollowings = await sendRequest("get", "/api/followings");
      setMyFollowings(
        myFollowings.data.map((following: any) => following.followingUser)
      );
    })();
  }, []);

  return (
    <div>
      {loading && <LoadingSpinner />}
      {error && <ErrorModal removeHandler={removeError}>{error}</ErrorModal>}

      <div className={classes.userData}>
        <div>
          <div className={classes.profilePhoto}>
            <img src="" alt="" />
          </div>
          <div className={classes.userInfo}>
            <h2 className={classes.headingSecondary}>
              {userState.data?.name} {userState.data?.lastname}
            </h2>
            <div className={classes.editProfile}></div>{" "}
            <Button
              title="Edit profile"
              onClick={() => {
                history.push("/edit-me");
              }}
            />
          </div>
        </div>

        <div className={classes.followersInfo}>
          {myPosts && <h3>Posts: {myPosts.length}</h3>}
          {myFollowers && <h3>Followers: {myFollowers.length}</h3>}
          {myFollowings && <h3>Followings: {myFollowings.length}</h3>}
        </div>
      </div>
    </div>
  );
};

export default Me;
