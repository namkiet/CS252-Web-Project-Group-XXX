import React from 'react'
import { useInView } from 'react-intersection-observer'

export const SlideInOnScroll = ({ children }: { children: React.ReactNode }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-[1600ms] ease-out
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-20'}
      `}
    >
      {children}
    </div>
  )
}