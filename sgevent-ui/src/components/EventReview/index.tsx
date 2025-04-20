import React, { useState, useEffect } from 'react';
import { eventApi } from '../../services/event.service';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import { useTheme } from '@mui/material/styles'; // 导入 useTheme 钩子

const { useGetEventReviewsQuery, usePostEventReviewMutation } = eventApi

const EventReview: React.FC<{ eventId: string; userId: string }> = ({ eventId, userId }) => {
  const theme = useTheme(); // 使用 theme 钩子获取当前主题
  const { data: reviews = [], isLoading, refetch } = useGetEventReviewsQuery(eventId);
  const [postReview, { isSuccess, isError, reset }] = usePostEventReviewMutation();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  useEffect(() => {
    // Check if the current user has submitted a comment
    const hasReviewed = reviews.some(review => review.userId === userId);
    setUserHasReviewed(hasReviewed);
  }, [reviews, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // 阻止表单的默认提交行为
    const result = await postReview({ eventId, userId, rating, comment }).unwrap();
    if (result) {
      setRating(0); // 重置评分
      setComment(''); // 重置评论
      refetch(); // 重新获取最新的评论列表
      setSubmitStatus('Review submitted successfully.');
      setTimeout(() => setSubmitStatus(''), 5000); // 5秒后清除状态消息
      setUserHasReviewed(true);
    } else {
      setSubmitStatus('Failed to submit review.');
      setTimeout(() => setSubmitStatus(''), 5000); // 5秒后清除状态消息
    }
  };

  return (
    <Box>
      <Typography variant="h6" style={{ color: theme.palette.primary.main, fontSize: '1.5rem' }}>Event Reviews</Typography>
      <br /><br />
      {isLoading ? (
        <p>Loading reviews...</p>
      ) : (
        reviews.map(review => (
          <Box key={review.reviewId}>
            <Typography>{review.comment}</Typography>
            <Rating name="read-only" value={review.rating} readOnly />
          </Box>
        ))
      )}
      <br /><br /><br />
      {!userHasReviewed && (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Typography variant="h6" style={{ color: theme.palette.primary.main, fontSize: '1.5rem' }}>Write a Review</Typography>
          <Rating
            name="simple-controlled"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            precision={0.5}
            max={5}
          />
          <TextField
            label="Comment"
            multiline
            fullWidth
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Submit Review</Button>
        </Box>
      )}
      {userHasReviewed && <Typography color="secondary">You have already reviewed this event.</Typography>}
      {submitStatus && <Typography color="secondary">{submitStatus}</Typography>}
    </Box>
  );
};

export default EventReview;
