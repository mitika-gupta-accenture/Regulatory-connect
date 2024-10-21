import React from "react"
import { RcLabel } from "../rcLabel/RcLabel"
import { RcCaption } from "../rcCaption/RcCaption"

interface IRcLabelWithCaptionProps {
  name?: string
  text: string
  toolTip?: string
  className?: string
  size?: string
}

export const RcLabelWithCaption = ({name='',
  text,
  toolTip='',
  className='',
  size="M"
  }: IRcLabelWithCaptionProps) => {
  return (
    <React.Fragment>
      {text && (
        <RcLabel
          text={text}
          size={size}
          className={className}
          name={name}
        />
      )}
      {toolTip && (
        <RcCaption
          text={toolTip}
          size={size}
          className={className}
          name={name}
        />
      )}
    </React.Fragment>
  )
}
