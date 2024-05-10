interface SvgProps {
  width?: string;
  height?: string;
  fill?: string;
  className: string;
}

const TrendingIcon = ({ width = '18', height = '19', className }: SvgProps) => (
  <div className={className}>
    <svg
      width={width}
      height={height}
      viewBox='5 10 25 21'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g filter='url(#filter0_d_98_1173)'>
        <path
          d='M28 22.125L21 27L14 22.125M28 18.875L21 23.75L14 18.875L21 14L28 18.875Z'
          stroke='white'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          shapeRendering='crispEdges'
        />
      </g>
      <defs>
        <filter
          id='filter0_d_98_1173'
          x='0.599909'
          y='0.6'
          width='40.8002'
          height='39.8'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters={'sRGB'}
        >
          <feFlood
            floodOpacity='0'
            result='BackgroundImageFix'
          />
          <feColorMatrix
            in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feOffset />
          <feGaussianBlur stdDeviation='6.2' />
          <feComposite
            in2='hardAlpha'
            operator='out'
          />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0'
          />
          <feBlend
            mode='normal'
            in2='BackgroundImageFix'
            result='effect1_dropShadow_98_1173'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_98_1173'
            result='shape'
          />
        </filter>
      </defs>
    </svg>
  </div>
);

export default TrendingIcon;
