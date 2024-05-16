import React, { useRef, useEffect } from "react";

function IndeterminateCheckbox({ indeterminate, className = "", ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [indeterminate, rest.checked]);

  return <input type='checkbox' ref={ref} className={className} {...rest} />;
}

export default IndeterminateCheckbox;
