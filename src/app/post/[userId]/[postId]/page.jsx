import PostDetail from '@src/app/components/PostDetail/PostDetail';
import CommentsContainer from '@src/app/components/Comment/CommentsContainer';
import { METAINFO } from '@utils/metaInfo';
import axios from 'axios';

export async function generateMetadata({ params }) {
  const postId = params.postId;
  try {
    const response = await axios(
      `${process.env.DOMAIN}/api/v1/posts/${postId}`,
    );
    const post = response.data.data;
    const blockWithText = post.content.blocks.find((block) => block.data?.text);

    const postDescription = blockWithText
      ? blockWithText.data.text
      : post.title;

    return {
      title: post.title,
      description: postDescription,
    };
  } catch (error) {
    return {
      title: METAINFO.POST_DETAIL.TITLE,
      description: METAINFO.POST_DETAIL.DESCRIPTION,
    };
  }
}

export default function PostDetailPage({ params }) {
  const userId = params.userId;
  const postId = params.postId;

  return (
    <div className='bg-gray-100 min-h-screen p-10'>
      <PostDetail userId={userId} postId={postId} />
      <CommentsContainer postId={postId} />
    </div>
  );
}
