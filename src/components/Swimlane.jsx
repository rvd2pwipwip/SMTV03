import React from 'react';
import '../styles/App.css';

const Swimlane = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <div 
      className="content-swimlane"
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Swimlane.displayName = 'Swimlane';

export default Swimlane; 