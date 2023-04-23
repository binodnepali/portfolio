import { JSX } from "preact";

export const Link = (props: JSX.HTMLAttributes<HTMLAnchorElement>) => {
  return (
    <a
      {...props}
    />
  );
};
