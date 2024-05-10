interface SvgProps {
  width?: string;
  height?: string;
  fill?: string;
  activecolor: string;
  className: string;
}

const RangeSvg = ({
  width = '20',
  height = '20',
  fill = '#4B4B4B',
  activecolor,
  className,
}: SvgProps) => (
  <div className={className}>
    <svg
      width={width}
      height={height}
      // viewBox='0 0 42 39'
      viewBox='10 10 20 21'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g filter='url(#filter0_d_98_636)'>
        <path
          d='M28.782 20.28L25.3357 16.9289C25.1989 16.7928 25.0124 16.7149 24.8169 16.7122C24.6188 16.713 24.4293 16.791 24.2907 16.9289L20.8444 20.28C20.7041 20.4156 20.6251 20.6002 20.6251 20.7928C20.6251 20.9853 20.7041 21.1699 20.8444 21.3056C20.9835 21.4423 21.173 21.5192 21.3706 21.5192C21.5682 21.5192 21.7576 21.4423 21.8968 21.3056L24.0758 19.1822V25.2778C24.0758 25.6767 24.4076 26 24.8169 26C25.2262 26 25.558 25.6767 25.558 25.2778V19.1822L27.7296 21.3056C28.0202 21.5888 28.4914 21.5888 28.782 21.3056C29.0727 21.0224 29.0727 20.5632 28.782 20.28Z'
          // fill='#53DCFF'
          fill={activecolor || fill}
        />
        <path
          d='M21.1556 17.5428C21.0165 17.4061 20.827 17.3291 20.6294 17.3291C20.4318 17.3291 20.2424 17.4061 20.1032 17.5428L17.9317 19.6661V13.7222C17.9317 13.3233 17.5998 13 17.1905 13C16.7812 13 16.4494 13.3233 16.4494 13.7222V19.6661L14.2704 17.5428C13.9798 17.2596 13.5086 17.2596 13.218 17.5428C12.9273 17.826 12.9273 18.2851 13.218 18.5683L16.6643 21.9194C16.9534 22.1995 17.4202 22.1995 17.7093 21.9194L21.1556 18.5683C21.296 18.4327 21.3749 18.2481 21.3749 18.0556C21.3749 17.863 21.296 17.6784 21.1556 17.5428Z'
          // fill='#53DCFF'
          fill={activecolor || fill}
        />
      </g>
      <defs>
        <filter
          id='filter0_d_98_636'
          x='0.6'
          y='0.6'
          width='40.8'
          height='37.8'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
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
            values='0 0 0 0 0.32549 0 0 0 0 0.862745 0 0 0 0 1 0 0 0 1 0'
          />
          <feBlend
            mode='normal'
            in2='BackgroundImageFix'
            result='effect1_dropShadow_98_636'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_98_636'
            result='shape'
          />
        </filter>
      </defs>
    </svg>
  </div>
);

export default RangeSvg;
