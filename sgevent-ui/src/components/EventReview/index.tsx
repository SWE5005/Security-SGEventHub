import React, { useState, useEffect } from 'react';
import { useGetEventReviewsQuery, usePostEventReviewMutation } from '../../services/review.service';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import { useTheme } from '@mui/material/styles';

interface EventReviewProps {
  eventId: string;
  userId: string;
}

const EventReview: React.FC<EventReviewProps> = ({ eventId, userId }) => {
  const theme = useTheme();
  const { data: reviews, isLoading, refetch } = useGetEventReviewsQuery(eventId);
  const [postReview] = usePostEventReviewMutation();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  useEffect(() => {
    // Check if the current user has submitted a comment
    const hasReviewed = reviews?.some(review => review.userId === userId) ?? false;
    setUserHasReviewed(hasReviewed);
  }, [reviews, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await postReview({ eventId, rating, comment }).unwrap();
    if (result) {
      setRating(0);
      setComment('');
      refetch();
      setSubmitStatus('Review submitted successfully.');
      setTimeout(() => setSubmitStatus(''), 5000);
      setUserHasReviewed(true);
    } else {
      setSubmitStatus('Failed to submit review.');
      setTimeout(() => setSubmitStatus(''), 5000);
    }
  };

  return (
    <Box>
      <Typography variant="h6" style={{ color: theme.palette.primary.main, fontSize: '1.5rem' }}>
        Event Reviews
      </Typography>
      <br />
      <br />
      {isLoading ? (
        <p>Loading reviews...</p>
      ) : reviews && reviews.length > 0 ? (
        <Box>
          {reviews.map((review, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography>{review.comment}</Typography>
              <Rating name={`review-${index}`} value={review.rating} readOnly />
            </Box>
          ))}
        </Box>
      ) : (
        <Typography>No reviews yet</Typography>
      )}
      <br />
      <br />
      <br />
      {!userHasReviewed && (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Typography variant="h6" style={{ color: theme.palette.primary.main, fontSize: '1.5rem' }}>
            Write a Review
          </Typography>
          <Rating
            name="simple-controlled"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue ?? 0);
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
            onChange={e => setComment(e.target.value)}
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Submit Review
          </Button>
        </Box>
      )}
      {userHasReviewed && <Typography color="secondary">You have already reviewed this event.</Typography>}
      {submitStatus && <Typography color="secondary">{submitStatus}</Typography>}
    </Box>
  );
};

export default EventReview;
