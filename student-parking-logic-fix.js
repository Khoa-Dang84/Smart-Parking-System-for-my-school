/* ============================================================
   Smart UTT Parking - student-parking-logic-fix.js
   Chỉ sửa logic gửi xe/lấy xe, KHÔNG thêm giao diện mới.
   Giữ nguyên bố cục student-parking.html hiện tại.
============================================================ */

(function () {
  let zones = [];
  let vehicles = [];
  let activeParking = [];

  function getUser() {
    const keys = ["smart_utt_current_user", "currentUser", "utt_current_user"];

    for (const key of keys) {
      const raw = localStorage.getItem(key);

      if (!raw) continue;

      try {
        const user = JSON.parse(raw);
        if (user && user.role === "student") return user;
      } catch (error) {}
    }

    return null;
  }

  function money(value) {
    return Number(value || 0).toLocaleString("vi-VN") + "đ";
  }

  function formatDateTime(value) {
    if (!value) return "---";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString("vi-VN");
  }

  function statusText(status) {
    if (status === "parking") return "Đang gửi";
    if (status === "outside") return "Chưa gửi";
    if (status === "empty") return "Còn trống";
    if (status === "used") return "Đang có xe";
    if (status === "car") return "Đang có ô tô";
    if (status === "warning") return "Cảnh báo";

    return status || "---";
  }

  function statusBadge(status) {
    let bg = "#dbeafe";
    let color = "#1e40af";

    if (status === "parking" || status === "used") {
      bg = "#dcfce7";
      color = "#166534";
    }

    if (status === "car") {
      bg = "#fef3c7";
      color = "#92400e";
    }

    if (status === "warning") {
      bg = "#fee2e2";
      color = "#991b1b";
    }

    return (
      '<span style="display:inline-block;padding:6px 10px;border-radius:999px;background:' +
      bg +
      ";color:" +
      color +
      ';font-weight:900;">' +
      statusText(status) +
      "</span>"
    );
  }

  function showMessage(text, ok = true) {
    const box = document.getElementById("parkingMsg");

    if (!box) return;

    box.textContent = text || "";
    box.className = "message " + (ok ? "success" : "error");

    if (!text) {
      box.className = "message";
    }
  }

  function clearMessage() {
    showMessage("");
  }

  function hideOldErrors() {
    const all = Array.from(document.querySelectorAll("body *"));

    all.forEach(function (element) {
      const text = element.textContent || "";

      if (
        text.includes("Backend trả về HTML") ||
        text.includes("/api/student/parking") ||
        text.includes("/api/student/wallet") ||
        text.includes("/api/student/vehicles")
      ) {
        element.style.display = "none";
      }
    });
  }

  function ensureApi() {
    return new Promise(function (resolve, reject) {
      if (window.smartUttApiGet && window.smartUttApiPost) {
        resolve();
        return;
      }

      if (window.apiGet && window.apiPost) {
        resolve();
        return;
      }

      const existed = document.querySelector("script[data-student-parking-logic-api]");

      if (existed) {
        existed.addEventListener("load", resolve);
        existed.addEventListener("error", reject);
        return;
      }

      const script = document.createElement("script");
      script.src = "api.js?v=" + Date.now();
      script.setAttribute("data-student-parking-logic-api", "true");

      script.onload = function () {
        resolve();
      };

      script.onerror = function () {
        reject(new Error("Không tải được api.js."));
      };

      document.head.appendChild(script);
    });
  }

  async function callGet(path) {
    await ensureApi();

    if (window.smartUttApiGet) {
      return await window.smartUttApiGet(path);
    }

    if (window.apiGet) {
      return await window.apiGet(path);
    }

    throw new Error("Không tìm thấy hàm apiGet.");
  }

  async function callPost(path, body) {
    await ensureApi();

    if (window.smartUttApiPost) {
      return await window.smartUttApiPost(path, body);
    }

    if (window.apiPost) {
      return await window.apiPost(path, body);
    }

    throw new Error("Không tìm thấy hàm apiPost.");
  }

  function getSelectedVehicle() {
    const select = document.getElementById("vehicleSelect");

    if (!select) return null;

    const plate = select.value;

    return vehicles.find(function (vehicle) {
      return vehicle.plate === plate;
    });
  }

  function renderVehicleSelect() {
    const vehicleSelect = document.getElementById("vehicleSelect");

    if (!vehicleSelect) return;

    if (!vehicles || vehicles.length === 0) {
      vehicleSelect.innerHTML = '<option value="">Bạn chưa khai báo xe</option>';
      return;
    }

    vehicleSelect.innerHTML = vehicles
      .map(function (vehicle) {
        const type = vehicle.vehicleType || vehicle.vehicle_type || "Xe";
        const parkingText = vehicle.status === "parking" || vehicle.isParking ? " - đang gửi" : " - chưa gửi";

        return (
          '<option value="' +
          vehicle.plate +
          '">' +
          vehicle.plate +
          " · " +
          type +
          parkingText +
          "</option>"
        );
      })
      .join("");
  }

  function renderZoneSelect() {
    const zoneSelect = document.getElementById("zoneKey");

    if (!zoneSelect) return;

    const vehicle = getSelectedVehicle();

    if (!zones || zones.length === 0) {
      zoneSelect.innerHTML = '<option value="">Chưa có dữ liệu khu gửi xe</option>';
      return;
    }

    if (vehicle && (vehicle.status === "parking" || vehicle.isParking)) {
      zoneSelect.innerHTML = '<option value="">Xe này đang gửi trong bãi</option>';
      return;
    }

    let filteredZones = zones;

    const vehicleType = vehicle ? vehicle.vehicleType || vehicle.vehicle_type : "";

    if (vehicleType === "Ô tô") {
      filteredZones = zones.filter(function (zone) {
        const key = zone.zoneKey || zone.zone_key || zone.id;
        return key === "car";
      });
    } else if (vehicle) {
      filteredZones = zones.filter(function (zone) {
        const key = zone.zoneKey || zone.zone_key || zone.id;
        return key !== "car";
      });
    }

    filteredZones = filteredZones.filter(function (zone) {
      const empty = Number(zone.emptySlots || zone.empty_slots || zone.availableSlots || 0);
      return empty > 0;
    });

    if (filteredZones.length === 0) {
      zoneSelect.innerHTML = '<option value="">Không có khu phù hợp hoặc đã hết chỗ</option>';
      return;
    }

    zoneSelect.innerHTML = filteredZones
      .map(function (zone) {
        const zoneKey = zone.zoneKey || zone.zone_key || zone.id;
        const zoneName = zone.zoneName || zone.zone_name || zone.name || zoneKey;
        const empty = zone.emptySlots || zone.empty_slots || zone.availableSlots || 0;

        return '<option value="' + zoneKey + '">' + zoneName + " - còn " + empty + " chỗ</option>";
      })
      .join("");
  }

  function renderZones() {
    const grid = document.getElementById("zoneGrid");

    if (!grid) return;

    if (!zones || zones.length === 0) {
      grid.innerHTML = `
        <div class="zone-card">
          <h3>Chưa có dữ liệu khu gửi xe</h3>
        </div>
      `;
      return;
    }

    grid.innerHTML = zones
      .map(function (zone) {
        const name = zone.zoneName || zone.zone_name || zone.name || "---";
        const type = zone.vehicleType || zone.vehicle_type || "---";
        const total = Number(zone.totalSlots || zone.total_slots || 0);
        const empty = Number(zone.emptySlots || zone.empty_slots || zone.availableSlots || 0);
        const used = Number(zone.usedSlots || zone.used_slots || zone.occupiedSlots || 0);
        const density = total > 0 ? Math.round((used / total) * 100) : 0;

        return `
          <div class="zone-card">
            <h3>${name}</h3>
            <p>Loại xe: <strong>${type}</strong></p>
            <p>Tổng ô: <strong>${total}</strong></p>
            <p>Còn trống: <strong>${empty}</strong></p>
            <p>Đang có xe: <strong>${used}</strong></p>
            <p style="margin-top:14px;">Mật độ sử dụng: <strong>${density}%</strong></p>
          </div>
        `;
      })
      .join("");
  }

  function renderActiveTable() {
    const table = document.getElementById("activeTable");

    if (!table) return;

    activeParking = vehicles.filter(function (vehicle) {
      return vehicle.status === "parking" || vehicle.isParking;
    });

    if (!activeParking || activeParking.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="6">Hiện bạn chưa có xe nào đang gửi trong bãi.</td>
        </tr>
      `;
      return;
    }

    table.innerHTML = activeParking
      .map(function (item) {
        return `
          <tr>
            <td><strong>${item.plate || "---"}</strong></td>
            <td>${item.slot_code || item.slotCode || "---"}</td>
            <td>${item.zone_name || item.zoneName || item.zone_id || "---"}</td>
            <td>${item.vehicle_type || item.vehicleType || "---"}</td>
            <td>${statusBadge(item.status || "parking")}</td>
            <td>${formatDateTime(item.updated_at || item.updatedAt)}</td>
          </tr>
        `;
      })
      .join("");
  }

  async function loadWallet() {
    const user = getUser();

    if (!user) {
      throw new Error("Bạn cần đăng nhập sinh viên.");
    }

    const data = await callGet(
      "/api/student/wallet?student_code=" + encodeURIComponent(user.studentCode || user.student_code || user.username)
    );

    const balance = data.balance || data.wallet?.balance || 0;

    const balanceEl = document.getElementById("balance");

    if (balanceEl) {
      balanceEl.textContent = money(balance);
    }
  }

  async function loadVehicles() {
    const data = await callGet("/api/student/vehicles");

    vehicles = data.vehicles || [];
    activeParking = data.activeParking || vehicles.filter(function (vehicle) {
      return vehicle.status === "parking" || vehicle.isParking;
    });
  }

  async function loadZones() {
    const data = await callGet("/api/student/parking/zones");

    zones = data.zones || [];

    const total = zones.reduce(function (sum, zone) {
      return sum + Number(zone.totalSlots || zone.total_slots || 0);
    }, 0);

    const empty = zones.reduce(function (sum, zone) {
      return sum + Number(zone.emptySlots || zone.empty_slots || zone.availableSlots || 0);
    }, 0);

    const used = zones.reduce(function (sum, zone) {
      return sum + Number(zone.usedSlots || zone.used_slots || zone.occupiedSlots || 0);
    }, 0);

    const totalEl = document.getElementById("totalSlots");
    const emptyEl = document.getElementById("emptySlots");
    const usedEl = document.getElementById("usedSlots");

    if (totalEl) totalEl.textContent = total;
    if (emptyEl) emptyEl.textContent = empty;
    if (usedEl) usedEl.textContent = used;
  }

  async function reloadAll() {
    try {
      hideOldErrors();
      clearMessage();

      await loadWallet();
      await loadVehicles();
      await loadZones();

      renderVehicleSelect();
      renderZoneSelect();
      renderZones();
      renderActiveTable();

      showMessage("Dữ liệu bãi xe đã được đồng bộ.", true);
    } catch (error) {
      console.error(error);
      showMessage(error.message || "Không tải được dữ liệu bãi xe.", false);
    }
  }

  async function checkin() {
    const vehicle = getSelectedVehicle();
    const zoneKey = document.getElementById("zoneKey") ? document.getElementById("zoneKey").value : "";

    if (!vehicle) {
      showMessage("Bạn cần khai báo xe trước khi gửi xe.", false);
      return;
    }

    if (vehicle.status === "parking" || vehicle.isParking) {
      showMessage("Xe này đang gửi trong bãi, không thể gửi thêm lần nữa.", false);
      return;
    }

    if (!zoneKey) {
      showMessage("Vui lòng chọn khu gửi xe còn chỗ trống.", false);
      return;
    }

    const ok = confirm(
      "Xác nhận gửi xe " +
        vehicle.plate +
        "?\nHệ thống sẽ trừ phí từ ví và cập nhật sang Admin."
    );

    if (!ok) return;

    try {
      showMessage("Đang xác nhận gửi xe...", true);

      const data = await callPost("/api/student/parking/checkin", {
        plate: vehicle.plate,
        zoneKey: zoneKey
      });

      if (!data || data.success === false) {
        showMessage(data?.message || "Gửi xe không thành công.", false);
        return;
      }

      showMessage(
        (data.message || "Gửi xe thành công") +
          ". Ô gửi xe: " +
          (data.slotCode || data.slot_code || data.slot?.slotCode || data.slot?.slot_code || "---") +
          ". Số dư còn lại: " +
          money(data.balanceAfter || data.balance || 0),
        true
      );

      await reloadAll();
    } catch (error) {
      console.error(error);
      showMessage(error.message || "Không gửi được xe.", false);
    }
  }

  async function checkout() {
    const vehicle = getSelectedVehicle();

    if (!vehicle) {
      showMessage("Vui lòng chọn xe cần lấy.", false);
      return;
    }

    if (!(vehicle.status === "parking" || vehicle.isParking)) {
      showMessage("Xe này hiện không nằm trong bãi.", false);
      return;
    }

    const ok = confirm("Xác nhận lấy xe " + vehicle.plate + " khỏi bãi?");

    if (!ok) return;

    try {
      showMessage("Đang xác nhận lấy xe...", true);

      const data = await callPost("/api/student/parking/checkout", {
        plate: vehicle.plate
      });

      if (!data || data.success === false) {
        showMessage(data?.message || "Lấy xe không thành công.", false);
        return;
      }

      showMessage(data.message || "Lấy xe thành công.", true);

      await reloadAll();
    } catch (error) {
      console.error(error);
      showMessage(error.message || "Không lấy được xe.", false);
    }
  }

  function bindEvents() {
    const vehicleSelect = document.getElementById("vehicleSelect");

    if (vehicleSelect) {
      vehicleSelect.onchange = renderZoneSelect;
    }
  }

  function init() {
    if (!location.pathname.includes("student-parking")) return;

    hideOldErrors();
    bindEvents();

    window.reloadAll = reloadAll;
    window.loadWallet = loadWallet;
    window.loadVehicles = loadVehicles;
    window.loadZones = loadZones;
    window.renderVehicleSelect = renderVehicleSelect;
    window.renderZoneSelect = renderZoneSelect;
    window.renderZones = renderZones;
    window.renderActiveTable = renderActiveTable;
    window.checkin = checkin;
    window.checkout = checkout;
    window.getSelectedVehicle = getSelectedVehicle;

    reloadAll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
