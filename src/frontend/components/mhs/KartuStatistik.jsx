function KartuStatistikItem({ icon, iconBg, iconColor, title, value, subText, subTextColor }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-2 sm:p-3 lg:p-4 card-hover">
            <div className="flex justify-between items-start gap-1 sm:gap-2">
                <div className="min-w-0">
                    <p className="text-gray-500 text-[10px] sm:text-xs lg:text-sm font-medium leading-tight truncate">{title}</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
                    <p className={`text-[8px] sm:text-[10px] lg:text-xs mt-0.5 ${subTextColor} truncate`}>{subText}</p>
                </div>
                <div className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 ${iconBg} rounded-md lg:rounded-xl flex items-center justify-center`}>
                    <i className={`fas ${icon} text-xs sm:text-sm lg:text-xl ${iconColor}`}></i>
                </div>
            </div>
        </div>
    );
}

export default function KartuStatistik({ stats }) {
    const statistikList = [
        {
            id: 1,
            title: 'Total Tiket',
            value: stats.totalTikets,
            subText: 'Semua tiket',
            subTextColor: 'text-gray-400',
            icon: 'fa-ticket-alt',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600'
        },
        {
            id: 2,
            title: 'Tiket Open',
            value: stats.tiketOpen,
            subText: 'Menunggu respon',
            subTextColor: 'text-yellow-500',
            icon: 'fa-clock',
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600'
        },
        {
            id: 3,
            title: 'Dalam Proses',
            value: stats.tiketProgress,
            subText: 'Sedang ditangani',
            subTextColor: 'text-blue-500',
            icon: 'fa-spinner',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600'
        },
        {
            id: 4,
            title: 'Selesai/Ditutup',
            value: stats.tiketSelesai,
            subText: 'Tiket selesai',
            subTextColor: 'text-green-500',
            icon: 'fa-check-circle',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600'
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6">
            {statistikList.map((stat) => (
                <KartuStatistikItem
                    key={stat.id}
                    title={stat.title}
                    value={stat.value}
                    subText={stat.subText}
                    subTextColor={stat.subTextColor}
                    icon={stat.icon}
                    iconBg={stat.iconBg}
                    iconColor={stat.iconColor}
                />
            ))}
        </div>
    );
}