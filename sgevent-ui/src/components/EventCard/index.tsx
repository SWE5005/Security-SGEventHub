import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import DeleteModal from '../DeleteModal';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import img from '../../images/img-placeholder.png';
import LoadingButton from '@mui/lab/LoadingButton';
import { selectAuthSlice } from '../../state/auth/slice';
import { getFormattedTime } from '../../utils';
import { useSelector } from 'react-redux';

export interface EventCardProps {
  value: any;
  onEdit: (eventId: string) => void;
  onDelete: (eventId: string) => void;
  onRegister: (params: { type: string; eventId: string; userId: string }) => void;
  onDetails: (eventId: string) => void;
  isAdmin: boolean;
  isRegistering: boolean;
  isDeleting?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ value, onEdit, onDelete, onRegister, onDetails, isAdmin, isRegistering }) => {
  const { userInfo } = useSelector(state => selectAuthSlice(state));
  return (
    <Card sx={{ width: '100%', margin: 1 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            {value ? (
              <img style={{ width: '100%', height: '100%' }} alt={value.title} src={value.cover || img} />
            ) : (
              <Skeleton variant="rectangular" width="100%" height="100%" />
            )}
          </Grid>
          <Grid item xs={7}>
            {value ? (
              <Box sx={{ height: 110 }}>
                <Typography gutterBottom variant="h6">
                  {value.title}
                </Typography>
                <Typography display="block" variant="caption" color="text.secondary">
                  {value.description}
                </Typography>
                <Typography display="block" variant="caption" color="text.secondary">
                  {`Event Time: ${getFormattedTime(value.startDatetime)}`}
                </Typography>
                <Typography display="block" variant="caption" color="text.secondary">
                  {`Capacity: ${value.registrationCount}/${value.capacity}`}
                </Typography>
                <Typography
                  display="block"
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'revert-layer',
                    '-webkit-line-clamp': '2',
                    '-webkit-box-orient': 'vertical',
                    display: '-webkit-box',
                  }}
                >
                  {`Location: ${value.location}`}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ pt: 0.5 }}>
                <Skeleton />
                <Skeleton width="60%" />
              </Box>
            )}
          </Grid>
          <Grid item xs={2} lg={1}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'space-around',
              }}
            >
              {isAdmin ? (
                <Box sx={{ display: 'flex' }}>
                  <IconButton
                    color="primary"
                    aria-label="Edit"
                    onClick={() => {
                      onEdit(value.id);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <DeleteModal
                    onDelete={() => {
                      onDelete(value.id);
                    }}
                    title="Delete event?"
                    label={`Are you sure to delete ${value.title}?`}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    justifyContent: 'space-around',
                  }}
                >
                  <LoadingButton
                    fullWidth
                    variant={value?.registered ? 'outlined' : 'contained'}
                    type="submit"
                    loadingPosition="end"
                    loading={isRegistering}
                    onClick={() => {
                      onRegister({
                        type: value?.registered ? 'unregister' : 'register',
                        eventId: value.id,
                        userId: userInfo.user_name,
                      });
                    }}
                  >
                    {value?.registered ? 'Leave' : 'Join'}
                  </LoadingButton>

                  <LoadingButton
                    variant="outlined"
                    onClick={() => {
                      onDetails(value.id);
                    }}
                  >
                    Details
                  </LoadingButton>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default EventCard;
