interface InfoBlockProps {
  title?: string;
  classNames?: string;
  hash?: string;
}
import cn from 'classnames';
const InfoBlock = ({ title, classNames, hash }: InfoBlockProps) => {
  return (
    <div className={cn(classNames, '')}>
      <p>
        {title}
        {hash}
      </p>
    </div>
  );
};

export default InfoBlock;
