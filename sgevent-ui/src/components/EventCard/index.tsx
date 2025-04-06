import * as React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { getFormattedTime } from "../../utils";
import Button from "@mui/material/Button";
import DeleteModal from "../DeleteModal";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import img from "../../images/img-placeholder.png";
import LoadingButton from "@mui/lab/LoadingButton";
import { authSelector } from "../../state/auth/slice";
import { useSelector } from "react-redux";
import { navigate } from "gatsby"; // 导入 navigate 函数

export default function EventCard({
  value,
  onEdit,
  onDelete,
  onRegister,
  onDetails, // 添加 onDetails 函数
  isAdmin,
  isRegistering,
}) {
  const { userInfo } = useSelector((state) => authSelector(state));
  return (
    <Card sx={{ width: "100%", margin: 1 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            {value ? (
              <img
                style={{ width: "100%", height: "100%" }}
                alt={value.eventTitle}
                src={value.eventCover || img}
              />
            ) : (
              <Skeleton variant="rectangular" width="100%" height="100%" />
            )}
          </Grid>
          <Grid item xs={7}>
            {value ? (
              <Box sx={{ height: 110 }}>
                <Typography gutterBottom variant="h6">
                  {value.eventTitle}
                </Typography>
                <Typography
                  display="block"
                  variant="caption"
                  color="text.secondary"
                >
                  {value.eventDesc}
                </Typography>
                <Typography
                  display="block"
                  variant="caption"
                  color="text.secondary"
                >
                  {`Event Time: ${getFormattedTime(value.eventStartDt)}`}
                </Typography>
                <Typography
                  display="block"
                  variant="caption"
                  color="text.secondary"
                >
                  {`Capacity: ${value.registrationCount}/${value.eventCapacity}`}
                </Typography>
                <Typography
                  display="block"
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "revert-layer",
                    "-webkit-line-clamp": "2",
                    "-webkit-box-orient": "vertical",
                    display: "-webkit-box",
                  }}
                >
                  {`Location: ${value.eventPlace}`}
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
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-around",
              }}
            >
              {isAdmin ? (
                <Box sx={{ display: "flex" }}>
                  <IconButton
                    color="primary"
                    aria-label="Edit"
                    onClick={() => {
                      onEdit(value.eventId);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <DeleteModal
                    onDelete={() => {
                      onDelete(value.eventId);
                    }}
                    title="Delete event?"
                    label={`Are you sure to delete ${value.eventTitle}?`}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    justifyContent: "space-around",
                  }}
                >
                  <LoadingButton
                    fullWidth
                    variant={value?.registered ? "outlined" : "contained"}
                    type="submit"
                    loadingPosition="end"
                    loading={isRegistering}
                    onClick={() => {
                      onRegister({
                        type: value?.registered ? "unregister" : "register",
                        eventId: value.eventId,
                        userId: userInfo.userId,
                      });
                    }}
                  >
                    {value?.registered ? "Leave" : "Join"}
                  </LoadingButton>

                  <LoadingButton 
                    variant="outlined" 
                    onClick={() => {
                      onDetails(value.eventId);  // 修改这里，直接传递 eventId
                      }}>
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
}
