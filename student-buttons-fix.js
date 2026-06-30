/* ============================================================
   Smart UTT Parking - Student Buttons Fix
   Sửa toàn bộ nút sinh viên, giữ nguyên bố cục giao diện
============================================================ */

(function () {
    const ROUTES = {
        home: "student-home.html",
        vehicles: "student-vehicles.html",
        wallet: "student-wallet.html",
        parking: "student-parking.html",
        history: "student-history.html",
        login: "login_new.html"
    };

    function pageName() {
        const path = window.location.pathname;
        return path.substring(path.lastIndexOf("/") + 1) || "index.html";
    }

    function isStudentPage() {
        return pageName().startsWith("student-");
    }

    function cleanText(text) {
        return String(text || "")
            .toLowerCase()
            .replace(/\s+/g, " ")
            .replace(/[🏠🚗🛵🏍️💰🅿️📜📊🚨⚙️📍🗺️✅❌]/g, "")
            .trim();
    }

    function getCurrentUser() {
        const keys = ["smart_utt_current_user", "currentUser", "utt_current_user"];

        for (const key of keys) {
            const raw = localStorage.getItem(key);

            if (!raw) continue;

            try {
                const user = JSON.parse(raw);
                if (user && user.role) return user;
            } catch (error) {}
        }

        return null;
    }

    function logoutStudent() {
        const ok = confirm("Bạn có chắc chắn muốn đăng xuất không?");

        if (!ok) return;

        localStorage.removeItem("smart_utt_current_user");
        localStorage.removeItem("smart_utt_auth_token");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("utt_current_user");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userRole");

        window.location.href = ROUTES.login;
    }

    function goTo(url) {
        if (!url) return;
        window.location.href = url;
    }

    function showLocalMessage(text, ok = true) {
        const ids = [
            "parkingMsg",
            "vehicleMsg",
            "walletMsg",
            "historyMsg",
            "homeMsg",
            "studentMsg"
        ];

        for (const id of ids) {
            const box = document.getElementById(id);

            if (!box) continue;

            box.textContent = text || "";
            box.className = "message " + (ok ? "success" : "error");

            if (!text) {
                box.className = "message";
            }

            return;
        }

        if (text) {
            alert(text);
        }
    }

    async function waitApiReady() {
        if (window.smartUttApiGet || window.apiGet) return;

        await new Promise(function (resolve, reject) {
            const existed = document.querySelector("script[data-student-buttons-api]");

            if (existed) {
                existed.addEventListener("load", resolve);
                existed.addEventListener("error", reject);
                return;
            }

            const script = document.createElement("script");
            script.src = "api.js?v=" + Date.now();
            script.setAttribute("data-student-buttons-api", "true");

            script.onload = resolve;
            script.onerror = function () {
                reject(new Error("Không tải được api.js"));
            };

            document.head.appendChild(script);
        });
    }

    async function callGet(path) {
        await waitApiReady();

        if (window.smartUttApiGet) {
            return await window.smartUttApiGet(path);
        }

        if (window.apiGet) {
            return await window.apiGet(path);
        }

        throw new Error("Không tìm thấy apiGet.");
    }

    async function callPost(path, body = {}) {
        await waitApiReady();

        if (window.smartUttApiPost) {
            return await window.smartUttApiPost(path, body);
        }

        if (window.apiPost) {
            return await window.apiPost(path, body);
        }

        throw new Error("Không tìm thấy apiPost.");
    }

    async function callDelete(path) {
        await waitApiReady();

        if (window.smartUttApiDelete) {
            return await window.smartUttApiDelete(path);
        }

        if (window.apiDelete) {
            return await window.apiDelete(path);
        }

        throw new Error("Không tìm thấy apiDelete.");
    }

    function findInputByNames(names) {
        for (const name of names) {
            const byId = document.getElementById(name);
            if (byId) return byId;

            const byName = document.querySelector(`[name="${name}"]`);
            if (byName) return byName;
        }

        return null;
    }

    function findInputByPlaceholder(keywords) {
        const inputs = Array.from(document.querySelectorAll("input, select, textarea"));

        return inputs.find(function (input) {
            const placeholder = cleanText(input.getAttribute("placeholder") || "");
            const label = cleanText(input.getAttribute("aria-label") || "");

            return keywords.some(function (keyword) {
                return placeholder.includes(keyword) || label.includes(keyword);
            });
        });
    }

    function getInputValue(names, placeholderKeywords, fallback = "") {
        const input =
            findInputByNames(names) ||
            findInputByPlaceholder(placeholderKeywords);

        if (!input) return fallback;

        return String(input.value || "").trim();
    }

    function getSelectedAmount() {
        const amountById =
            findInputByNames(["amount", "topupAmount", "walletAmount", "moneyAmount"]) ||
            document.querySelector("select") ||
            document.querySelector("input[type='number']");

        if (!amountById) return 0;

        const raw = String(amountById.value || "")
            .replace(/[^\d]/g, "");

        return Number(raw || 0);
    }

    function getPaymentMethod() {
        const method =
            findInputByNames(["method", "paymentMethod", "topupMethod"]) ||
            Array.from(document.querySelectorAll("select")).find(function (select) {
                return cleanText(select.innerText).includes("quầy") ||
                       cleanText(select.innerText).includes("chuyển khoản") ||
                       cleanText(select.innerText).includes("momo");
            });

        return method ? String(method.value || method.options?.[method.selectedIndex]?.text || "").trim() : "Nạp tiền";
    }

    async function handleStudentTopup() {
        try {
            const amount = getSelectedAmount();
            const method = getPaymentMethod();

            if (!amount || amount < 10000) {
                showLocalMessage("Số tiền nạp tối thiểu là 10.000đ.", false);
                return;
            }

            const ok = confirm("Xác nhận nạp " + amount.toLocaleString("vi-VN") + "đ vào ví?");

            if (!ok) return;

            showLocalMessage("Đang xử lý nạp tiền...", true);

            const result = await callPost("/api/student/wallet/topup", {
                amount: amount,
                method: method
            });

            if (!result || result.success === false) {
                showLocalMessage(result?.message || "Nạp tiền không thành công.", false);
                return;
            }

            showLocalMessage(result.message || "Nạp tiền thành công.", true);

            setTimeout(function () {
                window.location.reload();
            }, 600);
        } catch (error) {
            console.error(error);
            showLocalMessage(error.message || "Không nạp được tiền.", false);
        }
    }

    async function handleAddVehicle() {
        try {
            const plate = getInputValue(
                ["plate", "licensePlate", "vehiclePlate"],
                ["biển số", "bien so", "mã xe", "ma xe"]
            );

            const vehicleType = getInputValue(
                ["vehicleType", "vehicle_type", "type"],
                ["loại xe", "loai xe"],
                "Xe máy"
            );

            const brand = getInputValue(
                ["brand", "model", "vehicleBrand"],
                ["hãng", "hang", "thương hiệu", "thuong hieu"],
                ""
            );

            const color = getInputValue(
                ["color", "vehicleColor"],
                ["màu", "mau"],
                ""
            );

            if (!plate) {
                showLocalMessage("Vui lòng nhập biển số xe.", false);
                return;
            }

            showLocalMessage("Đang khai báo xe...", true);

            const result = await callPost("/api/student/vehicles", {
                plate: plate,
                vehicle_type: vehicleType || "Xe máy",
                vehicleType: vehicleType || "Xe máy",
                brand: brand,
                color: color
            });

            if (!result || result.success === false) {
                showLocalMessage(result?.message || "Khai báo xe không thành công.", false);
                return;
            }

            showLocalMessage(result.message || "Khai báo xe thành công.", true);

            setTimeout(function () {
                window.location.reload();
            }, 600);
        } catch (error) {
            console.error(error);
            showLocalMessage(error.message || "Không khai báo được xe.", false);
        }
    }

    async function handleCheckin() {
        if (typeof window.checkin === "function") {
            await window.checkin();
            return;
        }

        showLocalMessage("Chức năng gửi xe chưa được tải. Hãy bấm Tải lại dữ liệu.", false);
    }

    async function handleCheckout() {
        if (typeof window.checkout === "function") {
            await window.checkout();
            return;
        }

        showLocalMessage("Chức năng lấy xe chưa được tải. Hãy bấm Tải lại dữ liệu.", false);
    }

    async function handleReload() {
        if (typeof window.reloadAll === "function") {
            await window.reloadAll();
            return;
        }

        if (typeof window.loadData === "function") {
            await window.loadData();
            return;
        }

        if (typeof window.loadVehicles === "function") {
            await window.loadVehicles();
            return;
        }

        window.location.reload();
    }

    function handleExportCSV() {
        if (typeof window.exportCSV === "function") {
            window.exportCSV();
            return;
        }

        if (typeof window.downloadHistoryCSV === "function") {
            window.downloadHistoryCSV();
            return;
        }

        const rows = Array.from(document.querySelectorAll("table tr")).map(function (tr) {
            return Array.from(tr.querySelectorAll("th, td")).map(function (cell) {
                return cell.textContent.trim();
            });
        });

        if (rows.length <= 1) {
            showLocalMessage("Chưa có dữ liệu để xuất CSV.", false);
            return;
        }

        const csv = rows
            .map(function (row) {
                return row.map(function (value) {
                    return '"' + String(value || "").replace(/"/g, '""') + '"';
                }).join(",");
            })
            .join("\n");

        const blob = new Blob(["\uFEFF" + csv], {
            type: "text/csv;charset=utf-8;"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "lich-su-giao-dich.csv";
        link.click();

        URL.revokeObjectURL(url);
    }

    function bindElement(element, handler) {
        if (!element || element.dataset.studentButtonFixed === "1") return;

        element.dataset.studentButtonFixed = "1";
        element.style.cursor = "pointer";

        element.addEventListener(
            "click",
            function (event) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                handler();
            },
            true
        );
    }

    function bindNavigationButtons() {
        const elements = Array.from(document.querySelectorAll("a, button, .card, .nav a"));

        elements.forEach(function (element) {
            const text = cleanText(element.innerText || element.textContent || "");

            if (!text) return;

            if (text.includes("đăng xuất")) {
                bindElement(element, logoutStudent);
                return;
            }

            if (text === "trang chủ" || text.includes("mở trang chủ")) {
                bindElement(element, function () {
                    goTo(ROUTES.home);
                });
                return;
            }

            if (text.includes("xe của tôi") || text.includes("mở xe")) {
                bindElement(element, function () {
                    goTo(ROUTES.vehicles);
                });
                return;
            }

            if (text.includes("ví") || text.includes("nạp tiền") || text.includes("mở ví")) {
                if (pageName() === "student-wallet.html" && (text.includes("xác nhận") || text.includes("nạp tiền"))) {
                    bindElement(element, handleStudentTopup);
                    return;
                }

                bindElement(element, function () {
                    goTo(ROUTES.wallet);
                });
                return;
            }

            if (text === "bãi xe" || text.includes("mở bãi xe")) {
                bindElement(element, function () {
                    goTo(ROUTES.parking);
                });
                return;
            }

            if (text.includes("lịch sử")) {
                bindElement(element, function () {
                    goTo(ROUTES.history);
                });
                return;
            }
        });
    }

    function bindActionButtons() {
        const buttons = Array.from(document.querySelectorAll("button, .btn"));

        buttons.forEach(function (button) {
            const text = cleanText(button.innerText || button.textContent || "");

            if (!text) return;

            if (text.includes("gửi xe") && text.includes("trừ tiền")) {
                bindElement(button, handleCheckin);
                return;
            }

            if (text === "lấy xe" || text.includes("lấy xe")) {
                bindElement(button, handleCheckout);
                return;
            }

            if (text.includes("tải lại dữ liệu") || text.includes("làm mới")) {
                bindElement(button, handleReload);
                return;
            }

            if (text.includes("khai báo xe")) {
                if (pageName() === "student-vehicles.html") {
                    bindElement(button, handleAddVehicle);
                } else {
                    bindElement(button, function () {
                        goTo(ROUTES.vehicles);
                    });
                }
                return;
            }

            if (text.includes("xác nhận nạp") || text.includes("nạp tiền ngay")) {
                bindElement(button, handleStudentTopup);
                return;
            }

            if (text.includes("xuất csv") || text.includes("xuất file")) {
                bindElement(button, handleExportCSV);
                return;
            }
        });
    }

    function protectStudentPages() {
        if (!isStudentPage()) return;

        const user = getCurrentUser();

        if (!user) {
            window.location.href = ROUTES.login;
            return;
        }

        if (user.role !== "student") {
            window.location.href = "admin-dashboard.html";
        }
    }

    function markActiveSidebar() {
        const current = pageName();

        document.querySelectorAll(".nav a, .sidebar a").forEach(function (a) {
            const href = a.getAttribute("href") || "";

            if (href === current) {
                a.classList.add("active");
            } else if (href.startsWith("student-")) {
                a.classList.remove("active");
            }
        });
    }

    function init() {
        if (!isStudentPage()) return;

        protectStudentPages();
        bindNavigationButtons();
        bindActionButtons();
        markActiveSidebar();

        console.log("✅ Student Buttons Fix đã kích hoạt.");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
