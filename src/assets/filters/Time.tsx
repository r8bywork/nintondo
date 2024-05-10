interface TimeSvgProps {
  activecolor?: string;
  className: string;
}

const TimeSvg = ({ activecolor, className }: TimeSvgProps) => {
  return (
    <div className={className}>
      <svg
        width='20'
        height='20'
        viewBox='5 10 20 21'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g filter={'url(#filter0_d_98_608)'}>
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M24.1984 15.4688C24.1988 16.107 23.9707 16.7243 23.5553 17.2089L22.1708 18.7826C21.3315 19.7794 21.3315 21.2357 22.1708 22.2326L23.525 23.8441C24.1885 24.6363 24.3338 25.7408 23.8978 26.6776C23.4618 27.6145 22.5232 28.2145 21.4898 28.2171H15.6642C14.6295 28.2175 13.6882 27.6185 13.2503 26.6811C12.8124 25.7436 12.9571 24.6373 13.6214 23.8441L14.9908 22.2099C15.8225 21.2216 15.8225 19.7784 14.9908 18.7901L13.6214 17.1559C12.9571 16.3626 12.8124 15.2564 13.2503 14.3189C13.6882 13.3815 14.6295 12.7825 15.6642 12.7829H21.5352C22.2455 12.7829 22.9264 13.0666 23.4264 13.5709C23.9265 14.0753 24.2045 14.7585 24.1984 15.4688ZM16.4964 25.2362H20.703C20.9059 25.2605 21.1048 25.166 21.2139 24.9932C21.3231 24.8204 21.3231 24.6003 21.2139 24.4275C21.1048 24.2547 20.9059 24.1601 20.703 24.1845H16.4964C16.2935 24.1601 16.0947 24.2547 15.9855 24.4275C15.8763 24.6003 15.8763 24.8204 15.9855 24.9932C16.0947 25.166 16.2935 25.2605 16.4964 25.2362Z'
            fill={activecolor || '#4B4B4B'}
          />
        </g>
        <defs>
          <filter
            id='filter0_d_98_608'
            x='0.6'
            y='0.382898'
            width='35.9985'
            height='40.2342'
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
              values='0 0 0 0 0.717647 0 0 0 0 0.356863 0 0 0 0 1 0 0 0 0 0.5 0'
            />
            <feBlend
              mode='normal'
              in2='BackgroundImageFix'
              result='effect1_dropShadow_98_608'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow_98_608'
              result='shape'
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
export default TimeSvg;
