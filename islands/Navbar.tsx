import { useState } from "preact/hooks";

import { Button } from "../components/Button.tsx";
import { Link } from "../components/Link.tsx";

import { IconLinkedIn } from "../components/IconLinkedIn.tsx";
import { IconEmail } from "../components/IconEmail.tsx";
import { IconGitHub } from "../components/IconGitHub.tsx";

const links = [
  {
    href: "https://www.linkedin.com/in/binodnepali",
    label: "linkedin",
    icon: <IconLinkedIn className={"fill-current"} />,
  },
  {
    href: "mailto:nepalibinod9@gmail.com",
    label: "email",
    icon: <IconEmail className={"fill-current"} />,
  },
  {
    href: "https://github.com/binodnepali/portfolio",
    label: "github",
    icon: <IconGitHub className={"fill-current"} />,
  },
];

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

  return (
    <nav class="h-14 flex items-center px-4">
      <div class="flex flex-grow-1 items-center ">
        <Link class="font-semibold text-xl text-primary" href="/" label="b.n">
          B.N
        </Link>
      </div>

      <div class="flex gap-4">
        {links.map(({ href, label, icon }) => (
          <Link
            href={href}
            key={href}
            label={label}
            target="_blank"
          >
            {icon}
          </Link>
        ))}
      </div>

      <Button class="ml-2" onClick={() => setIsDark(!isDark)}>
        <div class="flex">
          <span class="material-symbols-outlined">
            {isDark ? "dark_mode" : "light_mode"}
          </span>
        </div>
      </Button>
    </nav>
  );
}
