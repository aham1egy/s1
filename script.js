// عرض فورم تسجيل العميل
function showClientForm() {
    document.getElementById('content').innerHTML = `
        <h2>تسجيل عميل جديد</h2>
        <form onsubmit="saveClient(event)">
            <div class="form-group">
                <label>اسم العميل:</label>
                <input type="text" id="clientName" required>
            </div>
            <div class="form-group">
                <label>رقم الهاتف:</label>
                <input type="text" id="clientPhone" required>
            </div>
            <div class="form-group">
                <label>العنوان:</label>
                <input type="text" id="clientAddress" required>
            </div>
            <button type="submit" class="button">حفظ</button>
        </form>
    `;
}

// عرض صفحة العملاء
function showDebtsPage() {
    const clients = getClients();
    if (clients.length === 0) {
        document.getElementById('content').innerHTML = `
            <h2>العملاء</h2>
            <p>لا توجد بيانات للعملاء. الرجاء إضافة عميل جديد.</p>
        `;
        return;
    }

    let content = `<h2>العملاء</h2><div class="clients-container">`;
    clients.forEach((client, index) => {
        content += `
            <div class="client-card">
                <strong>${client.name}</strong>
                <p>رقم الهاتف: ${client.phone}</p>
                <p>العنوان: ${client.address}</p>
                <button onclick="showClientDebts(${index})">عرض الديون</button>
            </div>
        `;
    });
    content += `</div>`;
    document.getElementById('content').innerHTML = content;
}

// عرض ديون عميل محدد
function showClientDebts(index) {
    const clients = getClients();
    const client = clients[index];

    let content = `
        <h2>ديون العميل: ${client.name}</h2>
        <form onsubmit="addDebt(event, ${index})">
            <div class="form-group">
                <label>اسم الصنف:</label>
                <input type="text" id="itemName" required>
            </div>
            <div class="form-group">
                <label>السعر:</label>
                <input type="number" id="itemPrice" required>
            </div>
            <div class="form-group">
                <label>الكمية:</label>
                <input type="number" id="itemQuantity" required>
            </div>
            <button type="submit" class="button">إضافة الدين</button>
        </form>
        <h3>تفاصيل الديون:</h3>
        <ul>
    `;

    client.debts.forEach(debt => {
        content += `
            <li>
                <strong>الصنف:</strong> ${debt.item} |
                <strong>السعر:</strong> ${debt.price} |
                <strong>الكمية:</strong> ${debt.quantity} |
                <strong>الإجمالي:</strong> ${debt.total}
            </li>
        `;
    });

    content += `
        </ul>
        <button class="button" onclick="showDebtsPage()">رجوع</button>
    `;
    document.getElementById('content').innerHTML = content;
}

// إضافة دين جديد للعميل
function addDebt(event, index) {
    event.preventDefault();

    // قراءة بيانات الدين من الحقول
    const item = document.getElementById('itemName').value;
    const price = parseFloat(document.getElementById('itemPrice').value);
    const quantity = parseInt(document.getElementById('itemQuantity').value);

    // حساب الإجمالي
    const total = price * quantity;

    // تحديث بيانات العميل
    const clients = getClients();
    clients[index].debts.push({ item, price, quantity, total });
    localStorage.setItem('clients', JSON.stringify(clients));

    alert('تم إضافة الدين بنجاح!');
    showClientDebts(index);
}

// حفظ بيانات العميل الجديد
function saveClient(event) {
    event.preventDefault();

    // قراءة بيانات العميل من الحقول
    const name = document.getElementById('clientName').value;
    const phone = document.getElementById('clientPhone').value;
    const address = document.getElementById('clientAddress').value;

    // إنشاء عميل جديد
    const clients = getClients();
    clients.push({ name, phone, address, debts: [] });
    localStorage.setItem('clients', JSON.stringify(clients));

    alert('تم حفظ العميل بنجاح!');
    showClientForm();
}

// جلب العملاء من التخزين المحلي
function getClients() {
    return JSON.parse(localStorage.getItem('clients')) || [];
}

// عرض الإحصائيات
function showStatistics() {
    const clients = getClients();
    let totalDebts = 0;

    clients.forEach(client => {
        client.debts.forEach(debt => {
            totalDebts += debt.total;
        });
    });

    document.getElementById('content').innerHTML = `
        <h2>الإحصائيات</h2>
        <p class="stats">إجمالي الديون: ${totalDebts.toFixed(2)} ريال</p>
        <button class="button" onclick="showDebtsPage()">رجوع</button>
    `;
}
