import { FC, PropsWithChildren } from "react";

type ExternalLinkProps = {
  className?: string;
};

const ExternalLink: FC<PropsWithChildren<ExternalLinkProps>> = ({
  children,
  className,
}) => {
  const href = children as string;

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

export default ExternalLink;
