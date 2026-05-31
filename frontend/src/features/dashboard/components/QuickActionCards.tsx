interface QuickActionCard {
  title: string;
  image: string;
  link: string;
}

export function QuickActionCards() {
  const cards: QuickActionCard[] = [
    {
      title: 'Investments',
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop',
      link: '/investments',
    },
    {
      title: 'Your finances',
      image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400&h=300&fit=crop',
      link: '/finances',
    },
    {
      title: 'Piggy bank',
      image: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=400&h=300&fit=crop',
      link: '/savings',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4">
      {cards.map((card, index) => (
        <a
          key={index}
          href={card.link}
          className="relative h-28 rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url(${card.image})`,
            }}
          />

          {/* Content */}
          <div className="relative h-full flex items-end p-4">
            <h3 className="text-white font-semibold text-base">
              {card.title}
            </h3>
          </div>
        </a>
      ))}
    </div>
  );
}
