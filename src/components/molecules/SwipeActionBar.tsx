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
    <div className="flex items-center justify-center gap-6">
      <IconButton
        label="Dislike"
        tone="danger"
        className="h-[58px] w-[58px]"
        disabled={props.disabled}
        onClick={props.onReject}
      >
        <X size={30} strokeWidth={4.5} />
      </IconButton>
      <IconButton
        label="Star"
        tone="star"
        className="h-[46px] w-[46px]"
        disabled={props.disabled}
        onClick={props.onSuperLike}
      >
        <Star size={24} fill="currentColor" />
      </IconButton>
      <IconButton
        label="Love"
        tone="love"
        className="h-[58px] w-[58px]"
        disabled={props.disabled}
        onClick={props.onLike}
      >
        <Heart size={30} fill="currentColor" />
      </IconButton>
    </div>
  );
}
