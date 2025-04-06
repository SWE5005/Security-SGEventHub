import React from "react";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

const ChipList = ({ eventId, items, onDelete, disabled, isDeleting }) => {
  const handleDelete = (item) => () => {
    onDelete({
      type: "unregister",
      eventId,
      userId: item.userId,
    });
  };

  return (
    <Stack direction="row" spacing={1} sx={{ marginTop: 1 }}>
      {(items || []).map((item) => (
        <Chip
          disabled={disabled || isDeleting}
          variant="outlined"
          color="primary"
          key={item.userId}
          label={item.userName}
          onDelete={handleDelete(item)}
        />
      ))}
    </Stack>
  );
};

export default ChipList;
