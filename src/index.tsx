import React from 'react';
import { render } from 'react-dom';
import Users from './components/Users';
import useToggle from './hooks/useToggle';
import Button from './components/Button';

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
