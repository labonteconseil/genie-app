export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  isOnline: boolean;
  isFollowing: boolean;
}

export interface Post {
  id: string;
  user: User;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
  timestamp: string;
}

export interface Story {
  id: string;
  user: User;
  imageUrl: string;
  duration: number;
  seen: boolean;
}

export interface Reel {
  id: string;
  user: User;
  thumbnailUrl: string;
  caption: string;
  sound: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
}

export type MessageType = 'text' | 'image' | 'voice' | 'video';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: MessageType;
  timestamp: string;
  read: boolean;
  duration?: number;
  imageUrl?: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  isGroup?: boolean;
  groupName?: string;
  groupAvatar?: string;
}

export const currentUser: User = {
  id: 'me',
  username: 'tom_g',
  displayName: 'Tom G',
  avatar: 'https://i.pravatar.cc/150?img=11',
  bio: '📍 Paris | dev & créateur ✨',
  followers: 1240,
  following: 387,
  posts: 42,
  isOnline: true,
  isFollowing: false,
};

export const mockUsers: User[] = [
  currentUser,
  {
    id: 'u1',
    username: 'sarah_lm',
    displayName: 'Sarah L.',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: '🎨 Designer | 📸 Photography lover',
    followers: 12400,
    following: 890,
    posts: 178,
    isOnline: true,
    isFollowing: true,
  },
  {
    id: 'u2',
    username: 'alex_dev',
    displayName: 'Alex Dev',
    avatar: 'https://i.pravatar.cc/150?img=12',
    bio: '💻 Full-stack | Open source',
    followers: 4200,
    following: 320,
    posts: 89,
    isOnline: false,
    isFollowing: true,
  },
  {
    id: 'u3',
    username: 'marie_photo',
    displayName: 'Marie 📷',
    avatar: 'https://i.pravatar.cc/150?img=9',
    bio: 'Photographe 🌍 | Travel & Lifestyle',
    followers: 28000,
    following: 1200,
    posts: 342,
    isOnline: true,
    isFollowing: true,
  },
  {
    id: 'u4',
    username: 'lucas_fit',
    displayName: 'Lucas Fit',
    avatar: 'https://i.pravatar.cc/150?img=15',
    bio: '💪 Coach sportif | Nutrition',
    followers: 8700,
    following: 450,
    posts: 215,
    isOnline: false,
    isFollowing: false,
  },
  {
    id: 'u5',
    username: 'nina_art',
    displayName: 'Nina Art',
    avatar: 'https://i.pravatar.cc/150?img=20',
    bio: '🎭 Artiste | Illustration & Design',
    followers: 15600,
    following: 780,
    posts: 267,
    isOnline: true,
    isFollowing: true,
  },
  {
    id: 'u6',
    username: 'maxime_lr',
    displayName: 'Maxime LR',
    avatar: 'https://i.pravatar.cc/150?img=33',
    bio: '🎵 Musicien | Producer',
    followers: 34200,
    following: 1100,
    posts: 198,
    isOnline: false,
    isFollowing: true,
  },
  {
    id: 'u7',
    username: 'chloe_travel',
    displayName: 'Chloé ✈️',
    avatar: 'https://i.pravatar.cc/150?img=25',
    bio: '🌍 Digital nomad | 50+ countries',
    followers: 52000,
    following: 2300,
    posts: 892,
    isOnline: true,
    isFollowing: false,
  },
];

export const mockStories: Story[] = [
  { id: 's1', user: mockUsers[1], imageUrl: 'https://picsum.photos/seed/s1/400/700', duration: 5, seen: false },
  { id: 's2', user: mockUsers[2], imageUrl: 'https://picsum.photos/seed/s2/400/700', duration: 5, seen: false },
  { id: 's3', user: mockUsers[3], imageUrl: 'https://picsum.photos/seed/s3/400/700', duration: 5, seen: true },
  { id: 's4', user: mockUsers[4], imageUrl: 'https://picsum.photos/seed/s4/400/700', duration: 5, seen: false },
  { id: 's5', user: mockUsers[5], imageUrl: 'https://picsum.photos/seed/s5/400/700', duration: 5, seen: true },
  { id: 's6', user: mockUsers[6], imageUrl: 'https://picsum.photos/seed/s6/400/700', duration: 5, seen: false },
  { id: 's7', user: mockUsers[7], imageUrl: 'https://picsum.photos/seed/s7/400/700', duration: 5, seen: true },
];

