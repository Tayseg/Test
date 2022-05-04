import React from 'react';
import { useHistory } from 'react-router-dom';

export default function UserAuthGuard({ children }) {
  const history = useHistory();

  if (!localStorage.getItem('user')) {
    history.push('/');
    return <></>;
  }
  return <>{children}</>;
}