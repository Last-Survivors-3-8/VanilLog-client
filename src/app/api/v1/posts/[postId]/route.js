import mongoose from 'mongoose';
import createError from 'http-errors';
import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';

import dbConnect from '@lib/dbConnect';
import Post from '@models/Post';
import { ERROR_MESSAGES, ERROR_CODES } from '@utils/errors';
import { sendErrorResponse } from '@utils/response';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

function getPostIdFromUrl(url) {
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 1];
}

async function PUT(request) {
  await dbConnect();

  try {
    const postId = getPostIdFromUrl(request.url);

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw createError(
        ERROR_CODES.INVALID_POSTID,
        ERROR_MESSAGES.INVALID_POSTID,
      );
    }

    let parsedData;
    try {
      parsedData = JSON.parse(await request.text());
    } catch {
      throw createError(ERROR_CODES.INVALID_JSON, ERROR_MESSAGES.INVALID_JSON);
    }
    let { title, content } = parsedData;

    // Sanitize the title and content
    title = DOMPurify.sanitize(title);
    content = DOMPurify.sanitize(content);

    if (!title || !content) {
      throw createError(
        ERROR_CODES.MISSING_POST_FIELDS,
        ERROR_MESSAGES.MISSING_POST_FIELDS,
      );
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, content },
      { new: true },
    );

    if (!updatedPost) {
      throw createError(
        ERROR_CODES.POST_NOT_FOUND,
        ERROR_MESSAGES.POST_NOT_FOUND,
      );
    }

    return NextResponse.json({
      status: 'success',
      data: {
        message: '포스트가 성공적으로 업데이트되었습니다',
        post: updatedPost,
      },
    });
  } catch (error) {
    return sendErrorResponse(error);
  }
}

export { PUT };
