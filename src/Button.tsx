import React, { HTMLProps } from 'react';

type Props = HTMLProps<HTMLButtonElement>;

function Button(props: Props) {
  return <button {...props} />;
}

export default Button;
