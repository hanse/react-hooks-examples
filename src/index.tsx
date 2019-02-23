import React from 'react';
import { render } from 'react-dom';
import Users from './Users';
import useToggle from './useToggle';
import Button from './Button';

function App() {
  const [mounted, toggle] = useToggle(false);
  return (
    <>
      {mounted && <Users />}
      <Button onClick={toggle}>{mounted ? 'Unmount' : 'Mount'}</Button>
    </>
  );
}

render(<App />, document.getElementById('root'));
