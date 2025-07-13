import { Users, Crown } from "lucide-react";

interface PodMember {
  id: string;
  name: string;
  avatar: string;
  isOwner: boolean;
}

interface PodMembersProps {
  members: PodMember[];
}

export default function PodMembers({ members }: PodMembersProps) {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          Members ({members.length})
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-200"
          >
            <span className="text-lg">{member.avatar}</span>
            <span className="text-sm font-medium text-gray-700">
              {member.name}
            </span>
            {member.isOwner && <Crown className="w-3 h-3 text-yellow-500" />}
          </div>
        ))}
      </div>
    </div>
  );
}
