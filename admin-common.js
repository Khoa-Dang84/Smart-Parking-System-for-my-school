/* ============================================================
   Smart UTT Parking - Admin Common
   Dùng chung cho các trang admin: dashboard, parking slot, bản đồ bãi xe
============================================================ */

(function () {
    const LOGIN_PAGE = "login_new.html";
    const STUDENT_HOME = "student-home.html";
    const ADMIN_HOME = "admin-dashboard.html";

    function getCurrentUser() {
        const keys = [
            "smart_utt_current_user",
            "currentUser",
            "utt_current_user"
        ];

        for (const key of keys) {
            const raw = localStorage.getItem(key);

            if (!raw) continue;

            try {
                const user = JSON.parse(raw);

                if (user && user.role) {
                    return user;
                }
            } catch (error) {}
        }

        return null;
    }

    function guardAdmin() {
        const user = getCurrentUser();

        if (!user) {
            window.location.href = LOGIN_PAGE;
            return false;
        }

        if (user.role !== "admin") {
            window.location.href = STUDENT_HOME;
            return false;
        }

        return true;
    }

    function logout() {
        const ok = confirm("Bạn có chắc chắn muốn đăng xuất không?");

        if (!ok) return;

        localStorage.removeItem("smart_utt_current_user");
        localStorage.removeItem("smart_utt_auth_token");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("utt_current_user");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userRole");

        window.location.href = LOGIN_PAGE;
    }

    function goToPage(page) {
        if (!page) return;

        window.location.href = page;
    }

    function money(value) {
        return Number(value || 0).toLocaleString("vi-VN") + "đ";
    }

    function formatDateTime(value) {
        if (!value) return "---";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleString("vi-VN");
    }

    function zoneName(zoneKey) {
        const map = {
            student1: "Khu gửi xe 1",
            bike2: "Khu gửi xe 2",
            bike3: "Khu gửi xe 3",
            teacher: "Khu giáo viên/KTX",
            car: "Khu ô tô"
        };

        return map[zoneKey] || zoneKey || "---";
    }

    function statusText(status) {
        if (status === "empty") return "Còn trống";
        if (status === "used") return "Đang có xe máy";
        if (status === "car") return "Đang có ô tô";
        if (status === "warning") return "Cảnh báo";
        if (status === "parking") return "Đang gửi";
        if (status === "outside") return "Chưa gửi";

        return status || "---";
    }

    function statusBadge(status) {
        let className = "badge-empty";

        if (status === "used" || status === "parking") {
            className = "badge-used";
        }

        if (status === "car") {
            className = "badge-car";
        }

        if (status === "warning") {
            className = "badge-warning";
        }

        return `<span class="badge ${className}">${statusText(status)}</span>`;
    }

    function showMsg(id, text, ok = true) {
        const box = document.getElementById(id);

        if (!box) return;

        box.textContent = text || "";
        box.className = "message " + (ok ? "success" : "error");

        if (!text) {
            box.className = "message";
        }
    }

    function showPageMsg(text, ok = true) {
        const box =
            document.getElementById("pageMsg") ||
            document.getElementById("manualMsg") ||
            document.getElementById("activeVehicleMsg");

        if (!box) {
            if (text) alert(text);
            return;
        }

        box.textContent = text || "";
        box.className = "message " + (ok ? "success" : "error");

        if (!text) {
            box.className = "message";
        }
    }

    async function waitSupabaseApi() {
        if (typeof window.getSupabaseClient === "function") return;

        if (typeof window.apiGet === "function" || typeof window.smartUttApiGet === "function") return;

        await new Promise(function (resolve, reject) {
            const old = document.querySelector("script[data-admin-common-api]");

            if (old) {
                old.addEventListener("load", resolve);
                old.addEventListener("error", reject);
                return;
            }

            const script = document.createElement("script");
            script.src = "api.js?v=" + Date.now();
            script.setAttribute("data-admin-common-api", "true");

            script.onload = resolve;
            script.onerror = function () {
                reject(new Error("Không tải được api.js"));
            };

            document.head.appendChild(script);
        });
    }

    async function getAdminSupabaseClient() {
        await waitSupabaseApi();

        if (typeof window.getSupabaseClient === "function") {
            return await window.getSupabaseClient();
        }

        if (typeof getSupabaseClient === "function") {
            return await getSupabaseClient();
        }

        throw new Error("Không tìm thấy kết nối Supabase trong api.js.");
    }

    function normalizePathName() {
        const file = window.location.pathname.split("/").pop();

        return file || "index.html";
    }

    function protectAdminPages() {
        const current = normalizePathName();

        const adminPages = [
            "admin-dashboard.html",
            "parking.html",
            "parking_layout.html"
        ];

        if (!adminPages.includes(current)) return;

        guardAdmin();
    }

    function bindAdminHeaderLinks() {
        document.querySelectorAll("a, button").forEach(function (element) {
            const text = String(element.textContent || "").toLowerCase();

            if (text.includes("đăng xuất")) {
                element.onclick = logout;
            }
        });
    }

    function initAdminCommon() {
        protectAdminPages();
        bindAdminHeaderLinks();

        console.log("✅ admin-common.js đã sẵn sàng.");
    }

    window.getCurrentUser = window.getCurrentUser || getCurrentUser;
    window.guardAdmin = window.guardAdmin || guardAdmin;
    window.logout = window.logout || logout;
    window.goToPage = window.goToPage || goToPage;
    window.money = window.money || money;
    window.formatDateTime = window.formatDateTime || formatDateTime;
    window.zoneName = window.zoneName || zoneName;
    window.statusText = window.statusText || statusText;
    window.statusBadge = window.statusBadge || statusBadge;
    window.showMsg = window.showMsg || showMsg;
    window.showPageMsg = window.showPageMsg || showPageMsg;
    window.getAdminSupabaseClient = window.getAdminSupabaseClient || getAdminSupabaseClient;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAdminCommon);
    } else {
        initAdminCommon();
    }
})();
