-- 插入用户
INSERT INTO users (id, name, password, email_address, active_status, mobile_number, roles, create_datetime)
VALUES ('11111111-1111-1111-1111-111111111111', 'testuser', 'password', 'test@example.com', 'ACTIVE', '1234567890', 'USER', '2025-01-01T10:00:00');

-- 插入事件
INSERT INTO events (id, title, description, create_datetime, start_datetime, end_datetime, location, capacity, owner_id, status, cover)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Test Event',
  'A test event',
  '2025-01-01T10:00:00',
  '2025-05-01T10:00:00',
  '2025-05-01T12:00:00',
  'Test Place',
  100,
  '11111111-1111-1111-1111-111111111111',
  'OPEN',
  'testcover'
);

-- 插入注册
INSERT INTO event_registration (id, user_id, event_id, register_datetime)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '2025-04-01T09:00:00'
);

-- 插入反馈
INSERT INTO feedback (id, event_id, rating, comment, create_datetime, user_id)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  '22222222-2222-2222-2222-222222222222',
  5,
  'Great event!',
  '2025-04-01T10:00:00',
  '11111111-1111-1111-1111-111111111111'
); 