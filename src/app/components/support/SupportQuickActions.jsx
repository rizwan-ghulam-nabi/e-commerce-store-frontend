'use client';

export default function SupportQuickActions({ onContactSupport }) {
  const actions = [
    {
      icon: 'fa-solid fa-truck',
      title: 'Track Order',
      description: 'Check your order status',
      link: '/orders',
      color: 'aurora'
    },
    {
      icon: 'fa-solid fa-rotate-left',
      title: 'Return Item',
      description: 'Start a return request',
      link: '/returns',
      color: 'coral'
    },
    {
      icon: 'fa-solid fa-envelope',
      title: 'Contact Us',
      description: 'Email our support team',
      action: onContactSupport,
      color: 'amethyst'
    },
    {
      icon: 'fa-solid fa-message',
      title: 'Live Chat',
      description: 'Chat with an agent',
      link: '/live-chat',
      color: 'emerald'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {actions.map((action, index) => (
        <div
          key={index}
          onClick={() => {
            if (action.action) {
              action.action();
            } else if (action.link) {
              window.location.href = action.link;
            }
          }}
          className={`bg-gradient-to-br from-${action.color}/10 to-${action.color}/5 rounded-xl p-6 text-center border border-${action.color}/20 hover:scale-105 transition-all cursor-pointer group`}
        >
          <div className={`w-12 h-12 bg-${action.color}/20 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
            <i className={`${action.icon} text-2xl text-${action.color}`}></i>
          </div>
          <h3 className="text-white font-semibold">{action.title}</h3>
          <p className="text-gray-400 text-sm mt-1">{action.description}</p>
        </div>
      ))}
    </div>
  );
}