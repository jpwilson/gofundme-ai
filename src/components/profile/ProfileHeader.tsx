"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { User } from "@/lib/types";

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
}

export function ProfileHeader({ user, isOwnProfile }: ProfileHeaderProps) {
  return (
    <div className="relative">
      {/* Cover image area */}
      <div className="relative h-[200px] w-full overflow-hidden rounded-b-2xl bg-[#d0f2c8]">
        {user.coverImageUrl ? (
          <img
            src={user.coverImageUrl}
            alt="Cover"
            className="h-full w-full object-cover"
          />
        ) : (
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 800 200"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,100 C150,160 300,40 450,120 C600,200 700,60 800,100 L800,200 L0,200 Z"
              fill="#b8e6a8"
              opacity="0.5"
            />
            <path
              d="M0,140 C200,80 350,180 500,120 C650,60 750,150 800,110 L800,200 L0,200 Z"
              fill="#a3d993"
              opacity="0.4"
            />
            <ellipse cx="200" cy="80" rx="120" ry="60" fill="#c2eda0" opacity="0.3" />
            <ellipse cx="600" cy="60" rx="100" ry="50" fill="#b0e090" opacity="0.25" />
          </svg>
        )}
      </div>

      {/* Avatar - overlapping cover */}
      <div className="flex justify-center -mt-12">
        <div className="rounded-full border-4 border-white">
          <Avatar
            src={user.avatarUrl}
            name={user.displayName}
            size="xl"
          />
        </div>
      </div>

      {/* Name */}
      <div className="mt-3 text-center">
        <h1 className="text-2xl font-bold text-gfm-dark">{user.displayName}</h1>
      </div>

      {/* Inspired badge */}
      {user.inspiredCount > 0 && (
        <div className="mt-2 flex justify-center">
          <Badge variant="green" className="px-3 py-1 text-sm">
            <svg
              className="mr-1.5 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
              />
            </svg>
            Inspired {user.inspiredCount} people to help
          </Badge>
        </div>
      )}

      {/* Follower / Following counts */}
      <div className="mt-3 flex items-center justify-center gap-1 text-sm text-gfm-secondary">
        <button className="hover:underline">
          <span className="font-semibold text-gfm-dark">{user.followerCount}</span> followers
        </button>
        <span className="mx-1">|</span>
        <button className="hover:underline">
          <span className="font-semibold text-gfm-dark">{user.followingCount}</span> following
        </button>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {isOwnProfile ? (
          <Button variant="outline" size="md">
            Edit profile
          </Button>
        ) : (
          <>
            <Button variant="primary" size="md">
              Follow
            </Button>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gfm-border text-gfm-secondary hover:bg-gfm-bg transition-colors"
              aria-label="More options"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
