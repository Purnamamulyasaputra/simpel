export default function StatsCardsPetugas({ stats }) {
    const cards = [
        {
            title: "Total Tiket",
            value: stats.totalTickets,
            subtitle: "Semua tiket",
            icon: "fas fa-ticket-alt",
            bg: "bg-purple-100",
            text: "text-purple-600",
            subtext: "text-gray-400",
        },
        {
            title: "Tiket Open",
            value: stats.openTickets,
            subtitle: "Menunggu assign",
            icon: "fas fa-clock",
            bg: "bg-yellow-100",
            text: "text-yellow-600",
            subtext: "text-yellow-500",
        },
        {
            title: "Tiket In Progress",
            value: stats.progressTickets,
            subtitle: "Sedang ditangani",
            icon: "fas fa-spinner",
            bg: "bg-blue-100",
            text: "text-blue-600",
            subtext: "text-blue-500",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {cards.map((card, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-4 hover:-translate-y-1 transition" >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-xs font-medium">{card.title}</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">
                                {card.value}
                            </p>
                            <p className={`text-[10px] mt-1 ${card.subtext}`}>{card.subtitle}</p>
                        </div>
                        <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center`} >
                            <i className={`${card.icon} text-xl ${card.text}`}></i>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}