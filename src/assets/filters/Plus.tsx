interface SvgProps {
  width?: string;
  height?: string;
  fill?: string;
  activecolor: string;
  className: string;
}

const MySVGIcon = ({
  width = '18',
  height = '19',
  fill = '#4B4B4B',
  activecolor,
  className,
}: SvgProps) => (
  <div className={className}>
    <svg
      width={width}
      height={height}
      viewBox='0 0 18 19'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M8.496 0.5H9.504C14.1962 0.5 18 4.30379 18 8.996V10.004C18 14.6962 14.1962 18.5 9.504 18.5H8.496C3.80379 18.5 0 14.6962 0 10.004V8.996C0 4.30379 3.80379 0.5 8.496 0.5ZM9.675 10.175H12.6C12.9728 10.175 13.275 9.87279 13.275 9.5C13.275 9.12721 12.9728 8.825 12.6 8.825H9.675V5.9C9.675 5.52721 9.37279 5.225 9 5.225C8.62721 5.225 8.325 5.52721 8.325 5.9V8.825H5.4C5.02721 8.825 4.725 9.12721 4.725 9.5C4.725 9.87279 5.02721 10.175 5.4 10.175H8.325V13.1C8.325 13.4728 8.62721 13.775 9 13.775C9.37279 13.775 9.675 13.4728 9.675 13.1V10.175Z'
        fill={activecolor || fill}
      />
    </svg>
  </div>
);

export default MySVGIcon;
