const BOOKINGS_API = "http://localhost:4000/bookings";
let bookings = [];

const statusClasses = {
    upcoming: "bg-info text-white",
    completed: "bg-success text-white",
    cancelled: "bg-danger text-white"
};

function getSampleBookings() {
    return [
        {
            id: "BK-1001",
            customer: "Ramesh Kumar",
            fuelType: "Petrol",
            liters: 20,
            amount: 2200,
            slot: "09:00 - 09:30",
            station: "Station A",
            status: "upcoming",
            time: "2026-05-08T09:00:00"
        },
        {
            id: "BK-1002",
            customer: "Priya Singh",
            fuelType: "Diesel",
            liters: 25,
            amount: 2475,
            slot: "10:30 - 11:00",
            station: "Station B",
            status: "completed",
            time: "2026-05-07T10:30:00"
        },
        {
            id: "BK-1003",
            customer: "Anil Sharma",
            fuelType: "Petrol",
            liters: 15,
            amount: 1650,
            slot: "14:00 - 14:30",
            station: "Station A",
            status: "upcoming",
            time: "2026-05-09T14:00:00"
        }
    ];
}

function formatAmount(amount) {
    return `₹${amount.toLocaleString()}`;
}

function buildStatusBadge(status) {
    const badgeClass = statusClasses[status] || "bg-secondary text-white";
    return `<span class="badge badge-status ${badgeClass}">${status}</span>`;
}

function renderBookingRows(filteredBookings) {
    const tbody = document.getElementById("bookingTableBody");

    if (!filteredBookings.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted py-5">No bookings found for the selected filters.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredBookings.map(booking => {
        return `
            <tr>
                <td>${booking.id}</td>
                <td>${booking.customer}</td>
                <td>${booking.fuelType}</td>
                <td>${booking.liters} L</td>
                <td>${formatAmount(booking.amount)}</td>
                <td>${booking.slot}</td>
                <td>${booking.station}</td>
                <td>${buildStatusBadge(booking.status)}</td>
            </tr>
        `;
    }).join("");
}

function updateSummary(filteredBookings) {
    const total = filteredBookings.length;
    const liters = filteredBookings.reduce((sum, booking) => sum + Number(booking.liters || 0), 0);
    const amount = filteredBookings.reduce((sum, booking) => sum + Number(booking.amount || 0), 0);
    const pending = filteredBookings.filter(booking => booking.status === "upcoming").length;

    document.getElementById("summaryTotal").innerText = total;
    document.getElementById("summaryLiters").innerText = `${liters} L`;
    document.getElementById("summaryAmount").innerText = formatAmount(amount);
    document.getElementById("summaryPending").innerText = pending;
}

function getFilteredBookings() {
    const fuelType = document.getElementById("filterFuel").value;
    const status = document.getElementById("filterStatus").value;
    const search = document.getElementById("filterSearch").value.trim().toLowerCase();

    return bookings.filter(booking => {
        const matchFuel = fuelType === "all" || booking.fuelType.toLowerCase() === fuelType.toLowerCase();
        const matchStatus = status === "all" || booking.status.toLowerCase() === status.toLowerCase();
        const matchSearch = !search || booking.id.toLowerCase().includes(search) || booking.customer.toLowerCase().includes(search);
        return matchFuel && matchStatus && matchSearch;
    });
}

function applyFilters() {
    const filtered = getFilteredBookings();
    renderBookingRows(filtered);
    updateSummary(filtered);
}

async function loadBookings() {
    try {
        const response = await fetch(BOOKINGS_API);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        bookings = await response.json();
    } catch (error) {
        console.warn("Booking API unavailable, loading from localStorage.", error);
        bookings = JSON.parse(localStorage.getItem("fuelBookings") || "[]");
        if (!bookings.length) {
            bookings = getSampleBookings();
        }
    }

    if (!Array.isArray(bookings)) {
        bookings = getSampleBookings();
    }

    bookings.sort((a, b) => new Date(a.time) - new Date(b.time));
    applyFilters();
}

function bindFilterEvents() {
    document.getElementById("filterFuel").addEventListener("change", applyFilters);
    document.getElementById("filterStatus").addEventListener("change", applyFilters);
    document.getElementById("filterSearch").addEventListener("input", applyFilters);
}

window.addEventListener("DOMContentLoaded", () => {
    bindFilterEvents();
    loadBookings();
});
