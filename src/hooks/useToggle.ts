import { useState } from 'react';

function useToggle(initialValue: boolean = false): [boolean, () => void] {
  const [value, setValue] = useState(initialValue);
  const toggle = () => void setValue(value => !value);
  return [value, toggle];
}

export default useToggle;
