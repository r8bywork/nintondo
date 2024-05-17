import { ItemField } from '@/components/InlineTable/InlineTable';
import { useFavorites } from '@/hooks/favorites';
import Star from '@/assets/star.svg?react';
import FilledStar from '@/assets/filled-star.svg?react';
import type { MouseEvent } from 'react';
interface FavoriteProps {
  item: ItemField;
  group: string;
}

export const Favorite = ({ item, group }: FavoriteProps) => {
  const { favorites, addToFavorite, removeFromFavorite } = useFavorites();

  const onStarClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (favorites[group]?.includes(`${item.tick?.value}`)) {
      removeFromFavorite(group, `${item.tick?.value}`);
    } else {
      addToFavorite(group, `${item.tick?.value}`);
    }
  };

  return (
    <div className='flex items-center gap-[10px]'>
      <button
        onClick={onStarClick}
        className='w-[16px] h-[16px] flex'
      >
        {favorites[group]?.includes(`${item.tick?.value}`) ? (
          <FilledStar className='w-[16px] h-[15px]' />
        ) : (
          <Star className='w-[16px] h-[15px]' />
        )}
      </button>
      <div className='text-[#4b4b4b]'>{item.num?.value}</div>
    </div>
  );
};

// ONLY FOR USAGE IN TABLE!!!
export const createFavoriteWithGroup = (group: string) => {
  return function FavoriteWithGroup(props: Omit<FavoriteProps, 'group'>) {
    return (
      <Favorite
        {...props}
        group={group}
      />
    );
  };
};
