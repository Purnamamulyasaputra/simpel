import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatsCardsPetugas from "./StatsCardsPetugas";
import TableTiketPetugas from "./TableTiketPetugas";
import ConfirmModal from "./ConfirmModal";
import NotificationToast from "./NotificationToast";
import LoadingOverlay from "./LoadingOverlay";
import HeaderPetugas from "./HeaderPetugas";
import DetailPercakapanPetugas from "./DetailPercakapanPetugas.jsx";
import { useLocalStorage } from "react-use";
import { petugasAssignTiket, petugasGetMessage, petugasGetTiket, petugasReplyTiket, petugasResolveTiket } from '../../lib/scripts/petugas/api.js';
import { alertError } from "../../lib/scripts/alert.js";

export default function LayoutPetugas() {
    const navigate = useNavigate();
    const [token, _] = useLocalStorage('token', '');
    const [role, __] = useLocalStorage('role', '');
    const [loading, setLoading] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [ticketsData, setTicketsData] = useState([]);
    const [message, setMessage] = useState([]);

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const [confirmState, setConfirmState] = useState({
        open: false,
        title: "Konfirmasi",
        message: "Apakah Anda yakin?",
        onConfirm: null,
    });

    const [currentPetugas] = useState({
        id: 1,
        username: "Petugas1",
        fullName: "Petugas",
        role: "Petugas HelpDesk",
    });

    async function fetchAllTiket() {
        setLoading(true);
        try {
            const response = await petugasGetTiket(token);
            const responseBody = await response.json();
            console.log(responseBody);

            if (response.ok) {
                setTicketsData(responseBody.data);
            } else {
                await alertError(responseBody.errors);
            }
        } catch (err) {
            console.error("Error fetch tiket:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (token && role === "PETUGAS") fetchAllTiket();
    }, [token, role])

    async function fetchMessages(ticketId) {
        try {
            const response = await petugasGetMessage(token, ticketId);
            const responseBody = await response.json();
            console.log("Response dari Message: ", responseBody)

            if (response.ok) {
                setMessage(responseBody.data);
            } else {
                await alertError("Error mengambil pesan");
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }

    useEffect(() => {
        if (selectedTicketId) fetchMessages(selectedTicketId)
    }, [selectedTicketId])

    const selectedTicket = useMemo(() => {
        return ticketsData.find((t) => t.id === selectedTicketId) || null;
    }, [ticketsData, selectedTicketId]);

    function removeStorage() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
    }

    useEffect(() => {
        if (!token || role !== "PETUGAS") {
            removeStorage();
            navigate("/login?role=petugas", { replace: true });
        }
    }, [token, role, navigate]);

    const stats = useMemo(() => ({
        totalTickets: ticketsData.length,
        openTickets: ticketsData.filter((t) => t.status === "OPEN").length,
        progressTickets: ticketsData.filter((t) => t.status === "IN_PROGRESS").length,
    }), [ticketsData]);

    function showToast(message, type = "success") {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast((prev) => ({ ...prev, show: false }));
        }, 3000);
    }

    function updateTicket(ticketId, updateFn) {
        setTicketsData((prev) =>
            prev.map((t) => (t.id === ticketId ? updateFn(t) : t))
        );
    }

    function assignTicket(ticketId) {
        setConfirmState({
            open: true,
            title: "Assign Tiket",
            message: `Apakah Anda ingin mengambil tiket #${ticketId}?`,
            onConfirm: async () => {
                setLoading(true);
                setTimeout(async () => {
                    try {
                        const response = await petugasAssignTiket(token, ticketId);
                        const data = await response.json();
                        if (response.ok) {
                            setTicketsData((prev) =>
                                prev.map((t) => t.id === ticketId ? {
                                    ...t,
                                    status: "IN_PROGRESS",
                                    staffId: currentPetugas.id
                                } : t
                                )
                            );
                        } else alertError(data.errors);

                    } catch (err) {
                        console.error(err);

                    } finally {
                        setLoading(false);
                        setConfirmState((prev) => ({ ...prev, open: false }));
                    }
                }, 1000);
            },
        });
    }

    function resolveTicket(ticketId) {
        setConfirmState({
            open: true,
            title: "Resolve Tiket",
            message: `Apakah yakin ingin menyelesaikan tiket #${ticketId}?`,
            onConfirm: async () => {
                setLoading(true);
                setTimeout(async () => {
                    try {
                        const response = await petugasResolveTiket(token, ticketId);
                        const data = await response.json();
                        if (response.ok) {
                            updateTicket(ticketId, t => ({ ...t, status: "RESOLVED" }));
                            showToast(`Tiket #${ticketId} berhasil di-resolve`);
                        } else alertError(data.errors);
                    } catch (err) {
                        console.error(err); alertError("Gagal resolve tiket");
                    } finally {
                        setLoading(false);
                        setConfirmState(prev => ({
                            ...prev,
                            open: false
                        }));
                    }
                }, 1000);
            }
        });
    }

    function sendReply(ticketId, message) {
        if (!message.trim()) return showToast("Pesan tidak boleh kosong", "error");
        setLoading(true);
        setTimeout(async () => {
            petugasReplyTiket(token, ticketId, message)
                .then(async res => {
                    const data = await res.json();
                    if (res.ok) {
                        updateTicket(ticketId, t => (
                            {
                                ...t,
                                replies: [
                                    ...(t.replies || []),
                                    {
                                        id: Date.now(),
                                        from: "petugas",
                                        sender: currentPetugas.fullName,
                                        message,
                                        createdAt: new Date().toISOString()
                                    }
                                ]
                            }
                        )
                        );
                        fetchMessages(ticketId)
                        showToast("Balasan berhasil dikirim");
                    } else alertError(data.errors);
                }).catch(err => {
                    console.error(err);
                }).finally(() => setLoading(false));
        }, 1000);
    }

    function handleLogout() {
        removeStorage();
        navigate("/login?role=petugas", { replace: true });
    }

    return (
        <div className="min-h-screen bg-gray-100 font-sans antialiased">
            <HeaderPetugas currentPetugas={currentPetugas} notificationCount={stats.openTickets} onLogout={handleLogout} />

            <div className="p-4 lg:p-5">
                <StatsCardsPetugas stats={stats} />

                <div className="grid lg:grid-cols-2 gap-3">
                    <TableTiketPetugas
                        tickets={ticketsData}
                        currentPetugas={currentPetugas}
                        selectedTicketId={selectedTicketId}
                        onSelectTicket={setSelectedTicketId}
                        onAssignTicket={assignTicket}
                        onResolveTicket={resolveTicket}
                    />

                    <DetailPercakapanPetugas
                        ticket={selectedTicket}
                        message={message}
                        currentPetugas={currentPetugas}
                        onSendReply={sendReply}
                    />
                </div>
            </div>

            <ConfirmModal
                open={confirmState.open}
                title={confirmState.title}
                message={confirmState.message}
                onCancel={() =>
                    setConfirmState((prev) => ({ ...prev, open: false }))
                }
                onConfirm={confirmState.onConfirm}
            />

            <NotificationToast show={toast.show} message={toast.message} type={toast.type} />
            <LoadingOverlay show={loading} />
        </div>
    );
}