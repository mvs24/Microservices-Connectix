import { Post } from "../../../store/types/userTypes";
import classes from "./Post.module.css";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { IoIosShareAlt } from "react-icons/io";

interface Props {
  post: Post;
}

const PostComponent = (props: Props) => {
  const { content } = props.post;
  return (
    <div className={classes.postContainer}>
      <div className={classes.postContent}>{content}</div>
      <div className={classes.actions}>
        <div className={classes.heart}>
          <AiOutlineHeart onClick={() => {}} />
        </div>
        <div className={classes.comment}>
          <FaRegComment />
        </div>
        <div className={classes.share}>
          <IoIosShareAlt />
        </div>
      </div>
    </div>
  );
};

export default PostComponent;
