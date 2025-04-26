import React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

export interface ChipListProps {
  eventId: string;
  items: { userId: string; emailAddress: string }[];
  onDelete?: (data: { userId: string; eventId: string }) => void;
  disabled?: boolean;
  isDeleting?: boolean;
}

export interface Item {
  userId: string;
  emailAddress: string;
}

const ChipList: React.FC<ChipListProps> = ({ eventId, items, onDelete, disabled, isDeleting }) => {
  const handleDelete = (item: Item) => () => {
    onDelete &&
      onDelete({
        userId: item.userId,
        eventId,
      });
  };

  return (
    <Stack direction="row" spacing={1} sx={{ marginTop: 1 }}>
      {(items || []).map(item => (
        <Chip
          disabled={disabled || isDeleting}
          variant="outlined"
          color="primary"
          key={item.userId}
          label={item.emailAddress}
          onDelete={handleDelete(item)}
        />
      ))}
    </Stack>
  );
};

export default ChipList;