export const mockPosts: Post[] = [
  {
    id: 'p1', user: mockUsers[1],
    imageUrl: 'https://picsum.photos/seed/p1/600/600',
    caption: 'Nouvelle création 🎨 tellement contente du rendu !',
    likes: 1842, comments: 47, isLiked: false, isSaved: false, timestamp: '2 min',
  },
  {
    id: 'p2', user: mockUsers[3],
    imageUrl: 'https://picsum.photos/seed/p2/600/600',
    caption: 'Golden hour à Lisbonne 🌅 rien de tel',
    likes: 5234, comments: 128, isLiked: true, isSaved: true, timestamp: '1h',
  },
  {
    id: 'p3', user: mockUsers[5],
    imageUrl: 'https://picsum.photos/seed/p3/600/600',
    caption: 'New illustration drop 🖤 dispo en print',
    likes: 3102, comments: 89, isLiked: false, isSaved: false, timestamp: '3h',
  },
  {
    id: 'p4', user: mockUsers[7],
    imageUrl: 'https://picsum.photos/seed/p4/600/750',
    caption: 'Bali forever ☀️ #travel #nomad',
    likes: 8491, comments: 203, isLiked: true, isSaved: false, timestamp: '5h',
  },
  {
    id: 'p5', user: mockUsers[2],
    imageUrl: 'https://picsum.photos/seed/p5/600/600',
    caption: 'Side project en cours 👨‍💻 bientôt en open source',
    likes: 672, comments: 31, isLiked: false, isSaved: true, timestamp: '8h',
  },
  {
    id: 'p6', user: mockUsers[4],
    imageUrl: 'https://picsum.photos/seed/p6/600/600',
    caption: 'Séance du matin 💪 5h30 grind never stops',
    likes: 2103, comments: 74, isLiked: false, isSaved: false, timestamp: '12h',
  },
  {
    id: 'p7', user: mockUsers[6],
    imageUrl: 'https://picsum.photos/seed/p7/600/600',
    caption: 'Studio session 🎶 prochain son bientôt…',
    likes: 4530, comments: 112, isLiked: true, isSaved: false, timestamp: 'Hier',
  },
  {
    id: 'p8', user: mockUsers[3],
    imageUrl: 'https://picsum.photos/seed/p8/600/750',
    caption: 'Marrakech 🇲🇦 colors everywhere',
    likes: 6800, comments: 165, isLiked: false, isSaved: true, timestamp: 'Hier',
  },
];

export const mockReels: Reel[] = [
  {
    id: 'r1', user: mockUsers[1],
    thumbnailUrl: 'https://picsum.photos/seed/r1/400/700',
    caption: 'Process vidéo de mon dernier projet 🎨✨',
    sound: 'Original Sound - sarah_lm',
    likes: 12400, comments: 342, shares: 180, isLiked: false,
  },
  {
    id: 'r2', user: mockUsers[7],
    thumbnailUrl: 'https://picsum.photos/seed/r2/400/700',
    caption: 'Top 5 spots à ne pas manquer à Tokyo 🇯🇵',
    sound: 'City Vibes - Lo-fi Mix',
    likes: 28900, comments: 891, shares: 2340, isLiked: true,
  },
  {
    id: 'r3', user: mockUsers[4],
    thumbnailUrl: 'https://picsum.photos/seed/r3/400/700',
    caption: 'Routine matin 5h30 qui change tout 💪',
    sound: 'Motivational Beat',
    likes: 9870, comments: 456, shares: 1200, isLiked: false,
  },
  {
    id: 'r4', user: mockUsers[6],
    thumbnailUrl: 'https://picsum.photos/seed/r4/400/700',
    caption: 'Behind the beat 🎹 comment je compose',
    sound: 'Studio Preview - maxime_lr',
    likes: 15600, comments: 678, shares: 890, isLiked: true,
  },
  {
    id: 'r5', user: mockUsers[5],
    thumbnailUrl: 'https://picsum.photos/seed/r5/400/700',
    caption: 'Speed drawing : portrait en 60 secondes ✏️',
    sound: 'Jazz Coffee - Ambient',
    likes: 21300, comments: 534, shares: 1450, isLiked: false,
  },
  {
    id: 'r6', user: mockUsers[3],
    thumbnailUrl: 'https://picsum.photos/seed/r6/400/700',
    caption: 'Golden hour photography tips 📸',
    sound: 'Sunset Chill',
    likes: 34200, comments: 1200, shares: 4500, isLiked: false,
  },
];

const mkMsg = (
  id: string, convId: string, senderId: string, content: string,
  type: MessageType, time: string, read = true, extra?: Partial<Message>
): Message => ({ id, conversationId: convId, senderId, content, type, timestamp: time, read, ...extra });

