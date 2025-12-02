document.addEventListener('DOMContentLoaded', async () => {
    // --- Firebase Initialization ---
    // تم إلغاء التعليق عن هذه الأسطر لإصلاح الخطأ
    const db = firebase.firestore();
    const auth = firebase.auth();
    const GoogleAuthProvider = firebase.auth.GoogleAuthProvider;

    // --- DOM Elements ---
    const loaderOverlay = document.getElementById('loader-overlay');
    const appScreen = document.getElementById('app-screen');
    const loginModal = document.getElementById('login-modal');
    const teamRegModal = document.getElementById('team-reg-modal');
    const viewTeamsModal = document.getElementById('view-teams-modal');
    const messageModal = document.getElementById('message-modal');
    const teamQueryModal = document.getElementById('team-query-modal');
    const playersContainer = document.getElementById('players-container');
    const freePlayerModal = document.getElementById('free-player-modal');

    // --- Buttons ---
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const exportExcelBtn = document.getElementById('export-excel-btn');
    const queryRegBtn = document.getElementById('query-reg-btn');
    const googleLoginBtn = document.getElementById('google-login-btn');
    const viewTeamsBtn = document.getElementById('view-teams-btn');
    const addTeamBtn = document.getElementById('add-team-btn');
    const addFreePlayerBtn = document.getElementById('add-free-player-btn');
    const removeFreePlayerBtn = document.getElementById('remove-free-player-btn');

    // --- Forms & Inputs ---
    const teamRegForm = document.getElementById('team-reg-form');
    const teamQueryForm = document.getElementById('team-query-form');
    const freePlayerForm = document.getElementById('free-player-form');

    // --- App State ---
    let teamsData = [];
    let freePlayersData = [];
    let isAdminLoggedIn = false;
    let currentUser = null; // لا يزال مهمًا لمعرفة حالة المشرف
    
    const ADMIN_EMAILS = ['nadembadrs2@gmail.com', 'dr.sayed.666@gmail.com'];

    // --- SECURITY: Sanitize user input to prevent XSS ---
    const sanitizeHTML = (str) => {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    };

    // --- UI Functions ---
    const showLoader = () => loaderOverlay.classList.remove('hidden');
    const hideLoader = () => loaderOverlay.classList.add('hidden');
    
    function showMessageModal(title, body, actions = null) {
        document.getElementById('message-modal-title').textContent = title;
        document.getElementById('message-modal-body').innerHTML = body; // Use innerHTML to allow for simple formatting
        const actionsContainer = document.getElementById('message-modal-actions');
        actionsContainer.innerHTML = ''; 
        if (actions && actions.length > 0) {
            actions.forEach(action => {
                const button = document.createElement('button');
                button.textContent = action.text;
                button.className = action.class;
                if (action.callback) button.onclick = action.callback;
                actionsContainer.appendChild(button);
            });
        } else {
                actionsContainer.innerHTML = `<button class="bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">حسنًا</button>`;
                actionsContainer.firstChild.onclick = () => messageModal.classList.add('hidden');
        }
        messageModal.classList.remove('hidden');
    }

    function renderPublicTeamsView(teams) {
        const displayArea = document.getElementById('teams-display-area');
        displayArea.innerHTML = ''; 

        if (teams.length === 0) {
            displayArea.innerHTML = `<p class="text-center text-gray-500 col-span-full py-10">لم يتم تسجيل أي فرق بعد. كن أول المسجلين!</p>`;
            return;
        }

        teams.forEach(team => {
            const playersList = team.players.filter(p => p.trim() !== '').map(player => 
                `<li class="py-1 px-3 bg-gray-100 rounded-md text-sm text-gray-700">${sanitizeHTML(player)}</li>`
            ).join('');

            const lookingForPlayersBadge = team.lookingForPlayers ? `
                <div class="mt-4 p-2 bg-yellow-100 border-r-4 border-yellow-500 text-yellow-800">
                    <p class="font-bold">📢 فريق يبحث عن لاعبين</p>
                    <p class="text-sm">للتواصل مع الكابتن: ${sanitizeHTML(team.captainMobile)}</p>
                </div>` : '';

            const cardHTML = `
                <div class="bg-white rounded-xl shadow-lg p-5 flex flex-col transition hover:shadow-2xl hover:-translate-y-1">
                    <div class="mb-4">
                        <h3 class="text-xl font-bold text-indigo-700">${sanitizeHTML(team.teamName)}</h3>
                        <p class="text-gray-500 text-sm">بقيادة: ${sanitizeHTML(team.captainName)}</p>
                    </div>
                    <div class="flex-grow">
                        <h4 class="font-semibold text-gray-600 mb-2">قائمة اللاعبين:</h4>
                        <ul class="flex flex-wrap gap-2">
                            ${playersList}
                        </ul>
                    </div>
                    ${lookingForPlayersBadge}
                </div>
            `;
            displayArea.insertAdjacentHTML('beforeend', cardHTML);
        });
    }
    
    function renderFreePlayersView(players) {
        const displayArea = document.getElementById('free-players-display-area');
        displayArea.innerHTML = '';
        if (players.length === 0) {
            displayArea.innerHTML = `<p class="text-center text-gray-500 col-span-full py-6">لا يوجد لاعبون يبحثون عن فريق حاليًا.</p>`;
            return;
        }
        players.forEach(player => {
            const cardHTML = `
                <div class="bg-white rounded-lg shadow p-4 text-center">
                    <p class="font-semibold text-gray-800">${sanitizeHTML(player.name)}</p>
                    <p class="text-sm text-gray-600 mt-1">للتواصل: ${sanitizeHTML(player.mobile)}</p>
                </div>
            `;
            displayArea.insertAdjacentHTML('beforeend', cardHTML);
        });
    }
    
    function closeAllModals() {
        document.querySelectorAll('.modal-backdrop').forEach(modal => modal.classList.add('hidden'));
    }

    // --- Firebase Functions ---
    async function findTeamByCaptainNationalId(nationalId) {
        const ref = db.collection("teams");
        const snapshot = await ref.where("captainNationalId", "==", nationalId).limit(1).get();
        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            return { found: true, docId: doc.id, data: doc.data() };
        }
        return { found: false };
    }
    
    async function performTeamDelete(docId) {
        const teamToDelete = teamsData.find(t => t.docId === docId);
        if (!teamToDelete) return;

        // [!! MODIFIED !!] تم إزالة التحقق من الصلاحية
        // يمكن لأي شخص الحذف طالما استدعى هذه الدالة
        
        showLoader();
        try {
            await db.collection("teams").doc(docId).delete();
            showMessageModal('نجاح', 'تم حذف تسجيل الفريق بنجاح.');
        } catch (error) {
            console.error("Error deleting team:", error);
            showMessageModal('خطأ', 'حدث خطأ أثناء الحذف. قد تكون بسبب الصلاحيات.');
        } finally {
            hideLoader();
            closeAllModals();
        }
    }

    // [!! REMOVED !!] دالة "claimTeam" لم تعد مطلوبة
    // async function claimTeam(teamInfo) { ... }

    // --- Event Handlers ---
    function updateUIAfterAuthStateChange(user) {
        currentUser = user; 
        const isUserLoggedIn = !!(user && !user.isAnonymous);
        isAdminLoggedIn = isUserLoggedIn && ADMIN_EMAILS.includes(user.email.toLowerCase());

        adminLoginBtn.classList.toggle('hidden', isUserLoggedIn);
        logoutBtn.classList.toggle('hidden', !isUserLoggedIn);
        
        // الأزرار الخاصة بالإدارة لا تزال تعمل كما هي
        exportExcelBtn.classList.toggle('hidden', !isAdminLoggedIn);
        viewTeamsBtn.classList.toggle('hidden', !isAdminLoggedIn); 
    }

    function generatePlayerInputs() {
        playersContainer.innerHTML = '';
        playersContainer.insertAdjacentHTML('beforeend', `<h4 class="col-span-full text-md font-semibold text-gray-700 mb-2">اللاعبون الأساسيون (8 - مطلوب)</h4>`);
        for (let i = 1; i <= 8; i++) {
            const input = document.createElement('input');
            input.type = 'text'; input.id = `player-name-${i}`;
            input.className = 'player-name-input rtl-input w-full p-3 border border-gray-300 rounded-lg';
            input.required = true; input.placeholder = `اسم اللاعب الأساسي ${i}`;
            playersContainer.appendChild(input);
        }
        playersContainer.insertAdjacentHTML('beforeend', `<h4 class="col-span-full text-md font-semibold text-gray-700 mb-2 mt-6">اللاعبون الاحتياطيون (2 - اختياري)</h4>`);
        for (let i = 9; i <= 10; i++) {
            const input = document.createElement('input');
            input.type = 'text'; input.id = `player-name-${i}`;
            input.className = 'player-name-input rtl-input w-full p-3 border border-gray-300 rounded-lg';
            input.placeholder = `لاعب احتياطي ${i - 8}`;
            playersContainer.appendChild(input);
        }
    }

    function openRegistrationForm(teamInfo = null) {
        teamRegForm.reset();
        generatePlayerInputs();
        const modalTitle = document.getElementById('modal-title');
        const submitBtn = document.getElementById('form-submit-btn');
        const nationalIdInput = document.getElementById('captain-national-id');
        
        document.getElementById('team-doc-id').value = '';
        document.getElementById('looking-for-players').checked = false;


        if (teamInfo && teamInfo.found) {
            // [!! MODIFIED !!] تم إزالة التحقق من الصلاحية
            // أي شخص يصل إلى هنا يمكنه رؤية بيانات التعديل
            
            modalTitle.textContent = `تعديل فريق: ${sanitizeHTML(teamInfo.data.teamName)}`;
            submitBtn.textContent = 'تحديث التسجيل';
            document.getElementById('team-doc-id').value = teamInfo.docId;

            document.getElementById('team-name').value = teamInfo.data.teamName;
            document.getElementById('captain-name').value = teamInfo.data.captainName;
            document.getElementById('captain-mobile').value = teamInfo.data.captainMobile;
            nationalIdInput.value = teamInfo.data.captainNationalId;
            document.getElementById('looking-for-players').checked = teamInfo.data.lookingForPlayers || false;

            nationalIdInput.readOnly = true;
            nationalIdInput.classList.add('bg-gray-100', 'cursor-not-allowed');

            teamInfo.data.players.forEach((player, index) => {
                const playerInput = document.getElementById(`player-name-${index + 1}`);
                if (playerInput) playerInput.value = player;
            });
        } else {
            modalTitle.textContent = `تسجيل فريق جديد`;
            submitBtn.textContent = 'تسجيل الفريق';
            nationalIdInput.readOnly = false;
            nationalIdInput.classList.remove('bg-gray-100', 'cursor-not-allowed');
        }
        teamRegModal.classList.remove('hidden');
    }

    async function handleTeamRegistrationSubmit(e) {
        e.preventDefault();
        
        // [!! MODIFIED !!] تم إزالة التحقق من تسجيل الدخول
        // if (!currentUser || currentUser.isAnonymous) { ... }

        if (!teamRegForm.checkValidity()) {
            showMessageModal('خطأ', 'الرجاء ملء جميع الحقول المطلوبة.');
            teamRegForm.reportValidity(); return;
        }

        const submitBtn = document.getElementById('form-submit-btn');
        submitBtn.disabled = true;

        const mobileInput = document.getElementById('captain-mobile');
        const nationalIdInput = document.getElementById('captain-national-id');
        let isValid = true;

        if (!/^01[0125][0-9]{8}$/.test(mobileInput.value)) {
            document.getElementById('mobile-error').classList.remove('hidden'); isValid = false;
        } else { document.getElementById('mobile-error').classList.add('hidden'); }
        
        if (!/^\d{14}$/.test(nationalIdInput.value)) {
            document.getElementById('national-id-error').classList.remove('hidden'); isValid = false;
        } else { document.getElementById('national-id-error').classList.add('hidden'); }
        
        if(!isValid) { submitBtn.disabled = false; return; }
        
        showLoader();

        const players = Array.from(document.querySelectorAll('.player-name-input'))
            .map(input => input.value.trim()).filter(name => name !== '');

        const teamData = {
            teamName: document.getElementById('team-name').value, 
            captainName: document.getElementById('captain-name').value, 
            captainMobile: mobileInput.value,
            captainNationalId: nationalIdInput.value,
            players: players,
            lookingForPlayers: document.getElementById('looking-for-players').checked,
        };

        const docId = document.getElementById('team-doc-id').value;
        
        try {
            if (!docId) { // This is a new team creation
                const existingTeam = await findTeamByCaptainNationalId(teamData.captainNationalId);
                if (existingTeam.found) {
                    showMessageModal('خطأ', 'الرقم القومي هذا مسجل بالفعل لفريق آخر.');
                    hideLoader(); submitBtn.disabled = false; return;
                }
                
                // [!! MODIFIED !!] تم إزالة إضافة "captainUid"
                // teamData.captainUid = currentUser.uid;
                
                teamData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                await db.collection("teams").add(teamData);
                showMessageModal('تسجيل ناجح!', `تم تسجيل فريق "${sanitizeHTML(teamData.teamName)}" بنجاح.`);

            } else { // This is a team update
                await db.collection("teams").doc(docId).update(teamData);
                showMessageModal('تم التحديث!', 'تم تحديث بيانات فريقك بنجاح.');
            }
            closeAllModals();
        } catch (error) {
            console.error("Error during registration/update:", error);
            showMessageModal('خطأ', `حدث خطأ أثناء حفظ البيانات. ${error.message}`);
        } finally {
            hideLoader(); submitBtn.disabled = false;
        }
    }

    async function handleFreePlayerSubmit(e) {
        e.preventDefault();
        
        // [!! MODIFIED !!] تم إزالة التحقق من تسجيل الدخول
        // if (!currentUser || currentUser.isAnonymous) { ... }

        const submitBtn = document.getElementById('submit-free-player-btn');
        const isAdding = !document.getElementById('free-player-add-view').classList.contains('hidden');
        submitBtn.disabled = true;

        const nationalIdRegex = /^\d{14}$/;
        const mobileRegex = /^01[0125][0-9]{8}$/;

        if (isAdding) { 
            const nameInput = document.getElementById('free-player-name');
            const mobileInput = document.getElementById('free-player-mobile');
            const nationalIdInput = document.getElementById('free-player-national-id');

            if (!nameInput.value.trim() || !mobileRegex.test(mobileInput.value) || !nationalIdRegex.test(nationalIdInput.value)) {
                showMessageModal('خطأ', 'الرجاء إدخال اسم صحيح ورقم موبايل ورقم قومي صحيحين.');
                submitBtn.disabled = false; return;
            }
            showLoader();
            const nationalIdSnapshot = await db.collection("free_players").where("nationalId", "==", nationalIdInput.value).limit(1).get();
            
            // [!! MODIFIED !!] تم إزالة التحقق من "uidSnapshot"
            
            if (!nationalIdSnapshot.empty) {
                hideLoader();
                showMessageModal('خطأ', 'هذا الرقم القومي مسجل بالفعل في القائمة.');
                submitBtn.disabled = false; return;
            }
            
            try {
                await db.collection("free_players").add({
                    name: nameInput.value.trim(),
                    mobile: mobileInput.value,
                    nationalId: nationalIdInput.value,
                    // [!! MODIFIED !!] تم إزالة "playerUid"
                    // playerUid: currentUser.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                hideLoader();
                showMessageModal('نجاح', 'تمت إضافة اسمك إلى القائمة بنجاح.');
                closeAllModals();
            } catch(error) {
                hideLoader();
                console.error("Error adding free player: ", error);
                showMessageModal('خطأ', 'حدث خطأ أثناء الحفظ.');
            }

        } else { // Logic for REMOVING a player
            const nationalIdInput = document.getElementById('free-player-remove-national-id');
            if (!nationalIdRegex.test(nationalIdInput.value)) {
                showMessageModal('خطأ', 'الرجاء إدخال رقم قومي صحيح (14 رقم).');
                submitBtn.disabled = false; return;
            }
            showLoader();
            const snapshot = await db.collection("free_players").where("nationalId", "==", nationalIdInput.value).limit(1).get();
            
            if (snapshot.empty) {
                hideLoader();
                showMessageModal('خطأ', 'الرقم القومي هذا غير موجود في القائمة.');
                submitBtn.disabled = false; return;
            }

            // [!! MODIFIED !!] منطق الحذف تم تبسيطه. إذا وُجد، احذفه.
            const playerDoc = snapshot.docs[0];
            try {
                await playerDoc.ref.delete();
                hideLoader();
                showMessageModal('نجاح', 'تم حذف اسمك من القائمة بنجاح.');
                closeAllModals();
            } catch (error) {
                hideLoader();
                console.error("Error deleting free player: ", error);
                showMessageModal('خطأ', 'حدث خطأ أثناء الحذف.');
            }
        }
        submitBtn.disabled = false;
    }

    function handleViewTeamsClick() {
        // ... (هذه الدالة تبقى كما هي لأنها خاصة بالإدارة)
        // ... (No changes here, this is an Admin-only feature)
        const tableBody = document.getElementById('teams-table-body');
        document.getElementById('view-modal-title').textContent = `الفرق المسجلة (${teamsData.length})`;
        tableBody.innerHTML = ''; 
        if (teamsData.length === 0) {
            const row = tableBody.insertRow();
            row.insertCell().colSpan = 5;
            row.cells[0].textContent = 'لا توجد فرق مسجلة حالياً.';
            row.cells[0].className = 'text-center py-10 text-gray-500';
        } else {
            teamsData.forEach(team => {
                const row = tableBody.insertRow();
                row.innerHTML = `<td class="px-6 py-4 whitespace-nowrap">${sanitizeHTML(team.teamName)}</td> <td class="px-6 py-4 whitespace-nowrap">${sanitizeHTML(team.captainName)}</td> <td class="px-6 py-4 whitespace-nowrap">${sanitizeHTML(team.captainMobile)}</td> <td class="px-6 py-4 whitespace-nowrap">${sanitizeHTML(team.captainNationalId)}</td> <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-left"> <button data-doc-id="${team.docId}" class="edit-team-btn text-indigo-600 hover:text-indigo-900 mr-4">تعديل</button> <button data-doc-id="${team.docId}" class="delete-team-btn text-red-600 hover:text-red-900">حذف</button> </td>`;
            });
        }

        viewTeamsModal.classList.remove('hidden');
        
        document.querySelectorAll('.delete-team-btn').forEach(btn => btn.addEventListener('click', (e) => {
            const docId = e.currentTarget.dataset.docId;
            showMessageModal('تأكيد الحذف', 'هل أنت متأكد من حذف هذا الفريق؟', [
                { text: 'إلغاء', class: 'flex-1 bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300', callback: closeAllModals },
                { text: 'تأكيد الحذف', class: 'flex-1 bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700', callback: () => performTeamDelete(docId) }
            ]);
        }));
        
        document.querySelectorAll('.edit-team-btn').forEach(btn => btn.addEventListener('click', (e) => {
            const docId = e.currentTarget.dataset.docId;
            const teamData = teamsData.find(t => t.docId === docId);
            if(teamData) {
                closeAllModals();
                openRegistrationForm({ found: true, docId: teamData.docId, data: teamData });
            }
        }));
    }

    // --- Init & Data Listeners ---
    function initializeDataListeners() {
        db.collection("teams").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
            teamsData = snapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }));
            document.getElementById('team-count-display').textContent = teamsData.length;
            renderPublicTeamsView(teamsData);
        }, (error) => {
            console.error(`Error listening to teams:`, error); 
            document.getElementById('teams-display-area').innerHTML = `<p class="text-center text-red-500 col-span-full">خطأ في تحميل الفرق.</p>`;
        });

        db.collection("free_players").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
            freePlayersData = snapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }));
            renderFreePlayersView(freePlayersData);
        }, (error) => {
            console.error(`Error listening to free players:`, error);
            document.getElementById('free-players-display-area').innerHTML = `<p class="text-center text-red-500 col-span-full">خطأ في تحميل اللاعبين.</p>`;
        });
    }

    // --- Event Listeners Setup ---
    addTeamBtn.addEventListener('click', () => {
        // [!! MODIFIED !!] تم إزالة التحقق. افتح الفورم مباشرة.
        openRegistrationForm();
    });

    viewTeamsBtn.addEventListener('click', handleViewTeamsClick);
    adminLoginBtn.addEventListener('click', () => loginModal.classList.remove('hidden'));
    document.getElementById('cancel-login-btn').addEventListener('click', () => loginModal.classList.add('hidden'));
    logoutBtn.addEventListener('click', () => {
        auth.signOut();
        auth.signInAnonymously().catch(e => console.error("Re-signing in anonymously failed", e));
    });
    
    googleLoginBtn.addEventListener('click', async () => {
        const provider = new GoogleAuthProvider();
        const loginError = document.getElementById('login-error');
        loginError.classList.add('hidden');
        try {
            await auth.signInWithPopup(provider);
        } catch (error) {
            console.error("Google Sign-In failed:", error);
            showMessageModal('خطأ', 'فشل تسجيل الدخول باستخدام Google. حاول مرة أخرى.');
        }
    });
    
    teamRegForm.addEventListener('submit', handleTeamRegistrationSubmit);
    document.getElementById('cancel-add-btn').addEventListener('click', closeAllModals);
    document.getElementById('close-view-btn').addEventListener('click', closeAllModals);
    
    // [!! REMOVED !!] تم إزالة "freePlayerActionHandler"
    
    addFreePlayerBtn.addEventListener('click', () => {
        // [!! MODIFIED !!] منطق مبسط
        freePlayerForm.reset();
        document.getElementById('free-player-modal-title').textContent = 'تسجيل لاعب حر';
        document.getElementById('submit-free-player-btn').textContent = 'تسجيل';
        document.getElementById('free-player-add-view').classList.remove('hidden');
        document.getElementById('free-player-remove-view').classList.add('hidden');
        document.getElementById('free-player-name').required = true;
        document.getElementById('free-player-mobile').required = true;
        document.getElementById('free-player-national-id').required = true;
        freePlayerModal.classList.remove('hidden');
    });

    removeFreePlayerBtn.addEventListener('click', () => {
        // [!! MODIFIED !!] منطق مبسط
        freePlayerForm.reset();
        document.getElementById('free-player-modal-title').textContent = 'حذف لاعب من القائمة';
        document.getElementById('submit-free-player-btn').textContent = 'حذف';
        document.getElementById('free-player-add-view').classList.add('hidden');
        document.getElementById('free-player-remove-view').classList.remove('hidden');
        document.getElementById('free-player-name').required = false;
        document.getElementById('free-player-mobile').required = false;
        document.getElementById('free-player-national-id').required = true; 
        freePlayerModal.classList.remove('hidden');
    });

    freePlayerForm.addEventListener('submit', handleFreePlayerSubmit);
    document.getElementById('cancel-free-player-btn').addEventListener('click', closeAllModals);

    queryRegBtn.addEventListener('click', () => {
        teamQueryModal.classList.remove('hidden');
        document.getElementById('query-search-view').classList.remove('hidden');
        document.getElementById('query-result-view').classList.add('hidden');
        document.getElementById('query-error').classList.add('hidden');
        teamQueryForm.reset();
    });
    document.getElementById('cancel-query-btn').addEventListener('click', closeAllModals);
    document.getElementById('back-to-query-search').addEventListener('click', () => {
            document.getElementById('query-search-view').classList.remove('hidden');
        document.getElementById('query-result-view').classList.add('hidden');
        document.getElementById('query-error').classList.add('hidden');
        teamQueryForm.reset();
    });

    teamQueryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = e.currentTarget.querySelector('button[type="submit"]');
        submitBtn.disabled = true;

        const nationalIdRegex = /^\d{14}$/;
        const idError = document.getElementById('query-national-id-error');
        const nationalIdInput = document.getElementById('query-national-id');
        if (!nationalIdRegex.test(nationalIdInput.value)) { 
            idError.classList.remove('hidden'); submitBtn.disabled = false; return; 
        }
        idError.classList.add('hidden');
        
        showLoader();
        try {
            const teamInfo = await findTeamByCaptainNationalId(nationalIdInput.value);
            const searchView = document.getElementById('query-search-view');
            const resultView = document.getElementById('query-result-view');
            const errorMsg = document.getElementById('query-error');
            
            if(teamInfo.found) {
                searchView.classList.add('hidden');
                resultView.classList.remove('hidden');
                errorMsg.classList.add('hidden');
                
                const detailsContainer = document.getElementById('query-result-details');
                detailsContainer.innerHTML = `<p><strong>اسم الفريق:</strong> ${sanitizeHTML(teamInfo.data.teamName)}</p> <p><strong>اسم الكابتن:</strong> ${sanitizeHTML(teamInfo.data.captainName)}</p> <p><strong>اللاعبون:</strong></p> <ul class="list-disc pr-6 text-sm text-gray-600"> ${teamInfo.data.players.map(p => `<li>${sanitizeHTML(p)}</li>`).join('')} </ul>`;
                
                const editBtn = document.getElementById('edit-reg-btn');
                const deleteBtn = document.getElementById('delete-reg-btn');

                // [!! MODIFIED !!] منطق مبسط جداً
                // طالما تم العثور على الفريق، أظهر أزرار التعديل والحذف
                
                editBtn.textContent = 'تعديل التسجيل';
                editBtn.classList.remove('hidden');
                deleteBtn.classList.remove('hidden');

                editBtn.onclick = () => { closeAllModals(); openRegistrationForm(teamInfo); };
                
                deleteBtn.onclick = () => { 
                    showMessageModal('تأكيد الحذف', 'هل أنت متأكد من حذف تسجيل فريقك؟', [ 
                        { text: 'إلغاء', class: 'flex-1 bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300', callback: closeAllModals }, 
                        { text: 'تأكيد الحذف', class: 'flex-1 bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700', callback: () => performTeamDelete(teamInfo.docId) } 
                    ]); 
                };
                
                // [!! REMOVED !!] تم إزالة كل المنطق الخاص بـ isUnclaimed, isOwner, canManage

            } else {
                errorMsg.classList.remove('hidden');
            }
        } catch (error) {
            console.error("Error during query search:", error);
            showMessageModal('خطأ', 'حدث خطأ أثناء البحث.');
        } finally {
            hideLoader();
            submitBtn.disabled = false;
        }
    });

    exportExcelBtn.addEventListener('click', () => {
        // ... (هذه الدالة تبقى كما هي لأنها خاصة بالإدارة)
        if (teamsData.length === 0) { showMessageModal('تنبيه', 'لا يوجد بيانات لتصديرها.'); return; }
        
        const dataToExport = teamsData.map(team => {
            const row = { 'اسم الفريق': team.teamName, 'اسم الكابتن': team.captainName, 'موبايل الكابتن': team.captainMobile, 'الرقم القومي للكابتن': team.captainNationalId, 'يبحث عن لاعبين': team.lookingForPlayers ? 'نعم' : 'لا' };
            team.players.forEach((player, index) => { row[`لاعب ${index + 1}`] = player; });
            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'بيانات الفرق');
        worksheet['!cols'] = [ { wch: 25 }, { wch: 25 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 } ];
        XLSX.writeFile(workbook, 'كشف_الفرق_المسجلة.xlsx');
    });

    // --- App Start Logic ---
    auth.onAuthStateChanged((user) => {
        if (user) { 
            updateUIAfterAuthStateChange(user);
            appScreen.classList.remove('hidden');
            appScreen.classList.add('flex');
            loginModal.classList.add('hidden');
            if (!appScreen.classList.contains('initialized')) {
                initializeDataListeners();
                appScreen.classList.add('initialized');
            }
            hideLoader();
        } else { 
            showLoader();
            auth.signInAnonymously().catch(error => {
                // هذا السطر هو ما يسمح بالاتصال بـ Firestore بدون تسجيل دخول
                console.error("Automatic anonymous sign-in failed:", error);
                hideLoader();
                showMessageModal('خطأ فادح', 'لا يمكن الاتصال بالخادم. يرجى تحديث الصفحة.');
            });
        }
    });
});

