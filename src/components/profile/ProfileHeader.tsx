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
      {/* Cover image area with organic green SVG shape */}
      <div className="relative h-[220px] w-full overflow-hidden rounded-b-3xl bg-[#d0f2c8]">
        {user.coverImageUrl ? (
          <img
            src={user.coverImageUrl}
            alt="Cover"
            className="h-full w-full object-cover"
          />
        ) : (
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 800 220"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background organic blobs */}
            <defs>
              <radialGradient id="blob1" cx="30%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#a8e6a0" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#d0f2c8" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="blob2" cx="70%" cy="50%" r="40%">
                <stop offset="0%" stopColor="#7cd67e" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#d0f2c8" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="blob3" cx="50%" cy="80%" r="35%">
                <stop offset="0%" stopColor="#b8e6a8" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#d0f2c8" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Organic wave layers */}
            <path
              d="M0,80 C100,140 200,50 350,110 C500,170 600,40 800,90 L800,220 L0,220 Z"
              fill="#b8e6a8"
              opacity="0.5"
            />
            <path
              d="M0,130 C150,70 280,170 430,100 C580,30 680,140 800,100 L800,220 L0,220 Z"
              fill="#a3d993"
              opacity="0.4"
            />
            <path
              d="M0,160 C120,120 240,190 400,140 C560,90 680,170 800,150 L800,220 L0,220 Z"
              fill="#90cf80"
              opacity="0.3"
            />
            {/* Organic blob shapes */}
            <ellipse cx="180" cy="70" rx="130" ry="65" fill="url(#blob1)" />
            <ellipse cx="580" cy="55" rx="110" ry="55" fill="url(#blob2)" />
            <ellipse cx="400" cy="160" rx="90" ry="45" fill="url(#blob3)" />
            {/* Subtle circles for depth */}
            <circle cx="120" cy="50" r="40" fill="#c2eda0" opacity="0.25" />
            <circle cx="650" cy="80" r="35" fill="#b0e090" opacity="0.2" />
            <circle cx="380" cy="40" r="25" fill="#c8f0b8" opacity="0.3" />
          </svg>
        )}
      </div>

      {/* Avatar - overlapping cover */}
      <div className="flex justify-center -mt-14">
        <div className="rounded-full border-4 border-white shadow-lg">
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
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gfm-green/10 border border-gfm-green/20 px-4 py-1.5 text-sm font-medium text-gfm-dark-green">
            <svg
              className="h-4 w-4 text-gfm-green"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Inspired {user.inspiredCount} people to help
          </span>
        </div>
      )}

      {/* Follower / Following counts */}
      <div className="mt-3 flex items-center justify-center gap-1 text-sm text-gfm-secondary">
        <button className="hover:underline">
          <span className="font-semibold text-gfm-dark">{user.followerCount}</span> followers
        </button>
        <span className="mx-2 text-gfm-border">|</span>
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
