import React from 'react'
import { useInView } from 'react-intersection-observer'

type Direction = 'up' | 'down' | 'right' | 'left'

interface SlideInOnScrollProps {
  children: React.ReactNode
  direction?: Direction
  duration?: number
  delay?: number
  className?: string
}

export const SlideInOnScroll = ({ 
    children,
    direction = 'up',
    duration = 1000,
    delay = 0,
    className = ''
  }: SlideInOnScrollProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const directionClasses = {
    up: 'translate-y-16',
    down: '-translate-y-16',
    left: '-translate-x-16',
    right: 'translate-x-16',
  }

  return (
    <div
      ref={ref}
      style={{ 
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
      className={`
        transition-all ease-out
        ${className}
        ${inView 
          ? 'opacity-100 translate-x-0 translate-y-0'
          : `opacity-0 ${directionClasses[direction]}`
        }
      `}
    >
      {children}
    </div>
  )
}