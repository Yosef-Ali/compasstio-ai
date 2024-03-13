
import { useRouter, usePathname } from 'next/navigation';

import TopNavJournal from './top-nav/top-nav-journal';
import TopNavTask from './top-nav/top-nav-tasks';
import TopNavChatWithAI from './top-nav/top-nav-chat-with-ai';
import TopNavChatWithGroups from './top-nav/top-nav-chat-with-groups';
import TopNavProfile from './top-nav/top-nav-profile';
import TopNavLiveSections from './top-nav/top-nav-livesection';


const TopNav = () => {

  const pathname = usePathname()
  const currentPath = pathname.split('/')[1];

  const renderTopNavComponent = () => {
    switch (currentPath) {
      case 'chat-with-ai':
        return <TopNavChatWithAI />;
      case 'messaging':
        return <TopNavChatWithGroups />;
      case 'journals':
        return <TopNavJournal />;
      case 'tasks':
        return <TopNavTask />;
      case 'live-sessions':
        return <TopNavLiveSections />;
      case 'profile':
        return <TopNavProfile />
      default:
        return null;
    }
  };

  return (
    <div>
      {renderTopNavComponent()}
    </div>
  );
};

export default TopNav;
