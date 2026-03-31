import { Heart, Star, X } from 'lucide-react';

import { IconButton } from '@/components/atoms/IconButton';

interface SwipeActionBarProps {
  disabled?: boolean;
  onReject: () => void;
  onLike: () => void;
  onSuperLike: () => void;
}

export function SwipeActionBar(props: SwipeActionBarProps) {
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6">
      <IconButton
        label="Dislike"
        tone="danger"
        className="h-[52px] w-[52px] sm:h-[58px] sm:w-[58px]"
        disabled={props.disabled}
        onClick={props.onReject}
      >
        <X size={28} strokeWidth={4.5} />
      </IconButton>
      <IconButton
        label="Star"
        tone="star"
        className="h-[42px] w-[42px] sm:h-[46px] sm:w-[46px]"
        disabled={props.disabled}
        onClick={props.onSuperLike}
      >
        <Star size={22} fill="currentColor" />
      </IconButton>
      <IconButton
        label="Love"
        tone="love"
        className="h-[52px] w-[52px] sm:h-[58px] sm:w-[58px]"
        disabled={props.disabled}
        onClick={props.onLike}
      >
        <Heart size={28} fill="currentColor" />
      </IconButton>
    </div>
  );
}
