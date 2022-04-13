import React, { useState } from 'react';
import { useTimeout } from '../hooks/useTimeout';

export const Toast = (props) => {
  const [duration, setDuration] = useState(props.autoHideDuration);
  const [mouseOver, setMouseOver] = useState(false);

  const handleMouseEnter = () => {
    setMouseOver(true);
    setDuration(0);
  };
  const handleMouseLeave = () => {
    setMouseOver(false);
    setDuration(props.resumeHideDuration);
  };

  useTimeout(() => {
    if (!props.persistent && !mouseOver) props.close();
  }, duration);

  return (
    <div
      className="toast"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="toast__text">{props.children}</div>
      <div>
        <button onClick={props.close} className="toast__close-btn">
          x
        </button>
      </div>
    </div>
  );
};
