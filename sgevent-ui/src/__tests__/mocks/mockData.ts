export const mockUsers = [
  {
    id: '1',
    username: 'testuser1',
    role: 'USER',
    permissions: ['CREATE_EVENT', 'EDIT_EVENT']
  },
  {
    id: '2',
    username: 'testuser2',
    role: 'ADMIN',
    permissions: ['CREATE_EVENT', 'EDIT_EVENT', 'DELETE_EVENT']
  }
];

export const mockEvents = [
  {
    id: '1',
    title: 'Test Event 1',
    description: 'Test Description 1',
    startTime: '2024-03-01T10:00:00',
    endTime: '2024-03-01T12:00:00',
    location: 'Test Location 1'
  },
  {
    id: '2',
    title: 'Test Event 2',
    description: 'Test Description 2',
    startTime: '2024-03-02T14:00:00',
    endTime: '2024-03-02T16:00:00',
    location: 'Test Location 2'
  }
];

export const mockPermissions = [
  {
    id: 1,
    name: 'CREATE_EVENT',
    description: 'Can create events'
  },
  {
    id: 2,
    name: 'EDIT_EVENT',
    description: 'Can edit events'
  },
  {
    id: 3,
    name: 'DELETE_EVENT',
    description: 'Can delete events'
  }
];

export const mockUserPermissions = [
  {
    userId: 1,
    permissionId: 1
  },
  {
    userId: 1,
    permissionId: 2
  },
  {
    userId: 2,
    permissionId: 1
  },
  {
    userId: 2,
    permissionId: 2
  },
  {
    userId: 2,
    permissionId: 3
  }
]; 