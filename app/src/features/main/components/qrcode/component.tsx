import React, { useEffect, useRef } from 'react';
import { qrcode, modes, ecLevel } from 'qrcode.es';

interface Props {
  text?: string
}

export const QrCode: React.FC<Props> = (props: Props) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const defaultOpt = {
      size: 240,
      ecLevel: ecLevel.HIGH,
      minVersion: 4,
      background: '#fff',
      mode: modes.DRAW_WITH_IMAGE_BOX,
      radius: 0,
      image: process.env.PUBLIC_URL + '/icon.png',
      mSize: 0.3
    };

    if (props.text && elementRef.current) {
      elementRef.current.innerHTML = ''
      const q = new qrcode(elementRef.current);
      q.generate(props.text, defaultOpt).then(() => {
        console.log('QR code generated')
      });
    }
  }, [props.text])

  return (
    <div ref={elementRef}></div>
  );
}
