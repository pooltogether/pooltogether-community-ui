import React from 'react'
import { arc } from 'd3-shape'
import { scaleLinear } from 'd3-scale'

export function Gauge({ value = 50, min = 0, max = 100, label, units }) {
  const backgroundFillColor = '#222B45'

  const startAngle = -Math.PI / 2 - 0.6
  const endAngle = Math.PI / 2 + 0.6

  const backgroundArc = arc()
    .innerRadius(0.85)
    .outerRadius(1)
    .startAngle(startAngle)
    .endAngle(endAngle)
    .cornerRadius(1)()

  const percentScale = scaleLinear().domain([min, max]).range([0, 1])
  const percent = percentScale(value)

  const angleScale = scaleLinear().domain([0, 1]).range([startAngle, endAngle]).clamp(true)

  const angle = angleScale(percent)

  const filledArc = arc()
    .innerRadius(0.85)
    .outerRadius(1)
    .startAngle(startAngle)
    .endAngle(angle)
    .cornerRadius(1)()

  const colorScale = scaleLinear().domain([0, 1]).range(['#EF2751', '#6CE988'])

  const gradientSteps = colorScale.ticks(10).map((value) => colorScale(value))

  return (
    <div className='text-center'>
      <svg className='mx-auto overflow-visible' width='15em' viewBox={[-1, -1, 2, 1].join(' ')}>
        <defs>
          <linearGradient id='Gauge__gradient' gradientUnits='userSpaceOnUse' x1='-1' x2='1' y2='0'>
            {gradientSteps.map((color, index) => (
              <stop
                key={color}
                stopColor={color}
                offset={`${index / (gradientSteps.length - 1)}`}
              />
            ))}
          </linearGradient>
        </defs>
        <path d={backgroundArc} fill={backgroundFillColor} />
        <path d={filledArc} fill='url(#Gauge__gradient)' />
      </svg>

      <div
        className='relative'
        style={{
          top: '-5.5rem'
        }}
      >
        {label}
      </div>
    </div>
  )
}
