import { FC, PropsWithChildren } from "react";

type MailLinkProps = {
  className?: string;
};

const MailLink: FC<PropsWithChildren<MailLinkProps>> = ({
  children,
  className,
}) => {
  const href = `mailto:${children as string}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
};

export default MailLink;
