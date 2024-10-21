import React from "react";
import useTriggerEvents from "../../core/hooks/useTriggerEvents";
import { Link } from "govuk-react";

export interface ILinkProps {
  className?: string;
  eventHandler?: string;
  text: string;
}

export const PrevLink = React.memo(({
  className='',
  text,
  eventHandler='previousPage'
}: ILinkProps) => {
  const { triggerEvent } = useTriggerEvents();
  return (
    <Link
      className={`govuk-link goBackLink ${className}`}
      onClick={() => triggerEvent(eventHandler)}
    >
      {text}
    </Link>
  );
});
