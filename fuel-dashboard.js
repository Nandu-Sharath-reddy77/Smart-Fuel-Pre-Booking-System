
const API = "http://localhost:3000/slots";
let selectedCompany = "";
let selectedStation = null;

try {
    selectedStation = JSON.parse(localStorage.getItem("selectedStation") || "null");
} catch (error) {
    selectedStation = null;
}

const stationElement = document.getElementById("station");
if (stationElement && selectedStation) {
    stationElement.innerText = selectedStation.name;
}

// SELECT COMPANY
function selectCompany(name) {
    selectedCompany = name;
    document.getElementById("company").innerText = name;
}


// LOAD SLOTS (commented out since no API)
// async function loadSlots() {
//     let res = await fetch(API);
//     let data = await res.json();
//     let options = "<option value=''>Select Slot</option>";
//     data.forEach(slot => {
//         let full = slot.bookedCount >= slot.capacity;
//         options += `
//         <option value="${slot.id}" ${full ? 'disabled' : ''}>
//             ${slot.time} (${full ? 'FULL' : 'Available: ' + (slot.capacity - slot.bookedCount)})
//         </option>`;
//     });
//     document.getElementById("slot").innerHTML = options;
// }
// loadSlots();


// REAL-TIME CALCULATION
let price = document.getElementById("fuelType").value;
let activeInput = null;

document.getElementById("fuelType").addEventListener("change", function () {
    price = this.value;
    clearFields();
});

// Amount → Liters
document.getElementById("amount").addEventListener("input", function () {

    if (activeInput === "liters") return;
    activeInput = "amount";

    let amount = parseFloat(this.value);

    if (isNaN(amount) || amount <= 0) {
        showMsg("Enter valid amount", "red");
        document.getElementById("liters").value = "";
        activeInput = null;
        return;
    }

    let liters = amount / price;
    document.getElementById("liters").value = liters.toFixed(2);

    showMsg(`You get ${liters.toFixed(2)} Liters`, "green");

    activeInput = null;
});

// Liters → Amount
document.getElementById("liters").addEventListener("input", function () {

    if (activeInput === "amount") return;
    activeInput = "liters";

    let liters = parseFloat(this.value);

    if (isNaN(liters) || liters <= 0) {
        showMsg("Enter valid liters", "red");
        document.getElementById("amount").value = "";
        activeInput = null;
        return;
    }

    let amount = liters * price;
    document.getElementById("amount").value = amount.toFixed(2);

    showMsg(`Total ₹${amount.toFixed(2)}`, "green");

    activeInput = null;
});


// BOOKING
async function bookFuel() {

    let slotId = document.getElementById("slot").value;
    let amount = parseFloat(document.getElementById("amount").value);
    let liters = parseFloat(document.getElementById("liters").value);

    if (!selectedCompany) {
        alert("Select a company");
        return;
    }

    if (!selectedStation) {
        alert("Select a fuel station from the owner dashboard first");
        return;
    }

    if (!slotId || isNaN(amount) || amount <= 0 || isNaN(liters) || liters <= 0) {
        alert("Fill all details");
        return;
    }

    let fuelTypeText = document.getElementById("fuelType").selectedOptions[0].text;
    let slotText = document.getElementById("slot").selectedOptions[0].text;
    let booking = {
        id: "BK-" + Date.now(),
        company: selectedCompany,
        slotId,
        amount,
        liters,
        fuelType: fuelTypeText,
        time: new Date().toISOString(),
        status: "upcoming",
        customer: getCurrentUserName(),
        station: selectedStation.name,
        stationAddress: selectedStation.address,
    };

    let bookings = JSON.parse(localStorage.getItem('fuelBookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('fuelBookings', JSON.stringify(bookings));

    alert(
        `Booking confirmed!\n` +
        `🏢 Company: ${selectedCompany}\n` +
        `📍 Station: ${selectedStation.name}\n` +
        `⛽ Fuel: ${fuelTypeText}\n` +
        `💰 Amount: ₹${amount.toFixed(2)}\n` +
        `🛢 Liters: ${liters.toFixed(2)}\n` +
        `⏰ Slot: ${slotText}`
    );

    clearFields();
}


// UTIL
function showMsg(msg, color) {
    let el = document.getElementById("message");
    el.innerText = msg;
    el.style.color = color;
}

function clearFields() {
    document.getElementById("amount").value = "";
    document.getElementById("liters").value = "";
    document.getElementById("slot").value = "";
    document.getElementById("message").innerText = "";
}

// AUTO REFRESH (commented out)
// setInterval(loadSlots, 3000);

        function getCurrentUserName() {
            const loginData = localStorage.getItem('ownerLoginData');
            const registerData = localStorage.getItem('ownerRegisterData');

            if (loginData) {
                const user = JSON.parse(loginData);
                return user.name;
            } else if (registerData) {
                const user = JSON.parse(registerData);
                return user.name;
            }
            return "Guest User";
        }
