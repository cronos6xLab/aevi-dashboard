'use client';

interface Props {
  msg: string;
  err?: boolean;
}

export function Toast({ msg, err }: Props) {
  return <div className={'toast show' + (err ? ' error' : '')}>{msg}</div>;
}
