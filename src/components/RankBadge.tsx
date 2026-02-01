import { cn } from "@/lib/utils";
import { Crown, Medal, Award } from "lucide-react";

interface RankBadgeProps {
  rank: number;
  size?: "sm" | "md" | "lg";
}

const RankBadge = ({ rank, size = "md" }: RankBadgeProps) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-16 h-16 text-2xl",
  };

  const iconSizes = {
    sm: 14,
    md: 20,
    lg: 28,
  };

  if (rank === 1) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-display font-bold shadow-lg",
          "bg-gradient-to-br from-yellow-400 to-amber-500 text-white",
          sizeClasses[size]
        )}
      >
        <Crown size={iconSizes[size]} />
      </div>
    );
  }

  if (rank === 2) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-display font-bold shadow-md",
          "bg-gradient-to-br from-gray-300 to-gray-400 text-white",
          sizeClasses[size]
        )}
      >
        <Medal size={iconSizes[size]} />
      </div>
    );
  }

  if (rank === 3) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-display font-bold shadow-md",
          "bg-gradient-to-br from-amber-600 to-amber-700 text-white",
          sizeClasses[size]
        )}
      >
        <Award size={iconSizes[size]} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-semibold",
        "bg-secondary text-muted-foreground",
        sizeClasses[size]
      )}
    >
      {rank}
    </div>
  );
};

export default RankBadge;
