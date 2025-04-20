// 可能在 src/actions/authActions.js 或直接在需要的组件里
import { useDispatch } from 'react-redux';
import { navigate } from 'gatsby';
import { logout } from '../state/auth/slice'; // 确保路径正确

// 这个logout函数可以被放在Header组件或任何适合的地方
export default function LogoutPage() {
  const dispatch = useDispatch();
  
  const performLogout = () => {
    dispatch(logout());
    navigate('/login'); // 使用gatsby的navigate函数重定向到登录页面
  };

  return performLogout;
};

