import React from "react";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

export interface ChipListProps {
  eventId: string;
  items: { userId: string; userName: string }[];
  onDelete: (data: { type: string; eventId: string; userId: string }) => void;
  disabled: boolean;
  isDeleting: boolean;
}

export interface Item {
  userId: string;
  userName: string;
}

const ChipList: React.FC<ChipListProps> = ({ eventId, items, onDelete, disabled, isDeleting }) => {
  const handleDelete = (item: Item) => () => {
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
