import Cookies from 'js-cookie';

export const setAuth = (token, user) => {
  Cookies.set('token', token, { expires: 7 });
  Cookies.set('user', JSON.stringify(user), { expires: 7 });
};

export const getAuth = () => {
  const token = Cookies.get('token');
  const user = Cookies.get('user');
  
  if (token && user) {
    return {
      token,
      user: JSON.parse(user),
    };
  }
  
  return null;
};

export const clearAuth = () => {
  Cookies.remove('token');
  Cookies.remove('user');
};

export const isAuthenticated = () => {
  return !!Cookies.get('token');
};

export const getUser = () => {
  const user = Cookies.get('user');
  return user ? JSON.parse(user) : null;
};

export const isAdmin = () => {
  const user = getUser();
  return user?.role === 'admin';
};
