import { FieldComponentProps } from '@/components/InlineTable/InlineTable';

interface TableLinkProps extends FieldComponentProps {}

export const TableLink = ({ item, children }: TableLinkProps) => (
  <a
    href={`/explorer/tx/${item.txid?.value}`}
    className='text-[#53DCFF] hover:underline'
  >
    {children}
  </a>
);
