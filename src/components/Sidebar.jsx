import { Plus, MessageSquare, Settings, Sparkles, X, Trash2, LogOut, FileText } from 'lucide-react'

export default function Sidebar({
  isOpen,
  onClose,
  recentChats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  user,
  onLogout,
}) {
  const displayName =
    user?.user_metadata?.name ||
    user?.name ||
    user?.email?.split('@')[0] ||
    'User'
  const userEmail = user?.email || 'authenticated'
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col w-72 bg-neutral-900 border-r border-neutral-800 text-neutral-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header: Logo and Close (on mobile) */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800/80">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block">
                Bujju AI
              </span>
              <span className="text-[11px] text-emerald-400 font-medium block">
                Next-Gen Assistant
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 md:hidden transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            type="button"
            onClick={onNewChat}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-white border border-neutral-700/60 hover:border-emerald-500/50 shadow-xs transition-all duration-200 group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Plus className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">New Chat</span>
            </div>
            <kbd className="hidden group-hover:inline-block text-[10px] text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-700">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Recent Chats Section */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Recent Chats
          </div>

          {recentChats.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-neutral-500">
              No recent conversations yet.
            </div>
          ) : (
            recentChats.map((chat) => {
              const isActive = chat.id === activeChatId
              return (
                <div
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`group relative flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer transition-all duration-150 ${
                    isActive
                      ? 'bg-neutral-800 text-white font-medium border border-neutral-700/70 shadow-xs'
                      : 'text-neutral-300 hover:bg-neutral-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    {chat.file_name ? (
                      <FileText
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-emerald-400'
                            : 'text-emerald-500/70 group-hover:text-emerald-400'
                        }`}
                      />
                    ) : (
                      <MessageSquare
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-emerald-400'
                            : 'text-neutral-500 group-hover:text-neutral-300'
                        }`}
                      />
                    )}
                    <span className="truncate">{chat.title}</span>
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteChat(chat.id)
                    }}
                    title="Delete chat"
                    className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1 rounded-md text-neutral-400 hover:text-rose-400 hover:bg-neutral-700/60 transition-opacity duration-150 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )
            })
          )}
        </div>

        {/* Bottom Section: Settings & User Profile with Logout */}
        <div className="p-3 border-t border-neutral-800/80 space-y-2 bg-neutral-900/90">
          <button
            type="button"
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-colors cursor-pointer"
          >
            <Settings className="h-3.5 w-3.5 text-neutral-400" />
            <span>Settings</span>
          </button>

          {/* User Profile Card */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-800/50 border border-neutral-800">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-600/40 to-teal-500/40 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-300 shrink-0">
                {initial}
              </div>
              <div className="truncate">
                <p className="text-xs font-medium text-white truncate">{displayName}</p>
                <p className="text-[11px] text-neutral-400 truncate" title={userEmail}>
                  {userEmail}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={onLogout}
              title="Sign out"
              aria-label="Sign out"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-700/60 transition-colors shrink-0 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
