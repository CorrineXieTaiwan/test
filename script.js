let currentPage = 1;
const totalPages = 2;

// ⚠️ 重要：請將下面的網址替換成您在 Google Apps Script 部署後取得的網頁應用程式網址
// 取得方式：Google Apps Script → 部署 → 新增部署作業 → 選擇網頁應用程式 → 複製網址
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxGAx2vl6GaxtnzNz4jQ_hY5_WGVVJH7hs1dN3cII0EkVqWMYyp3nWcpdN7puYYq-QL/exec';

// 初始化進度條
function updateProgress() {
    const progress = (currentPage / totalPages) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

// 切換到下一頁
function nextPage() {
    const form = document.getElementById('basicInfoForm');
    
    // 驗證表單
    if (form.checkValidity()) {
        currentPage++;
        showPage(currentPage);
        updateProgress();
    } else {
        // 顯示瀏覽器的驗證訊息
        form.reportValidity();
    }
}

// 切換到上一頁
function prevPage() {
    currentPage--;
    showPage(currentPage);
    updateProgress();
}

// 顯示指定頁面
function showPage(pageNumber) {
    // 隱藏所有頁面
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // 顯示指定頁面
    document.getElementById(`page${pageNumber}`).classList.add('active');
}

// 表單提交處理
document.getElementById('lifestyleForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 收集所有表單資料
    const formData = {
        basicInfo: {},
        lifestyle: {
            diet: [],
            transport: [],
            interest: []
        }
    };
    
    // 收集基本資料
    const basicForm = document.getElementById('basicInfoForm');
    const basicFormData = new FormData(basicForm);
    for (let [key, value] of basicFormData.entries()) {
        formData.basicInfo[key] = value;
    }
    
    // 收集飲食習慣
    const dietCheckboxes = document.querySelectorAll('input[name="diet"]:checked');
    dietCheckboxes.forEach(checkbox => {
        formData.lifestyle.diet.push(checkbox.value);
    });
    
    // 收集交通習慣
    const transportCheckboxes = document.querySelectorAll('input[name="transport"]:checked');
    transportCheckboxes.forEach(checkbox => {
        formData.lifestyle.transport.push(checkbox.value);
    });
    
    // 收集生活興趣
    const interestCheckboxes = document.querySelectorAll('input[name="interest"]:checked');
    interestCheckboxes.forEach(checkbox => {
        formData.lifestyle.interest.push(checkbox.value);
    });
    
    // 顯示提交的資料
    console.log('問卷資料：', formData);
    
    // 顯示載入狀態
    const submitButton = document.querySelector('.btn-submit');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = '提交中...';
    
    // 發送資料到 Google Apps Script
    if (GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('資料已成功寫入 Google 試算表');
                // 顯示成功頁面
                currentPage = 3;
                showPage(3);
                updateProgress();
            } else {
                throw new Error(data.error || '提交失敗');
            }
        })
        .catch(error => {
            console.error('提交錯誤：', error);
            alert('提交失敗，請稍後再試。錯誤訊息：' + error.message);
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        });
    } else {
        // 如果還沒有設定 Google Script URL，只顯示成功頁面（用於測試）
        console.warn('請先設定 GOOGLE_SCRIPT_URL');
        alert('請先設定 Google Script URL（參考 GOOGLE_SHEETS_SETUP.md）');
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        
        // 仍顯示成功頁面（用於測試）
        // currentPage = 3;
        // showPage(3);
        // updateProgress();
    }
});

// 重置表單
function resetForm() {
    // 重置所有表單
    document.getElementById('basicInfoForm').reset();
    document.getElementById('lifestyleForm').reset();
    
    // 重置到第一頁
    currentPage = 1;
    showPage(1);
    updateProgress();
}

// 初始化
updateProgress();

