'use client'

// Referenced from
// https://stackoverflow.com/questions/72306064/is-there-any-way-to-fix-errors-caused-by-bootstrap-when-upgrading-to-react-18
// and
// https://stackoverflow.com/questions/76268977/how-to-create-a-portal-modal-in-next-13-4


import { useState, useEffect, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

export default function PortalWrapper ({ children }: PropsWithChildren) {
  const [el, setEl] = useState<HTMLElement | undefined>(undefined);

  useEffect(() => {
    const el = document?.createElement('div')
    setEl(el);
    const tooltipRoot = document?.getElementById('tooltip-root');
    tooltipRoot?.appendChild(el)

    return () => {
      tooltipRoot?.removeChild(el)
    }
  }, []);

  return el ? createPortal(children, el) : null;
}
