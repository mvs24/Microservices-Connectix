import { Post } from "../../../store/types/userTypes";
import classes from "./Post.module.css";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { IoIosShareAlt } from "react-icons/io";
import { useDispatch } from "react-redux";
import { toggleLike } from "../../../store/actions/userActions";

interface Props {
  post: Post;
}

const PostComponent = (props: Props) => {
  const { content, likes, likedByMe, _id } = props.post;
  const dispatch = useDispatch();

  const likeHandler = (postId: string, liked: boolean): void => {
    dispatch(toggleLike(postId, liked));
  };

  return (
    <div className={classes.postContainer}>
      <div className={classes.postContent}>{content}</div>
      <div className={classes.actions}>
        <div className={classes.heart}>
          {likedByMe ? (
            <AiFillHeart color="red" onClick={() => likeHandler(_id, true)} />
          ) : (
            <AiOutlineHeart
              onClick={() => {
                likeHandler(_id, false);
              }}
            />
          )}
        </div>
        <div className={classes.comment}>
          <FaRegComment />
        </div>
        <div className={classes.share}>
          <IoIosShareAlt />
        </div>
      </div>
      <div className="">
        Liked by {likedByMe ? likes.length - 1 : likes.length}
        {likedByMe ? "and you" : ""}
      </div>
    </div>
  );
};

export default PostComponent;
