/* ============================================================
   Smart UTT Parking - Admin Buttons Fix
   Giữ nguyên giao diện admin, chỉ sửa thao tác nút
============================================================ */

(function () {
    const ROUTES = {
        dashboard: "admin-dashboard.html",
        parkingSlot: "parking.html",
        parkingLayout: "parking_layout.html",
        login: "login_new.html"
    };

    function cleanText(text) {
        return String(text || "")
            .toLowerCase()
            .replace(/\s+/g, " ")
            .replace(/[📊🚗🅿️🚨⚙️📍🗺️]/g, "")
            .trim();
    }

    function getCurrentUser() {
        const keys = ["smart_utt_current_user", "currentUser", "utt_current_user"];

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

    function protectAdmin() {
        const user = getCurrentUser();

        if (!user) {
            window.location.href = ROUTES.login;
            return false;
        }

        if (user.role !== "admin") {
            window.location.href = "student-home.html";
            return false;
        }

        return true;
    }

    function logoutAdmin() {
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

    function switchAdminSection(targetId, button) {
        document.querySelectorAll(".menu-item[data-target]").forEach(function (item) {
            item.classList.remove("active");
        });

        if (button) {
            button.classList.add("active");
        }

        document.querySelectorAll(".page-section").forEach(function (section) {
            section.classList.remove("active");
        });

        const target = document.getElementById(targetId);

        if (target) {
            target.classList.add("active");
        }
    }

    function bindAdminButtons() {
        document.querySelectorAll(".menu-item").forEach(function (button) {
            const text = cleanText(button.innerText || button.textContent || "");
            const target = button.getAttribute("data-target");

            if (target) {
                button.onclick = function () {
                    switchAdminSection(target, button);
                };
                return;
            }

            if (text.includes("parking slot")) {
                button.onclick = function () {
                    window.location.href = ROUTES.parkingSlot;
                };
                return;
            }

            if (text.includes("bản đồ bãi xe")) {
                button.onclick = function () {
                    window.location.href = ROUTES.parkingLayout;
                };
                return;
            }
        });

        const logoutBtn = document.querySelector(".logout-btn");

        if (logoutBtn) {
            logoutBtn.onclick = logoutAdmin;
        }
    }

    function bindSearchEnter() {
        const input = document.getElementById("searchInput");

        if (!input) return;

        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();

                if (typeof window.searchData === "function") {
                    window.searchData();
                }
            }
        });
    }

    function init() {
        if (!location.pathname.includes("admin-dashboard")) return;

        if (!protectAdmin()) return;

        bindAdminButtons();
        bindSearchEnter();

        console.log("✅ Admin Buttons Fix đã kích hoạt.");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