export const mockConversations: Conversation[] = [
  {
    id: 'c1',
    participants: [currentUser, mockUsers[1]],
    unreadCount: 2,
    lastMessage: mkMsg('m1_4', 'c1', 'u1', 'T\'as vu mon dernier post ? 😍', 'text', '2 min', false),
  },
  {
    id: 'c2',
    participants: [currentUser, mockUsers[2]],
    unreadCount: 0,
    lastMessage: mkMsg('m2_3', 'c2', 'me', 'Parfait, on se call demain 👍', 'text', '1h'),
  },
  {
    id: 'c3',
    participants: [currentUser, mockUsers[3]],
    unreadCount: 1,
    lastMessage: mkMsg('m3_2', 'c3', 'u3', '', 'image', '3h', false, { imageUrl: 'https://picsum.photos/seed/msg1/300/300' }),
  },
  {
    id: 'c4',
    isGroup: true,
    groupName: 'Crew 🔥',
    groupAvatar: 'https://i.pravatar.cc/150?img=50',
    participants: [currentUser, mockUsers[1], mockUsers[2], mockUsers[5]],
    unreadCount: 5,
    lastMessage: mkMsg('m4_6', 'c4', 'u2', 'On se retrouve où ce soir ?', 'text', '30 min', false),
  },
  {
    id: 'c5',
    participants: [currentUser, mockUsers[4]],
    unreadCount: 0,
    lastMessage: mkMsg('m5_2', 'c5', 'u4', '', 'voice', '6h', true, { duration: 12 }),
  },
  {
    id: 'c6',
    participants: [currentUser, mockUsers[6]],
    unreadCount: 0,
    lastMessage: mkMsg('m6_1', 'c6', 'u6', 'Écoute ça 🎵🔥', 'text', 'Hier'),
  },
];

export const mockMessages: Record<string, Message[]> = {
  c1: [
    mkMsg('m1_1', 'c1', 'me', 'Salut Sarah ! Comment ça va ?', 'text', '10:22'),
    mkMsg('m1_2', 'c1', 'u1', 'Super bien merci ! Et toi ?', 'text', '10:23'),
    mkMsg('m1_3', 'c1', 'me', 'Top ! Je bossais sur un truc sympa', 'text', '10:25'),
    mkMsg('m1_4', 'c1', 'u1', 'T\'as vu mon dernier post ? 😍', 'text', '10:27', false),
    mkMsg('m1_5', 'c1', 'u1', 'Dis-moi ce que t\'en penses !', 'text', '10:27', false),
  ],
  c2: [
    mkMsg('m2_1', 'c2', 'u2', 'Yo, t\'es dispo pour se call ?', 'text', '09:00'),
    mkMsg('m2_2', 'c2', 'me', 'Ouais, demain matin ça te va ?', 'text', '09:15'),
    mkMsg('m2_3', 'c2', 'me', 'Parfait, on se call demain 👍', 'text', '09:16'),
  ],
  c3: [
    mkMsg('m3_1', 'c3', 'u3', 'Regarde ce que j\'ai capturé !', 'text', '08:00'),
    mkMsg('m3_2', 'c3', 'u3', '', 'image', '08:01', false, { imageUrl: 'https://picsum.photos/seed/msg1/300/300' }),
  ],
  c4: [
    mkMsg('m4_1', 'c4', 'u1', 'Les gars on fait quoi ce soir ?', 'text', '18:00'),
    mkMsg('m4_2', 'c4', 'u5', 'Je suis dispo à partir de 20h', 'text', '18:10'),
    mkMsg('m4_3', 'c4', 'me', 'Pareil pour moi 👌', 'text', '18:12'),
    mkMsg('m4_4', 'c4', 'u1', '', 'voice', '18:15', false, { duration: 8 }),
    mkMsg('m4_5', 'c4', 'u5', 'Haha oui bonne idée !', 'text', '18:20', false),
    mkMsg('m4_6', 'c4', 'u2', 'On se retrouve où ce soir ?', 'text', '18:30', false),
  ],
  c5: [
    mkMsg('m5_1', 'c5', 'u4', 'Check ce tuto workout', 'text', '07:00'),
    mkMsg('m5_2', 'c5', 'u4', '', 'voice', '07:01', true, { duration: 12 }),
  ],
  c6: [
    mkMsg('m6_1', 'c6', 'u6', 'Écoute ça 🎵🔥', 'text', 'Hier'),
  ],
};
