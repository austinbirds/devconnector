import React, {Fragment, useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import Spinner from '../layout/spinner';
import { getPost } from '../../actions/post';
import PostItem from '../posts/PostItem';
import CommentForm from '../post/CommentForm';
import CommentItem from '../post/CommentItem';
import {Link} from 'react-router-dom';

const Post = ({getPost, post:{post, loading}, match}) => {
    useEffect (() => {
        getPost(match.params.id);
    },[getPost], match)

    return loading || post === null ? <Spinner /> : <Fragment>
        <Link to ='/posts' className='btn'>Back to posts</Link>
        <PostItem post={post} showActions={false} />
        <CommentForm postId={post._id} />
        <div className="comments">
            {post.comments.map(comment => (
                <CommentItem key={comment._id} comment={comment} postId={post._id} />
            ))}
        </div>
    </Fragment>

}

Post.propTypes = {
    post: PropTypes.object.isRequired,
    getPost: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    post: state.post
})
export default connect(mapStateToProps, {getPost})(Post);
